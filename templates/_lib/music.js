/* ── 音乐混剪 · 谱面编译器 ─────────────────────────────────────────
   一份「谱面」= 时间网格 + 落在网格上的事件。两种视觉形态读同一份谱面：
     · 点阵 —— 每个事件变成一团同时弹起的点（2/3/5 个一组）
     · 曲谱 —— 每个事件变成一组同时响的音符，字在音符之间跳点
   所以「改一句歌词，整条时间轴重排」在两个形态里是同一套逻辑。

   为什么要编译器这一层
   --------------------
   库里的 aud-* / beat-* 全是「时间轴秒数的纯函数」——改一个参数，
   画面跟着变，但没有任何「这是一首歌」的结构：没有行、没有字、没有小节，
   更没有字落在哪个音上。混剪要的是后者：一份能同时喂给背景层和前景层的谱。

   为什么必须确定性
   ----------------
   渲染管线会把时间轴 seek 到任意时刻逐帧截图（见 render_preview.py 的
   坑 3：必须 tl.seek(t, false)）。任何 Math.random() 都会让同一个模板
   渲两次出来两张图，变动帧占比这种自动验收就废了。所以全部走 hash(a,b,c)：
   同一组参数永远得到同一个数。

   约定
   ----
   · 一拍两列（subdiv=2），列是时间网格的最小单位，也是「跳点」的距离单位
   · 谱行 ROWS=13，五线谱占偶数行（0..12 里 2/4/6/8/10 是线，其余是间）
   · 复节奏 pattern 走 2/3/5 循环 —— 这三数互质，永不对齐，
     「5个键、3个键、2个键」的按法在画面上就长这样
   ──────────────────────────────────────────────────────────────── */
(function (global) {
  'use strict';
  var M = global.MMusic = global.MMusic || {};

  /* 确定性哈希：同一组 (a,b,c) 永远得到同一个 [0,1) 的数 */
  function hash(a, b, c) {
    var h = (a | 0) * 374761393 + (b | 0) * 668265263 + (c | 0) * 2246822519;
    h = (h ^ (h >>> 13)) >>> 0;
    h = Math.imul(h, 1274126177) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  function num(v, d) { var n = parseFloat(v); return (isFinite(n) && n > 0) ? n : d; }
  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }

  /* "5-3-2" / "5,3,2" / "5 3 2" 都能解析 */
  function parsePattern(s) {
    var parts = String(s == null ? '5-3-2' : s).split(/[^0-9]+/);
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      var n = parseInt(parts[i], 10);
      if (n >= 1 && n <= 8) out.push(n);
    }
    return out.length ? out : [5, 3, 2];
  }

  M.hash = hash;
  M.parsePattern = parsePattern;

  /* ── 谱面 ──────────────────────────────────────────────────────
     out = {
       bpm, spb, bpb, seed, pattern, subdiv, colDur,
       cols,          // 总列数（时间网格宽）
       rows,          // 谱行数
       totalBeats, bars, duration,
       notes: [{col,t,dur,beat,onBeat,lead,notes:[{row,lead}]}],
       pulses:[{t,beat,bar,down,size,cells:[{u,v,amp}]}],
       chars: [{ch,line,col,row,t,hop,startCol,gap}]
     }
     ─────────────────────────────────────────────────────────── */
  M.build = function (v) {
    v = v || {};
    var bpm     = clamp(num(v.bpm, 92), 40, 200);
    var spb     = 60 / bpm;
    var bpb     = clamp(Math.round(num(v.beatsPerBar, 4)), 2, 7);
    var seed    = Math.round(num(v.seed, 20261019));
    var pattern = parsePattern(v.pattern);
    var subdiv  = 2;              // 一拍两列
    var colDur  = spb / subdiv;
    var ROWS    = 13;             // 谱行数

    /* 1) 歌词 -> 字表。'|' 或换行分段。 */
    var rawLines = String(v.lyrics == null ? '' : v.lyrics).split(/[|\n]/);
    var lines = [], chars = [];
    for (var a = 0; a < rawLines.length; a++) {
      var s = String(rawLines[a]).trim();
      if (!s) continue;
      var arr = Array.from(s);
      var li = lines.length;
      lines.push(arr.join(''));
      for (var b = 0; b < arr.length; b++) {
        chars.push({ ch: arr[b], line: li });
      }
    }
    if (!chars.length) { lines = ['音乐混剪']; chars = [{ ch: '音', line: 0 }]; }

    /* 2) 跳点：字落在第几列。
          相邻两字跨 2~3 格 = 「两个点、三个点地向前跳跃」。
          换行时多留一格，做换行的呼吸。 */
    var col = 0;
    for (var k = 0; k < chars.length; k++) {
      if (k === 0) {
        chars[k].hop = 2;          // 第一个字从 0 列跳到落点
        chars[k].col = 2;
        col = 2;
      } else {
        var hop = (hash(seed, k, 11) < 0.55) ? 2 : 3;
        if (chars[k].line !== chars[k - 1].line) hop += 1;
        col += hop;
        chars[k].hop = hop;
        chars[k].col = col;
      }
    }
    var totalCols = col + 4;

    /* 3) 旋律走线：每列一个主音行号。随机游走 + 偶发跳进，
          走出来的形状才像旋律而不是噪声。 */
    var lead = new Array(totalCols);
    var r = 3 + Math.floor(hash(seed, 3, 5) * 4);
    for (var c = 0; c < totalCols; c++) {
      var step = (hash(seed, c, 17) < 0.45) ? -1 : 1;
      if (hash(seed, c, 19) < 0.12) step += (hash(seed, c, 23) < 0.5) ? -2 : 2;
      r = clamp(r + step, 1, ROWS - 2);
      lead[c] = r;
    }

    /* 4) 拍与小节 */
    var totalBeats = Math.max(4, Math.ceil(totalCols / subdiv));
    var bars = Math.ceil(totalBeats / bpb);

    /* 5) 每列的音。每拍落一组，组的大小走 2/3/5 循环 —— 屏幕上
          一眼能数出来「这拍是 5 个点」。 */
    var notes = [];
    for (var c2 = 0; c2 < totalCols; c2++) {
      var beat  = Math.floor(c2 / subdiv);
      var onBeat = (c2 % subdiv) === 0;
      var size  = onBeat ? pattern[beat % pattern.length] : 1;
      var ns = [];
      var used = {};
      used[lead[c2]] = 1;
      ns.push({ row: lead[c2], lead: true });
      for (var n = 1; n < size; n++) {
        var dir = hash(seed, c2, 41 + n) < 0.5 ? -1 : 1;
        var off = 1 + Math.floor(hash(seed, c2, 31 + n) * 3);
        var rr  = clamp(lead[c2] + dir * off, 0, ROWS - 1);
        var guard = 0;
        while (used[rr] && guard < 8) { rr = clamp(rr + dir, 0, ROWS - 1); guard++; }
        used[rr] = 1;
        ns.push({ row: rr, lead: false });
      }
      notes.push({ col: c2, t: c2 * colDur, dur: colDur, beat: beat,
                   onBeat: onBeat, lead: lead[c2], notes: ns });
    }

    /* 6) 拍点脉冲（点阵形态用）：每拍一团，团里 size 个点同时落 */
    var pulses = [];
    for (var bt = 0; bt < totalBeats; bt++) {
      var sz = pattern[bt % pattern.length];
      var cells = [];
      for (var q = 0; q < sz; q++) {
        /* 每点独立取角度 -> 散成一团，不是整齐的一个圈 */
        var ang = hash(seed, bt, 69 + q) * 6.28318;
        var rad = 0.05 + hash(seed, bt, 59 + q) * 0.19;
        cells.push({
          u: clamp(0.5 + Math.cos(ang) * rad * 1.8, 0, 1),
          v: clamp(0.5 + Math.sin(ang) * rad, 0, 1),
          amp: 0.55 + hash(seed, bt, 61 + q) * 0.45
        });
      }
      pulses.push({ t: bt * spb, beat: bt, bar: Math.floor(bt / bpb) + 1,
                    down: (bt % bpb) === 0, size: sz, cells: cells });
    }

    /* 7) 字的时间表 */
    for (var k2 = 0; k2 < chars.length; k2++) {
      var cc = chars[k2];
      cc.t        = cc.col * colDur;
      cc.row      = lead[cc.col];
      cc.startCol = cc.col - cc.hop;   // 跳之前待着的位置
      cc.gap      = cc.hop * colDur;    // 跨了几格 = 几拍
    }

    return {
      bpm: bpm, spb: spb, bpb: bpb, seed: seed, pattern: pattern,
      subdiv: subdiv, colDur: colDur, cols: totalCols, rows: ROWS,
      totalBeats: totalBeats, bars: bars,
      duration: totalBeats * spb + 0.7,
      notes: notes, pulses: pulses, chars: chars, lead: lead, lines: lines
    };
  };
})(window);
