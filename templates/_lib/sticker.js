/* ============================================================================
   sticker.js —— 13 种设计语言 × 非全屏可嵌入小素材
   ----------------------------------------------------------------------------
   这批素材和库里其他东西不是一类：
     · 别的模板是 1920×1080 满幅，占满整个画面；
     · 这批是 480×270 的**透明底小挂件**，元素只占画面一小块，
       可以直接丢进视频的任意位置（角落 / 中间 / 底部通栏）。
   所以 10 个位置锚点 × 每族 10 个专属元素，130 条。

   两条铁律（和 music.js 同源，别改）
   ----------------------------------------------------------------------------
   1. **画面是时间的纯函数**：整片只有一条 GSAP 补间推进一个 {t:0} 代理，
      onUpdate 调 render(t)。不用链式补间驱动元素——链式补间的起始值是
      懒捕获的，回退 seek 时会抢属性、越渲越乱，而渲染管线就是逐帧 seek。
   2. **禁用 Math.random()**，随机一律走 hash()。逐帧 seek 会让同一模板
      渲两次出两张图，自动验收就废了。

   动效怎么做到无缝循环
   ----------------------------------------------------------------------------
   不用「弹入 → 停顿 → 弹出」这种硬入场（循环点会跳帧，预览片里能看出来）。
   所有运动量都是相位 p 的**连续周期函数**（sin / 三角波），
   于是 p=1 和 p=0 的画面完全一致 → 循环无缝 → 变动帧占比接近 100%。
   ========================================================================== */
(function (global) {
  'use strict';

  /* ---------------------------------------------------------------- 确定性 */
  function hash(a, b, c) {
    var h = (a | 0) * 374761393 + (b | 0) * 668265263 + (c | 0) * 1442695041;
    h = (h ^ (h >>> 13)) >>> 0;
    h = Math.imul(h, 1274126177) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function mkRng(seed) {
    var s = (seed >>> 0) || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }

  /* ------------------------------------------------------------------ 数学 */
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  /** 三角波：x 的周期是 1，值在 0..1 之间来回，且 x→1⁻ 与 x=0 连续。
   *  循环无缝的关键工具。 */
  function tri(x) { var f = x - Math.floor(x); return 1 - Math.abs(2 * f - 1); }
  /** 环形余弦，1 → 0 → 1 无缝。 */
  function bell(x) { return 0.5 - 0.5 * Math.cos((x - Math.floor(x)) * Math.PI * 2); }
  function TAU() { return Math.PI * 2; }

  /* ------------------------------------------------------------------ 颜色
     调色板存的是 [h,s,l] 数组，但形态层经常把它**直接**丢给 ctx.strokeStyle。
     数组不是合法颜色，浏览器会静默保留上一次的颜色（画出来是黑的，还不报错）。
     所以这里做一个「包装对象」：toString() 直接吐出 hsl() 字符串，
     数组塞进 strokeStyle 时会被 JS 隐式转成字符串 → 合法颜色。
     同时 hsl()/hslA() 认得 .raw，把包装还原成数组继续算。 */
  function hsl(c, dh, ds, dl) {
    if (c && c.raw) c = c.raw;
    if (typeof c === 'string') return c;
    var h = (c[0] + (dh || 0)) % 360; if (h < 0) h += 360;
    var s = clamp(c[1] + (ds || 0), 0, 100);
    var l = clamp(c[2] + (dl || 0), 0, 100);
    return 'hsl(' + h.toFixed(1) + ',' + s.toFixed(1) + '%,' + l.toFixed(1) + '%)';
  }
  function hslA(c, a, dh, ds, dl) {
    if (c && c.raw) c = c.raw;
    if (typeof c === 'string') return c;
    var h = (c[0] + (dh || 0)) % 360; if (h < 0) h += 360;
    var s = clamp(c[1] + (ds || 0), 0, 100);
    var l = clamp(c[2] + (dl || 0), 0, 100);
    return 'hsla(' + h.toFixed(1) + ',' + s.toFixed(1) + '%,' + l.toFixed(1) + '%,' + a + ')';
  }
  /** 调色板项 → 能直接当 CSS 颜色用的对象 */
  function palEntry(c) {
    return { raw: c, toString: function () { return hsl(c); } };
  }

  /* ------------------------------------------------------------------ 路径 */
  function roundRect(ctx, x, y, w, h, r) {
    var rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y); ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr); ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr); ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }
  /** 有机团块：n 个控制点用余弦扰动，seed 决定形状。 */
  function blobPath(ctx, cx, cy, r, n, seed, rough, squash) {
    var rng = mkRng(seed);
    var pts = [], i;
    for (i = 0; i < n; i++) {
      var a = (i / n) * TAU();
      var rr = r * (1 - rough + rough * 2 * rng());
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * (squash || 1)]);
    }
    ctx.beginPath();
    ctx.moveTo((pts[0][0] + pts[n - 1][0]) / 2, (pts[0][1] + pts[n - 1][1]) / 2);
    for (i = 0; i < n; i++) {
      var p1 = pts[i], p2 = pts[(i + 1) % n];
      ctx.quadraticCurveTo(p1[0], p1[1], (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2);
    }
    ctx.closePath();
  }
  function starPath(ctx, cx, cy, r1, r2, n, rot) {
    ctx.beginPath();
    var i, a, r;
    for (i = 0; i < n * 2; i++) {
      a = (rot || 0) + (i / (n * 2)) * TAU();
      r = (i % 2 === 0) ? r1 : r2;
      var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
  function polyPath(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  }
  function arcPath(ctx, cx, cy, r, a0, a1) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a1);
  }
  function wavePath(ctx, x, y, w, amp, cycles, phase) {
    ctx.beginPath();
    for (var i = 0; i <= 64; i++) {
      var u = i / 64;
      var px = x + u * w;
      var py = y + Math.sin(u * cycles * TAU() + (phase || 0)) * amp;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
  }
  /** 花瓣形：一条对称的贝塞尔。 */
  function petalPath(ctx, cx, cy, len, wid, ang) {
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(wid, len * 0.28, wid * 0.72, len * 0.78, 0, len);
    ctx.bezierCurveTo(-wid * 0.72, len * 0.78, -wid, len * 0.28, 0, 0);
    ctx.closePath();
    ctx.restore();
  }
  function leafPath(ctx, cx, cy, len, wid, ang) {
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(wid, len * 0.4, 0, len);
    ctx.quadraticCurveTo(-wid, len * 0.4, 0, 0);
    ctx.closePath();
    ctx.restore();
  }
  /** 飘带：一条随时间起伏的带子。 */
  function ribbonPath(ctx, x, y, w, h, t, segs) {
    ctx.beginPath();
    var i, u, px, py, nx, ny;
    for (i = 0; i <= (segs || 24); i++) {
      u = i / (segs || 24);
      px = x + u * w;
      py = y + Math.sin(u * TAU() * 1.5 + t * 2.2) * h * 0.5;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    for (i = (segs || 24); i >= 0; i--) {
      u = i / (segs || 24);
      px = x + u * w;
      py = y + Math.sin(u * TAU() * 1.5 + t * 2.2) * h * 0.5 + h * 0.35;
      ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  /* ================================================================ 材质层
     13 种设计语言。同一套「形态」在不同材质下长成完全不同的东西——
     形态决定「是什么」，材质决定「长什么样、什么手感」。
     每个材质实现同一组接口：
       backing(ctx,w,h,t)    元素后面的底衬（霓虹/星空这类需要个暗底才亮）
       decor(ctx,w,h,t)      背景装饰（已裁剪在元素盒内）
       fill(ctx,pathFn,color,o)
       stroke(ctx,pathFn,color,w,o)
       text(ctx,s,x,y,size,color,o)
       particle(ctx,x,y,r,color,o)
       post(ctx,w,h,t)       整帧后期（颗粒 / 扫描线 / 晕染 / 暗角）
  ======================================================================== */
  var MAT = {};

  /* ---------------------------------------------------------------- 文字自适应
     元素盒是「小挂件」的边界，字画出去就会被 clip 切掉 ——
     踩过：film-07 的 "SCENE 04" 只剩 "SCE"，cosmic-10 的坐标牌糊成一团。
     这里在每个材质的 text() 里量一下宽度，超了就缩字号，
     宁可字小一点，也不能被切。

     CURW 由引擎在 render() 里设成当前元素盒的宽度。 */
  var CURW = 0;

  function fitFont(ctx, s, size, maxW) {
    if (!maxW || maxW <= 0 || !s) return size;
    var wm = ctx.measureText(s).width;
    if (wm > maxW) {
      var ns = Math.max(5, Math.floor(size * maxW / wm));
      // 把当前 font 里的字号换掉（ctx.font 已经是目标字号的字体）
      ctx.font = ctx.font.replace(/(\d+(?:\.\d+)?)px/, ns + 'px');
      size = ns;
    }
    return size;
  }

  /* 柔和暗底：给发光的东西一个能站住的地方。
     用径向渐变而不是实心方块 —— 形状还在，边缘是化开的。 */
  function halo(ctx, w, h, rgb, a0, a1) {
    /* 半径取半对角线：四个角落在渐变之外 → 角上 alpha 归零，
       不会在盒子里留下一个方方正正的色块。 */
    var r = Math.sqrt(w * w + h * h) * 0.32;
    var g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, r);
    g.addColorStop(0, 'rgba(' + rgb + ',' + a0 + ')');
    g.addColorStop(0.5, 'rgba(' + rgb + ',' + (a0 * 0.34) + ')');
    g.addColorStop(1, 'rgba(' + rgb + ',' + a1 + ')');
    ctx.save();
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  /* --- 1. 赛博霓虹：辉光三层描边 + 扫描带 + 网格地平线 --- */
  MAT.cyber = {
    pal: [[188, 100, 55], [328, 100, 58], [272, 92, 66], [190, 90, 88], [210, 40, 16]],
    backing: function (ctx, w, h) { halo(ctx, w, h, '3,6,16', 0.42, 0); },
    decor: function (ctx, w, h, t) {
      ctx.save();
      /* 笔触用径向渐变：中心密、往边缘淡到 0。
         用平涂的话，网格铺满盒子 → 盒外沿是一圈硬边直线，
         叠到彩色画面上像一块「贴上去的网格纸」。 */
      var gg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2,
                                        Math.sqrt(w * w + h * h) * 0.40);
      gg.addColorStop(0, hslA(this.pal[0], 0.13));
      gg.addColorStop(1, hslA(this.pal[0], 0));
      ctx.strokeStyle = gg; ctx.lineWidth = 1;
      for (var x = 0; x <= w; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (var y = 0; y <= h; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.globalAlpha = 1;
      /* 扫描带也用径向渐变：原来只有上下渐隐，左右是硬边，
         叠到画面上像一条被裁断的横条。
         ⚠️ 用的是**循环相位 p**（引擎传的），而且做成**往复**扫描 ——
         原来 `((t*0.55)%1)` 是绝对时间的线性斜坡，
         t=0 和 t=duration 位置完全不同 → 循环接缝处整条带子跳一下。 */
      var band = (0.5 + 0.5 * Math.sin(p * TAU())) * (h + 60) - 30;
      var g = ctx.createRadialGradient(w / 2, band, 0, w / 2, band, Math.max(w, h) * 0.5);
      g.addColorStop(0, hslA(this.pal[0], 0.12));
      g.addColorStop(0.6, hslA(this.pal[0], 0.05));
      g.addColorStop(1, hslA(this.pal[0], 0));
      ctx.fillStyle = g; ctx.fillRect(0, band - 44, w, 88);
      ctx.restore();
    },
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.45;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.7;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      var a = o.alpha == null ? 1 : o.alpha;
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = c; ctx.shadowBlur = 14;
      ctx.globalAlpha = a * 0.5; ctx.strokeStyle = c; ctx.lineWidth = lw * 2.6;
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = lw;
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.globalAlpha = a * 0.9; ctx.strokeStyle = hsl(this.pal[3], 0, 0, 14);
      ctx.lineWidth = Math.max(0.6, lw * 0.34);
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '800 ' + size + 'px MiSans, "PingFang SC", sans-serif';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center';
      ctx.textBaseline = o.baseline || 'middle';
      ctx.shadowColor = c; ctx.shadowBlur = 18;
      ctx.fillStyle = c; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillText(s, x, y);
      ctx.shadowBlur = 0;
      ctx.fillStyle = hsl(this.pal[3], 0, 0, 18);
      ctx.fillText(s, x, y);
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = c; ctx.shadowBlur = 10;
      ctx.fillStyle = c; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU()); ctx.fill();
      ctx.restore();
    },
    post: function (ctx, w, h) {
      ctx.save();
      ctx.globalAlpha = 0.055; ctx.fillStyle = '#000';
      for (var y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
      ctx.restore();
    }
  };

  /* --- 2. 花卉水彩：半透明叠色 + 边缘晕开 --- */
  MAT.floral = {
    pal: [[345, 62, 72], [95, 34, 46], [40, 55, 93], [280, 34, 70], [18, 70, 84]],
    backing: function (ctx, w, h) { halo(ctx, w, h, '255,250,244', 0.34, 0); },
    decor: function (ctx, w, h) {
      ctx.save();
      for (var i = 0; i < 7; i++) {
        var x = hash(i, 3, 1) * w, y = hash(i, 7, 2) * h, r = 30 + hash(i, 11, 3) * 50;
        var g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, hslA(this.pal[i % 5], 0.07));
        g.addColorStop(1, hslA(this.pal[i % 5], 0));
        ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      ctx.restore();
    },
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = (o.alpha == null ? 0.85 : o.alpha) * 0.55;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.globalAlpha = (o.alpha == null ? 0.85 : o.alpha) * 0.3;
      ctx.shadowColor = c; ctx.shadowBlur = 9;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = (o.alpha == null ? 0.8 : o.alpha) * 0.6;
      ctx.strokeStyle = c; ctx.lineWidth = lw * 1.7; ctx.lineCap = 'round';
      ctx.shadowColor = c; ctx.shadowBlur = 6;
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '700 ' + size + 'px MiSans, "PingFang SC", serif';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
      ctx.globalAlpha = o.alpha == null ? 0.92 : o.alpha;
      ctx.fillStyle = c; ctx.fillText(s, x, y);
      ctx.globalAlpha = (o.alpha == null ? 0.92 : o.alpha) * 0.4;
      ctx.shadowColor = c; ctx.shadowBlur = 7; ctx.fillText(s, x, y);
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 0.5 : o.alpha;
      var g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2);
      g.addColorStop(0, hslA(c, 0.8)); g.addColorStop(1, hslA(c, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, TAU()); ctx.fill();
      ctx.restore();
    },
    post: function (ctx, w, h) {
      ctx.save();
      ctx.globalAlpha = 0.05;
      var rng = mkRng(4242);
      for (var i = 0; i < 90; i++) {
        ctx.fillStyle = hsl(this.pal[1], 0, 0, rng() * 30 - 15);
        ctx.beginPath(); ctx.arc(rng() * w, rng() * h, rng() * 1.6, 0, TAU()); ctx.fill();
      }
      ctx.restore();
    }
  };

  /* --- 3. 厚涂油画：短促厚笔触 + 画布经纬 --- */
  MAT.impasto = {
    pal: [[28, 62, 48], [206, 58, 32], [42, 44, 90], [86, 34, 38], [16, 30, 18]],
    backing: function (ctx, w, h) { halo(ctx, w, h, '236,224,196', 0.38, 0); },
    decor: function (ctx, w, h) {
      ctx.save();
      ctx.globalAlpha = 0.028; ctx.strokeStyle = hsl(this.pal[3]); ctx.lineWidth = 1;
      for (var x = 0; x <= w; x += 6) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (var y = 0; y <= h; y += 6) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.restore();
    },
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      // 厚涂：把一条线拆成很多短促的笔触，每笔方向微抖、透明度微抖
      var rng = mkRng(o.seed || 91);
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha);
      ctx.strokeStyle = c; ctx.lineWidth = lw;
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      // 表面高光：一层更亮的短划
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.45;
      ctx.strokeStyle = hsl(this.pal[2], 0, 0, 12);
      ctx.lineWidth = lw * 0.3;
      ctx.translate(-0.8, -1.2);
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '800 ' + size + 'px MiSans, "PingFang SC", serif';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c; ctx.fillText(s, x, y);
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.5;
      ctx.fillStyle = hsl(this.pal[2], 0, 0, 10);
      ctx.fillText(s, x - 1, y - 1.4);
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU()); ctx.fill();
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.6;
      ctx.fillStyle = hsl(this.pal[2], 0, 0, 14);
      ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.3, r * 0.45, 0, TAU()); ctx.fill();
      ctx.restore();
    },
    post: function (ctx, w, h) {
      ctx.save();
      ctx.globalAlpha = 0.16; ctx.globalCompositeOperation = 'overlay';
      var rng = mkRng(77);
      for (var i = 0; i < 160; i++) {
        ctx.fillStyle = hsl(this.pal[3], 0, 0, rng() * 40 - 20);
        ctx.fillRect(rng() * w, rng() * h, 2 + rng() * 7, 2 + rng() * 5);
      }
      ctx.restore();
    }
  };

  /* --- 4. 可爱动漫：粗描边 + 圆角 + 高光点 --- */
  MAT.kawaii = {
    pal: [[44, 100, 68], [348, 100, 76], [202, 100, 76], [158, 60, 72], [16, 40, 24]],
    backing: function (ctx, w, h) { halo(ctx, w, h, '255,250,240', 0.20, 0); },
    decor: function (ctx, w, h) {
      ctx.save();
      for (var i = 0; i < 9; i++) {
        var x = hash(i, 5, 1) * w, y = hash(i, 9, 2) * h, r = 2 + hash(i, 13, 3) * 3;
        ctx.globalAlpha = 0.4; ctx.fillStyle = hsl(this.pal[1]);
        starPath(ctx, x, y, r, r * 0.4, 4, 0.4); ctx.fill();
      }
      ctx.restore();
    },
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.strokeStyle = c; ctx.lineWidth = lw;
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '800 ' + size + 'px MiSans, "PingFang SC", sans-serif';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = hsl(this.pal[4]); ctx.lineWidth = size * 0.20;
      ctx.strokeText(s, x, y);
      ctx.fillStyle = c; ctx.fillText(s, x, y);
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU()); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.35, r * 0.4, 0, TAU()); ctx.fill();
      ctx.restore();
    },
    post: function () {}
  };

  /* --- 5. 像素 8-bit：低分辨率离屏画布 + 最近邻放大 + 限色板 --- */
  MAT.pixel = {
    pal: [[0, 0, 12], [350, 78, 62], [46, 92, 58], [200, 76, 52], [28, 12, 86]],
    backing: function (ctx, w, h) { halo(ctx, w, h, '10,10,26', 0.44, 0); },
    decor: function () {},
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.strokeStyle = c; ctx.lineWidth = lw;
      ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '800 ' + size + 'px MiSans, "PingFang SC", sans-serif';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c; ctx.fillText(s, x, y);
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x - r), Math.round(y - r), Math.max(1, r * 2), Math.max(1, r * 2));
      ctx.restore();
    },
    post: function () {}
  };

  /* --- 6. 纸艺剪贴：分层投影 + 折角高光 + 撕边 --- */
  MAT.paper = {
    pal: [[42, 34, 92], [30, 38, 68], [205, 24, 66], [30, 18, 18], [0, 0, 100]],
    /* 水墨的底衬只是「一点纸的空气感」。
       原来 alpha 0.38 的宣纸色在透明素材上是一整块米色椭圆 ——
       叠到深色画面上就是一块贴上去的纸片，不是挂件。
       调淡到 0.14：浅色画面上几乎看不出，深色画面上勉强托住墨。 */
    backing: function (ctx, w, h) { halo(ctx, w, h, '246,241,230', 0.14, 0); },
    decor: function (ctx, w, h) {
      ctx.save();
      ctx.globalAlpha = 0.10; ctx.fillStyle = hsl(this.pal[3]);
      for (var i = 0; i < 5; i++) {
        var x = hash(i, 21, 1) * w, y = hash(i, 31, 2) * h;
        ctx.save(); ctx.translate(x, y); ctx.rotate(hash(i, 41, 3) * TAU());
        ctx.fillRect(-30, -3, 60, 6); ctx.restore();
      }
      ctx.restore();
    },
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.shadowColor = 'rgba(0,0,0,.34)'; ctx.shadowBlur = o.blur == null ? 8 : o.blur;
      ctx.shadowOffsetY = o.dy == null ? 4 : o.dy;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '800 ' + size + 'px MiSans, "PingFang SC", sans-serif';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c; ctx.fillText(s, x, y);
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.35;
      ctx.fillStyle = hsl(this.pal[0], 0, 0, 22);
      ctx.fillText(s, x, y + Math.max(1, size * 0.06));
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x - r), Math.round(y - r), Math.max(1, r * 2), Math.max(1, r * 2));
      ctx.restore();
    },
    post: function () {}
  };

  /* --- 7. 工业金属：拉丝渐变 + 铆钉 + 锈斑 --- */
  MAT.metal = {
    pal: [[210, 8, 62], [18, 66, 44], [44, 88, 58], [220, 6, 16], [30, 12, 88]],
    backing: function (ctx, w, h) { halo(ctx, w, h, '28,31,38', 0.38, 0); },
    decor: function (ctx, w, h) {
      ctx.save();
      ctx.globalAlpha = 0.030; ctx.strokeStyle = hsl(this.pal[3]); ctx.lineWidth = 1;
      for (var y = 0; y < h; y += 3) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.restore();
    },
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      var bb = o.box || { x: 0, y: 0, w: 10, h: 10 };
      var g = ctx.createLinearGradient(bb.x, bb.y, bb.x + bb.w, bb.y + bb.h);
      g.addColorStop(0, hsl(c, 0, 0, 16));
      g.addColorStop(0.35, hsl(c, 0, 0, 6));
      g.addColorStop(0.55, hsl(c, 0, 0, 12));
      g.addColorStop(1, hsl(c, 0, 0, -8));
      ctx.fillStyle = g; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineJoin = 'round';
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '800 ' + size + 'px MiSans, "PingFang SC", sans-serif';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = hsl(c, 0, -10, -14);
      ctx.fillText(s, x, y);
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.55;
      ctx.fillStyle = hsl(c, 0, 0, 26);
      ctx.fillText(s, x - 1, y - 1.6);
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, 0, x, y, r);
      g.addColorStop(0, hsl(c, 0, 0, 34)); g.addColorStop(1, hsl(c, 0, 0, -16));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU()); ctx.fill();
      ctx.restore();
    },
    post: function (ctx, w, h) {
      ctx.save();
      ctx.globalAlpha = 0.13;
      var rng = mkRng(313);
      for (var i = 0; i < 26; i++) {
        var x = rng() * w, y = rng() * h, r = 3 + rng() * 12;
        var g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, hslA(this.pal[1], 0.7)); g.addColorStop(1, hslA(this.pal[1], 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU()); ctx.fill();
      }
      ctx.restore();
    }
  };

  /* --- 8. 熔岩流体：黑底 + 高对比熔融渐变 + 加色辉光 --- */
  MAT.molten = {
    pal: [[12, 100, 52], [38, 100, 58], [0, 0, 6], [20, 34, 34], [0, 0, 0]],
    backing: function (ctx, w, h) { halo(ctx, w, h, '8,4,6', 0.44, 0); },
    decor: function (ctx, w, h) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      var g = ctx.createRadialGradient(w * 0.5, h * 0.55, 0, w * 0.5, h * 0.55, w * 0.5);
      g.addColorStop(0, hslA(this.pal[1], 0.20));
      g.addColorStop(1, hslA(this.pal[1], 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.restore();
    },
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      var bb = o.box || { x: 0, y: 0, w: 10, h: 10 };
      var g = ctx.createRadialGradient(bb.x + bb.w * 0.4, bb.y + bb.h * 0.3, 0,
                                       bb.x + bb.w * 0.5, bb.y + bb.h * 0.5, Math.max(bb.w, bb.h) * 0.75);
      g.addColorStop(0, hsl(c, 0, 0, 26));
      g.addColorStop(0.55, hsl(c));
      g.addColorStop(1, hsl(c, 0, 0, -30));
      ctx.fillStyle = g; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.7;
      ctx.shadowColor = c; ctx.shadowBlur = 12;
      ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineCap = 'round';
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '800 ' + size + 'px MiSans, "PingFang SC", sans-serif';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.shadowColor = c; ctx.shadowBlur = 16; ctx.fillStyle = c;
      ctx.fillText(s, x, y);
      ctx.shadowBlur = 0; ctx.fillStyle = '#fff';
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.75;
      ctx.fillText(s, x, y);
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.shadowColor = c; ctx.shadowBlur = 10; ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU()); ctx.fill();
      ctx.restore();
    },
    post: function () {}
  };

  /* --- 9. 禅意水墨：枯笔飞白 + 洇墨晕边 + 朱砂印 --- */
  MAT.ink = {
    pal: [[30, 12, 14], [4, 62, 46], [40, 22, 88], [0, 0, 100], [0, 0, 70]],
    backing: function (ctx, w, h) { halo(ctx, w, h, '246,241,228', 0.38, 0); },
    decor: function (ctx, w, h) {
      ctx.save();
      ctx.globalAlpha = 0.05; ctx.fillStyle = hsl(this.pal[0]);
      for (var i = 0; i < 40; i++) {
        var x = hash(i, 51, 1) * w, y = hash(i, 61, 2) * h;
        ctx.beginPath(); ctx.arc(x, y, hash(i, 71, 3) * 2.4, 0, TAU()); ctx.fill();
      }
      ctx.restore();
    },
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.82;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      // 洇墨：底下先铺一层模糊的宽墨
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.28;
      ctx.shadowColor = c; ctx.shadowBlur = 10; ctx.lineWidth = lw * 1.5;
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.shadowBlur = 0; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.lineWidth = lw; ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '700 ' + size + 'px MiSans, "PingFang SC", serif';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
      ctx.globalAlpha = o.alpha == null ? 0.9 : o.alpha;
      ctx.fillStyle = c; ctx.fillText(s, x, y);
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 0.7 : o.alpha;
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU()); ctx.fill();
      ctx.globalAlpha = (o.alpha == null ? 0.7 : o.alpha) * 0.3;
      ctx.shadowColor = c; ctx.shadowBlur = 7;
      ctx.beginPath(); ctx.arc(x, y, r * 1.3, 0, TAU()); ctx.fill();
      ctx.restore();
    },
    post: function () {}
  };

  /* --- 10. 蒸汽波：透视网格 + 落日 + 铬金字 --- */
  MAT.vapor = {
    pal: [[322, 100, 66], [176, 82, 60], [44, 100, 68], [268, 60, 26], [200, 90, 88]],
    backing: function (ctx, w, h) { halo(ctx, w, h, '30,16,62', 0.42, 0); },
    decor: function (ctx, w, h) {
      ctx.save();
      ctx.globalAlpha = 0.035; ctx.strokeStyle = hsl(this.pal[1]); ctx.lineWidth = 1;
      for (var i = -8; i <= 8; i++) {
        ctx.beginPath(); ctx.moveTo(w / 2 + i * 12, h * 0.55); ctx.lineTo(w / 2 + i * 90, h); ctx.stroke();
      }
      for (var y = h * 0.58; y < h; y += 7) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      ctx.restore();
    },
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.shadowColor = c; ctx.shadowBlur = 10;
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '800 ' + size + 'px MiSans, "PingFang SC", sans-serif';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      // 铬字：深色描边 + 顶部亮渐变
      ctx.lineJoin = 'round';
      ctx.strokeStyle = hsl(this.pal[3]); ctx.lineWidth = size * 0.16;
      ctx.strokeText(s, x, y);
      var g = ctx.createLinearGradient(0, y - size * 0.5, 0, y + size * 0.5);
      g.addColorStop(0, hsl(this.pal[2], 0, 0, 26));
      g.addColorStop(0.48, hsl(this.pal[2], 0, 0, -18));
      g.addColorStop(0.52, hsl(this.pal[4]));
      g.addColorStop(1, hsl(this.pal[0]));
      ctx.fillStyle = g; ctx.fillText(s, x, y);
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || '';
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.shadowColor = c; ctx.shadowBlur = 8; ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU()); ctx.fill();
      ctx.restore();
    },
    post: function () {}
  };

  /* --- 11. 胶片复古：褪色 + 颗粒 + 漏光 + 划痕 --- */
  MAT.film = {
    pal: [[28, 46, 44], [188, 22, 54], [34, 48, 90], [0, 0, 96], [0, 0, 10]],
    backing: function (ctx, w, h) { halo(ctx, w, h, '34,26,18', 0.32, 0); },
    decor: function (ctx, w, h, t) {
      ctx.save();
      // 漏光（用循环相位 p 的整数圈正弦，保证首尾一致）
      var lx = w * (0.5 + 0.42 * Math.sin(p * TAU()));
      var g = ctx.createRadialGradient(lx, h * 0.4, 0, lx, h * 0.4, w * 0.45);
      g.addColorStop(0, hslA(this.pal[0], 0.20));
      g.addColorStop(1, hslA(this.pal[0], 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.restore();
    },
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '800 ' + size + 'px MiSans, "PingFang SC", monospace';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c; ctx.fillText(s, x, y);
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.4;
      ctx.fillStyle = hsl(this.pal[3], 0, 0, 22);
      ctx.fillText(s, x + 1.2, y + 1.2);
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 0.8 : o.alpha;
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU()); ctx.fill();
      ctx.restore();
    },
    post: function (ctx, w, h, p) {
      ctx.save();
      // 颗粒：按帧号取种子，噪声每帧都换，但同一相位永远一样
      // % 24 是为了循环无缝：p=1 时帧号要绕回 p=0 的那一帧
      ctx.globalAlpha = 0.14;
      var f = Math.floor(p * 24) % 24;
      var rng = mkRng(1000 + f);
      for (var i = 0; i < 700; i++) {
        var v = rng();
        ctx.fillStyle = v > 0.5 ? '#fff' : '#000';
        ctx.fillRect(rng() * w, rng() * h, 1, 1);
      }
      // 划痕
      ctx.globalAlpha = 0.22; ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.7;
      for (var k = 0; k < 3; k++) {
        var x = hash(k, Math.floor(p * 2) % 2, 5) * w;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (hash(k, 9, 1) - 0.5) * 8, h); ctx.stroke();
      }
      ctx.restore();
    }
  };

  /* --- 12. 宇宙星云：加色粒子 + 紫青星云 + 星光 --- */
  MAT.cosmic = {
    pal: [[258, 88, 62], [190, 90, 60], [228, 60, 22], [45, 90, 88], [0, 0, 100]],
    backing: function (ctx, w, h) { halo(ctx, w, h, '6,6,30', 0.42, 0); },
    decor: function (ctx, w, h, t) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < 3; i++) {
        var cx = w * (0.3 + 0.2 * i) + Math.sin(p * TAU() + i) * 8;
        var cy = h * (0.4 + 0.15 * i);
        var r = 70 + i * 26;
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, hslA(this.pal[i % 3], 0.14));
        g.addColorStop(1, hslA(this.pal[i % 3], 0));
        ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
      ctx.restore();
    },
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineCap = 'round';
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '700 ' + size + 'px MiSans, "PingFang SC", sans-serif';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c; ctx.fillText(s, x, y);
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.6;
      ctx.shadowColor = c; ctx.shadowBlur = 12; ctx.fillText(s, x, y);
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.shadowColor = c; ctx.shadowBlur = 8; ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU()); ctx.fill();
      ctx.restore();
    },
    post: function (ctx, w, h) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < 60; i++) {
        var x = hash(i, 101, 1) * w, y = hash(i, 103, 2) * h;
        var r = 0.5 + hash(i, 107, 3) * 1.3;
        ctx.globalAlpha = 0.25 + hash(i, 109, 4) * 0.6;
        ctx.fillStyle = hsl(this.pal[3]);
        ctx.beginPath(); ctx.arc(x, y, r, 0, TAU()); ctx.fill();
      }
      ctx.restore();
    }
  };

  /* --- 13. 街头涂鸦：喷漆散点 + 粗描边 + 滴落 --- */
  MAT.graffiti = {
    pal: [[54, 100, 52], [172, 92, 48], [330, 100, 58], [0, 0, 100], [0, 0, 12]],
    backing: function (ctx, w, h) { halo(ctx, w, h, '250,248,244', 0.26, 0); },
    decor: function (ctx, w, h) {
      ctx.save();
      ctx.globalAlpha = 0.10; ctx.fillStyle = hsl(this.pal[1]);
      for (var i = 0; i < 30; i++) {
        var x = hash(i, 111, 1) * w, y = hash(i, 113, 2) * h;
        ctx.beginPath(); ctx.arc(x, y, hash(i, 117, 3) * 2.2, 0, TAU()); ctx.fill();
      }
      ctx.restore();
    },
    fill: function (ctx, pathFn, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c; ctx.beginPath(); pathFn(ctx); ctx.fill();
      ctx.restore();
    },
    stroke: function (ctx, pathFn, c, lw, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.strokeStyle = hsl(this.pal[4]); ctx.lineWidth = lw * 2.1;
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = lw;
      ctx.beginPath(); pathFn(ctx); ctx.stroke();
      ctx.restore();
    },
    text: function (ctx, s, x, y, size, c, o) {
      o = o || {};
      ctx.save();
      ctx.font = '800 ' + size + 'px MiSans, "PingFang SC", sans-serif';
      size = fitFont(ctx, s, size, CURW * 0.94);
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = hsl(this.pal[4]); ctx.lineWidth = size * 0.30;
      ctx.strokeText(s, x, y);
      ctx.strokeStyle = hsl(this.pal[3]); ctx.lineWidth = size * 0.15;
      ctx.strokeText(s, x, y);
      ctx.fillStyle = c; ctx.fillText(s, x, y);
      ctx.restore();
    },
    particle: function (ctx, x, y, r, c, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU()); ctx.fill();
      ctx.restore();
    },
    post: function () {}
  };

  /* ================================================================ 形态层
     30 个通用形态。形态决定「这是个什么东西」，材质决定「什么手感」。
     每个形态签名：(ctx, B, p, P, M)
       B = {x,y,w,h} 元素盒（局部坐标，引擎已经平移好）
       p = 相位 0..1（循环相位）
       P = 参数（ family's params + 变量）
       M = 材质
  ======================================================================== */
  var FORM = {};

  FORM.ring = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var r = Math.min(B.w, B.h) * 0.42 * (P.scale || 1);
    var a = TAU() * p;
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); }, M.pal[0], P.lw || 5, {});
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r * 0.72, a, a + 1.5); }, M.pal[1], (P.lw || 5) * 0.6, {});
    if (P.label) M.text(ctx, P.label, cx, cy, P.size || 20, M.pal[3], {});
  };

  FORM.gauge = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var r = Math.min(B.w, B.h) * 0.40 * (P.scale || 1);
    var a0 = Math.PI * 0.75, a1 = Math.PI * 2.25;
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, a0, a1); }, M.pal[4], 6, { alpha: 0.35 });
    var tip = a0 + (a1 - a0) * (0.3 + 0.7 * tri(p * 1.0 + 0.25));
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, a0, tip); }, M.pal[0], 7, {});
    M.stroke(ctx, function (c) { c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(tip) * r * 0.82, cy + Math.sin(tip) * r * 0.82); }, M.pal[1], 3, {});
    M.particle(ctx, cx, cy, 5, M.pal[1], {});
    if (P.label) M.text(ctx, P.label, cx, cy - r * 0.42, P.size || 16, M.pal[3], {});
  };

  FORM.dial = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var r = Math.min(B.w, B.h) * 0.42 * (P.scale || 1);
    for (var i = 0; i < 24; i++) {
      var a = (i / 24) * TAU();
      var big = i % 6 === 0;
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(cx + Math.cos(a) * r * (big ? 0.72 : 0.82), cy + Math.sin(a) * r * (big ? 0.72 : 0.82));
        c.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }, big ? M.pal[0] : M.pal[4], big ? 3 : 1.6, { alpha: big ? 1 : 0.5 });
    }
    var sweep = p * TAU();
    M.fill(ctx, function (c) {
      c.beginPath(); c.moveTo(cx, cy);
      c.arc(cx, cy, r * 0.9, sweep - 0.5, sweep);
      c.closePath();
    }, M.pal[1], { alpha: 0.28 });
    M.stroke(ctx, function (c) { c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(sweep) * r * 0.8, cy + Math.sin(sweep) * r * 0.8); }, M.pal[0], 2.5, {});
  };

  FORM.bar = function (ctx, B, p, P, M) {
    var h = P.h || 12;
    var y = B.y + B.h / 2 - h / 2;
    /* 动法（原来填充宽度用 `tri(p)`，三角波**两端速度为 0**，
       p=0 / 0.5 正好卡在端点上 → 画面定格）：
       1) 填充宽度用**正弦**（连续、无端点停顿），振幅从 0.45 提到 0.58；
       2) 填充头部加一个**跟着走的亮点**（高亮端点，位置一直在变）；
       3) 填充区内**两道反向流动的高光带**（1 圈 + 2 圈，整数圈 → 循环无缝）；
       4) 条子整体**上下微浮**：改用整数圈正弦（原来 `tri(p)` 两端速度为 0，
          p=0.5 会卡住），幅度 0~3px；
       5) 三颗**糖粒**沿条滑过（各自异相位，整数圈 → 循环无缝）。
       注：min 变动像素占比原来只有 0.81%，只比死区线 0.8% 高 1%，
       属于「擦边过关」，参数一动就掉下去 → 上面 5 条动法一起上。 */
    var w = B.w * (P.fill == null ? 0.7 : P.fill) * (0.42 + 0.58 * (0.5 + 0.5 * Math.sin(p * TAU())));
    var bob = Math.round(Math.sin(p * TAU() * 2) * 3);
    y += bob;
    M.fill(ctx, function (c) { roundRect(c, B.x, y, B.w, h, h / 2); }, M.pal[4], { alpha: 0.3 });
    M.fill(ctx, function (c) { roundRect(c, B.x, y, Math.max(h, w), h, h / 2); }, M.pal[0], {});
    /* 填充头部的亮点（跟着填充末端走） */
    var hx = B.x + Math.max(h, w) - h * 0.5;
    M.fill(ctx, function (c) { c.beginPath(); c.arc(hx, y + h / 2, h * 0.30, 0, TAU()); }, M.pal[1], { alpha: 0.9 });
    /* 动法 3：填充区里两道**反向流动的高光带**（匀速扫过 → 每帧都在变） */
    var sw = Math.max(h, w);
    var bandX = B.x + ((p * 1.0) % 1) * (sw + 60) - 30;
    var band2X = B.x + sw - (((p * 2.0) % 1) * (sw + 60) - 30) - 10;
    ctx.save();
    ctx.beginPath(); roundRect(ctx, B.x, y, sw, h, h / 2); ctx.clip();
    M.fill(ctx, function (c) { c.rect(bandX, y, 18, h); }, M.pal[3], { alpha: 0.5 });
    M.fill(ctx, function (c) { c.rect(band2X, y, 10, h); }, M.pal[1], { alpha: 0.4 });
    ctx.restore();
    /* 动法 5：三颗糖粒沿条滑过（各自异相位） */
    for (var gi = 0; gi < 3; gi++) {
      var gp = (p * (1 + gi * 0.5) + hash(P.seed + gi * 13, 3, 7)) % 1;
      var gx = B.x + 6 + gp * (B.w - 12);
      M.fill(ctx, function (c) { c.beginPath(); c.arc(gx, y + h / 2, h * 0.18, 0, TAU()); },
        gi % 2 ? M.pal[1] : M.pal[3], { alpha: 0.8 });
    }
    for (var i = 0; i < 8; i++) {
      var x = B.x + (B.w - 12) * (i / 8);
      M.stroke(ctx, function (c) { c.beginPath(); c.moveTo(x, y - 4); c.lineTo(x, y + h + 4); }, M.pal[3], 1, { alpha: 0.35 });
    }
    if (P.label) M.text(ctx, P.label, B.x + B.w / 2, y - h, P.size || 13, M.pal[3], {});
  };

  FORM.bars = function (ctx, B, p, P, M) {
    var n = P.n || 7, gap = 5;
    var bw = (B.w - gap * (n - 1)) / n;
    for (var i = 0; i < n; i++) {
      var seed = P.seed + i * 7;
      var k = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(p * TAU() * (1 + (i % 3)) + hash(seed, 1, 1) * TAU()));
      var h = B.h * 0.92 * k;
      var x = B.x + i * (bw + gap);
      M.fill(ctx, function (c) { roundRect(c, x, B.y + B.h - h, bw, h, 3); },
        i % 2 ? M.pal[1] : M.pal[0], {});
    }
  };

  FORM.wave = function (ctx, B, p, P, M) {
    var cy = B.y + B.h / 2, amp = B.h * 0.30;
    M.stroke(ctx, function (c) { wavePath(c, B.x, cy, B.w, amp, 2.5, p * TAU()); }, M.pal[0], P.lw || 4, {});
    M.stroke(ctx, function (c) { wavePath(c, B.x, cy, B.w, amp * 0.5, 4, p * TAU() * 1.6 + 1.2); }, M.pal[1], (P.lw || 4) * 0.6, { alpha: 0.8 });
    if (P.label) M.text(ctx, P.label, B.x + B.w / 2, B.y + 6, P.size || 14, M.pal[3], {});
  };

  FORM.panel = function (ctx, B, p, P, M) {
    var sh = 1 + 0.02 * Math.sin(p * TAU());
    ctx.save();
    ctx.translate(B.x + B.w / 2, B.y + B.h / 2); ctx.scale(sh, sh); ctx.translate(-(B.x + B.w / 2), -(B.y + B.h / 2));
    M.fill(ctx, function (c) { roundRect(c, B.x, B.y, B.w, B.h, 6); }, M.pal[4], { alpha: P.bgAlpha == null ? 0.55 : P.bgAlpha, box: B });
    // 四角括号
    var L = 16, o = 3;
    [[B.x + o, B.y + o, 1, 1], [B.x + B.w - o, B.y + o, -1, 1],
     [B.x + o, B.y + B.h - o, 1, -1], [B.x + B.w - o, B.y + B.h - o, -1, -1]].forEach(function (q) {
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(q[0] + q[2] * L, q[1]); c.lineTo(q[0], q[1]); c.lineTo(q[0], q[1] + q[3] * L);
      }, M.pal[0], 2.5, {});
    });
    if (P.label) M.text(ctx, P.label, B.x + B.w / 2, B.y + B.h / 2, P.size || 20, M.pal[3], {});
    ctx.restore();
  };

  FORM.badge = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var w = B.w * 0.86, h = B.h * 0.42;
    var tilt = Math.sin(p * TAU()) * 0.05;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(tilt); ctx.translate(-cx, -cy);
    M.fill(ctx, function (c) { roundRect(c, cx - w / 2, cy - h / 2, w, h, h * 0.22); }, M.pal[0], { box: { x: cx - w / 2, y: cy - h / 2, w: w, h: h } });
    M.stroke(ctx, function (c) { roundRect(c, cx - w / 2 + 4, cy - h / 2 + 4, w - 8, h - 8, h * 0.16); }, M.pal[3], 1.4, { alpha: 0.8 });
    M.text(ctx, P.label || 'TAG', cx, cy, P.size || 15, M.pal[3], {});
    ctx.restore();
  };

  FORM.text = function (ctx, B, p, P, M) {
    var cy = B.y + B.h / 2;
    var sc = 0.94 + 0.06 * Math.sin(p * TAU());
    ctx.save();
    ctx.translate(B.x + B.w / 2, cy); ctx.scale(sc, sc); ctx.translate(-(B.x + B.w / 2), -cy);
    M.text(ctx, P.label || 'STICKER', B.x + B.w / 2, cy, P.size || 26, M.pal[0], {});
    ctx.restore();
  };

  FORM.outlineText = function (ctx, B, p, P, M) {
    var cy = B.y + B.h / 2;
    var s = P.label || 'OUTLINE';
    /* 动法（原来只有 ±5% 的整体缩放，纯缩放无位移 ——
       p=0.48 时只差 0.6%，几乎无变化）：
       1) 文字**左右滑** 0~12px（与缩放叠加，位移的变动像素比缩放大得多）；
       2) 缩放幅度加大到 ±8%，周期改成 2 圈（避开引擎的 3 圈相位）。 */
    var slide = Math.round(tri(p) * 12) - 6;      // -6 ~ +6 px
    var sc = 1 + 0.08 * Math.sin(p * TAU() * 2);
    var tx = B.x + B.w / 2 + slide;
    ctx.save();
    ctx.translate(tx, cy); ctx.scale(sc, sc); ctx.translate(-tx, -cy);
    ctx.save();
    ctx.font = '800 ' + (P.size || 26) + 'px MiSans, "PingFang SC", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round'; ctx.lineWidth = (P.size || 26) * 0.16;
    ctx.strokeStyle = M.pal[3]; ctx.strokeText(s, tx, cy);
    ctx.restore();
    M.text(ctx, s, tx, cy, P.size || 26, M.pal[0], {});
    ctx.restore();
  };

  FORM.burst = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var r = Math.min(B.w, B.h) * 0.40 * (P.scale || 1) * (0.9 + 0.1 * tri(p * 2));
    M.fill(ctx, function (c) { starPath(c, cx, cy, r, r * 0.42, P.spikes || 9, p * 0.6); }, M.pal[0], { box: { x: cx - r, y: cy - r, w: r * 2, h: r * 2 } });
    M.stroke(ctx, function (c) { starPath(c, cx, cy, r, r * 0.42, P.spikes || 9, p * 0.6); }, M.pal[3], 1.6, { alpha: 0.7 });
    M.text(ctx, P.label || 'POP', cx, cy, P.size || 18, M.pal[3], {});
  };

  FORM.blob = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var r = Math.min(B.w, B.h) * 0.40 * (P.scale || 1);
    M.fill(ctx, function (c) { blobPath(c, cx, cy, r, 7, P.seed || 3, 0.22, 0.92); }, M.pal[0], { box: B });
    M.stroke(ctx, function (c) { blobPath(c, cx, cy, r, 7, P.seed || 3, 0.22, 0.92); }, M.pal[1], 2, { alpha: 0.8 });
  };

  FORM.drop = function (ctx, B, p, P, M) { return FORM.blob(ctx, B, p, P, M); };

  FORM.drip = function (ctx, B, p, P, M) {
    var n = P.n || 5, cx = B.x + B.w / 2;
    var top = B.y + B.h * 0.18;
    for (var i = 0; i < n; i++) {
      var x = cx + (i - (n - 1) / 2) * (B.w * 0.16);
      var len = B.h * (0.25 + 0.45 * (0.5 + 0.5 * Math.sin(p * TAU() + i)));
      M.fill(ctx, function (c) { roundRect(c, x - 3, top, 6, len, 3); }, M.pal[0], {});
      M.fill(ctx, function (c) { c.beginPath(); c.arc(x, top + len, 5, 0, TAU()); }, M.pal[0], {});
    }
  };

  FORM.chip = function (ctx, B, p, P, M) {
    var n = P.n || 12;
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    /* 动法（原来只有 12 个 3~9px 的小方块绕圆心公转 ——
       每个方块只有几十像素，全片变动像素从 t=1.2 到 t=4.8
       一直是 0.0094~0.0098，峰谷只差 0.001，等于一条平线）：
       1) **中心一块主芯片**（占画面主体，随周期缩放 + 亮暗）；
       2) 外围**引脚**跟着一起转（方块 + 引脚的组合是「芯片」而不是「碎屑」）；
       3) 原来的小方块继续公转。 */
    var t2 = p * TAU();
    /* 主芯片：缩放 0.94~1.06（2 圈周期，与引擎的 3 圈错开） */
    var sc = 1 + 0.06 * Math.sin(t2 * 2);
    var cs = Math.min(B.w, B.h) * 0.26 * sc;
    /* 引脚：上下左右各两排 */
    for (var g = 0; g < 8; g++) {
      var side = g % 2, k2 = Math.floor(g / 2);
      var off = (k2 - 1.5) * cs * 0.42;
      var px3, py3, pw3, ph3;
      if (side === 0) { px3 = cx + off; py3 = cy - cs * 0.62; pw3 = cs * 0.16; ph3 = cs * 0.26; }
      else { px3 = cx - cs * 0.62; py3 = cy + off; pw3 = cs * 0.26; ph3 = cs * 0.16; }
      M.fill(ctx, function (c) { c.rect(px3, py3, pw3, ph3); }, M.pal[1], {});
    }
    /* 芯片本体 */
    M.fill(ctx, function (c) { roundRect(c, cx - cs / 2, cy - cs / 2, cs, cs, cs * 0.12); },
      M.pal[0], { box: { x: cx - cs / 2, y: cy - cs / 2, w: cs, h: cs } });
    /* 芯片上的指示灯：轮流亮 */
    for (var d = 0; d < 3; d++) {
      var lit = (Math.floor(p * 6) % 3 === d) ? 1 : 0.25;
      M.fill(ctx, function (c) { c.beginPath(); c.arc(cx - cs * 0.22 + d * cs * 0.22, cy, cs * 0.055, 0, TAU()); },
        M.pal[2], { alpha: lit });
    }
    /* 原来的小方块群 */
    for (var i = 0; i < n; i++) {
      var a = hash(P.seed || 5, i, 1) * TAU();
      var rr = (0.25 + 0.75 * hash(P.seed || 5, i, 2)) * Math.min(B.w, B.h) * 0.45;
      var x = cx + Math.cos(a + p * TAU()) * rr;
      var y = cy + Math.sin(a + p * TAU()) * rr * 0.8;
      var s = 3 + hash(P.seed || 5, i, 3) * 6;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a * 2 + p * TAU());
      M.fill(ctx, function (c) { c.rect(-s / 2, -s / 2, s, s); }, M.pal[i % 3], {});
      ctx.restore();
    }
  };

  FORM.poly = function (ctx, B, p, P, M) {
    var pts = [], n = 6, seed = P.seed || 11;
    for (var i = 0; i < n; i++) {
      pts.push([
        B.x + B.w * (i / (n - 1)),
        B.y + B.h * (0.5 + 0.38 * Math.sin(i * 1.7 + p * TAU() + hash(seed, i, 1) * 6))
      ]);
    }
    M.stroke(ctx, function (c) { polyPath(c, pts); }, M.pal[0], P.lw || 3, {});
    for (var k = 0; k < n; k++) {
      if (k % 2) continue;
      M.particle(ctx, pts[k][0], pts[k][1], 4, M.pal[1], {});
    }
  };

  FORM.stack = function (ctx, B, p, P, M) {
    var n = P.n || 4;
    for (var i = 0; i < n; i++) {
      var k = i / n;
      var off = Math.sin(p * TAU() + i * 0.7) * 3;
      var w = B.w * (0.7 - k * 0.12), h = B.h * (0.34 - k * 0.05);
      var x = B.x + (B.w - w) / 2 + off, y = B.y + B.h * 0.58 - i * (h * 0.55);
      M.fill(ctx, function (c) { roundRect(c, x, y, w, h, 4); }, M.pal[i % 3], { box: { x: x, y: y, w: w, h: h } });
    }
  };

  FORM.ribbon = function (ctx, B, p, P, M) {
    M.fill(ctx, function (c) { ribbonPath(c, B.x, B.y + B.h * 0.3, B.w, B.h * 0.5, p * TAU()); }, M.pal[0], { box: B });
    M.stroke(ctx, function (c) { ribbonPath(c, B.x, B.y + B.h * 0.3, B.w, B.h * 0.5, p * TAU()); }, M.pal[1], 1.6, { alpha: 0.7 });
  };

  FORM.leaf = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var len = Math.min(B.w, B.h) * 0.44 * (P.scale || 1);
    var sway = Math.sin(p * TAU()) * 0.22;
    M.fill(ctx, function (c) { leafPath(c, cx, cy, len, len * 0.44, -Math.PI / 2 + sway); }, M.pal[0], { box: B });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(cx + Math.sin(sway) * len, cy - len);
    }, M.pal[1], 1.4, { alpha: 0.8 });
  };

  FORM.flower = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var r = Math.min(B.w, B.h) * 0.22 * (P.scale || 1);
    var n = P.petals || 8, rot = p * TAU() * 0.5;
    for (var i = 0; i < n; i++) {
      var a = rot + (i / n) * TAU();
      M.fill(ctx, function (c) { petalPath(c, cx, cy, r * 1.5, r * 0.55, a); }, M.pal[i % 3], { box: B });
    }
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r * 0.5, 0, TAU()); }, M.pal[1], {});
  };

  FORM.grid = function (ctx, B, p, P, M) {
    var cols = P.cols || 8, rows = P.rows || 4;
    var cw = B.w / cols, ch = B.h / rows;
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        var v = hash(P.seed || 17, i, j);
        var k = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(p * TAU() + v * 6.2));
        var s = Math.min(cw, ch) * 0.30 * k;
        M.fill(ctx, function (c) {
          c.beginPath();
          c.arc(B.x + cw * (i + 0.5), B.y + ch * (j + 0.5), s, 0, TAU());
        }, j % 2 ? M.pal[1] : M.pal[0], { alpha: 0.35 + 0.65 * k });
      }
    }
  };

  FORM.orbit = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var rx = B.w * 0.42, ry = B.h * 0.26, rot = p * TAU();
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(-0.35); ctx.translate(-cx, -cy);
    M.stroke(ctx, function (c) { c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, TAU()); }, M.pal[0], 2, { alpha: 0.8 });
    var a = rot;
    M.particle(ctx, cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 6, M.pal[1], {});
    M.particle(ctx, cx - Math.cos(a) * rx, cy - Math.sin(a) * ry, 3.5, M.pal[3], {});
    ctx.restore();
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, 10, 0, TAU()); }, M.pal[2], { box: B });
  };

  FORM.spark = function (ctx, B, p, P, M) {
    var n = P.n || 16;
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    /* 动法（原来只有 16 颗 1.5~5px 的小星在晃 ——
       粒子本身太小，晃的是「空隙」，主体轮廓不变，
       变动像素恒在 0.8% 上下，八个时刻几乎一条平线）：
       1) **中心一颗大星**（占画面主体，随周期缩放 + 转）；
       2) 大星外扩的**放射光芒**（长度随周期变）；
       3) 原来的小星群继续闪。 */
    var t2 = p * TAU();
    /* 中心大星：缩放 0.85~1.15（转 2 圈 → 与引擎的 3 圈不同相位） */
    var sc = 1 + 0.15 * Math.sin(t2 * 2);
    var R = Math.min(B.w, B.h) * 0.17 * sc;
    /* 放射光芒：8 根，长度随周期伸缩 */
    for (var q = 0; q < 8; q++) {
      var qa = q / 8 * TAU() + t2 * 0.5;
      var ql = R * (1.5 + 0.5 * Math.sin(t2 * 2 + q * 0.8));
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(cx + Math.cos(qa) * R * 0.7, cy + Math.sin(qa) * R * 0.7);
        c.lineTo(cx + Math.cos(qa) * ql, cy + Math.sin(qa) * ql);
      }, q % 2 ? M.pal[1] : M.pal[0], 2.6, { alpha: 0.85 });
    }
    /* 中心大星本体 */
    M.fill(ctx, function (c) {
      c.beginPath();
      for (var k = 0; k < 10; k++) {
        var aa = t2 * 0.5 + k / 10 * TAU();
        var rad = (k % 2 ? R * 0.42 : R);
        var px2 = cx + Math.cos(aa) * rad, py2 = cy + Math.sin(aa) * rad;
        if (k === 0) c.moveTo(px2, py2); else c.lineTo(px2, py2);
      }
      c.closePath();
    }, M.pal[0], { box: B });
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, R * 0.26, 0, TAU()); }, M.pal[1], {});
    /* 原来的小星群 */
    for (var i = 0; i < n; i++) {
      var a = hash(P.seed || 23, i, 1) * TAU();
      var rr = (0.2 + 0.8 * hash(P.seed || 23, i, 2)) * Math.min(B.w, B.h) * 0.44;
      var wob = Math.sin(p * TAU() + i) * 5;
      var x = cx + Math.cos(a) * rr + wob;
      var y = cy + Math.sin(a) * rr * 0.8 - wob * 0.5;
      var s = 1.5 + hash(P.seed || 23, i, 3) * 3.5;
      M.particle(ctx, x, y, s, i % 3 ? M.pal[0] : M.pal[1], { alpha: 0.5 + 0.5 * tri(p * 2 + i * 0.3) });
    }
  };

  FORM.crosshair = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var r = Math.min(B.w, B.h) * 0.34 * (P.scale || 1);
    var gap = r * (0.22 + 0.08 * Math.sin(p * TAU()));
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - r, cy); c.lineTo(cx - gap, cy);
      c.moveTo(cx + gap, cy); c.lineTo(cx + r, cy);
      c.moveTo(cx, cy - r); c.lineTo(cx, cy - gap);
      c.moveTo(cx, cy + gap); c.lineTo(cx, cy + r);
    }, M.pal[0], 2.5, {});
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r * 0.34, 0, TAU()); }, M.pal[1], 2, {});
    M.particle(ctx, cx, cy, 3, M.pal[3], {});
  };

  FORM.tick = function (ctx, B, p, P, M) {
    var n = P.n || 10;
    for (var i = 0; i < n; i++) {
      var k = 0.5 + 0.5 * Math.sin(p * TAU() - i * 0.55);
      var h = B.h * 0.5 * (0.25 + 0.75 * k);
      var x = B.x + B.w * (i / (n - 1));
      M.stroke(ctx, function (c) { c.beginPath(); c.moveTo(x, B.y + B.h / 2 - h / 2); c.lineTo(x, B.y + B.h / 2 + h / 2); }, i % 3 ? M.pal[0] : M.pal[1], 3, {});
    }
  };

  FORM.corner = function (ctx, B, p, P, M) {
    var L = Math.min(B.w, B.h) * 0.34;
    var o = 2 + 1.5 * Math.sin(p * TAU());
    [[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]].forEach(function (q, i) {
      var x = B.x + q[0] * B.w, y = B.y + q[1] * B.h;
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(x + q[2] * L, y); c.lineTo(x, y); c.lineTo(x, y + q[3] * L);
      }, i % 2 ? M.pal[0] : M.pal[1], 3, {});
    });
    if (P.label) M.text(ctx, P.label, B.x + B.w / 2, B.y + B.h / 2, P.size || 15, M.pal[3], {});
  };

  FORM.pill = function (ctx, B, p, P, M) {
    var h = B.h * 0.38, w = B.w * 0.9;
    var x = B.x + (B.w - w) / 2, y = B.y + (B.h - h) / 2;
    /* 动法（原来只有 ±4% 的整体缩放，无位移无形变 ——
       p=0.48 时只差 0.6%，画面几乎不变）：
       1) 药丸**左右滑**（像被推着走），位移 0~10px；
       2) 缩放保留但幅度加大；
       3) 底下一道**投影跟着滑**（加强「有实体」的观感）。 */
    var slide = Math.round(tri(p) * 10) - 5;      // -5 ~ +5 px
    var k = 0.92 + 0.08 * Math.sin(p * TAU() * 2);
    ctx.save();
    ctx.translate(x + w / 2 + slide, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
    /* 投影（先画，在药丸下面） */
    M.fill(ctx, function (c) { roundRect(c, x + 5, y + h * 0.72, w * 0.92, h * 0.34, h * 0.17); },
      M.pal[2], { alpha: 0.28, box: { x: x, y: y, w: w, h: h } });
    M.fill(ctx, function (c) { roundRect(c, x, y, w, h, h / 2); }, M.pal[0], { box: { x: x, y: y, w: w, h: h } });
    M.text(ctx, P.label || 'PILL', x + w / 2, y + h / 2, P.size || 15, M.pal[3], {});
    ctx.restore();
  };

  FORM.frame = function (ctx, B, p, P, M) {
    M.stroke(ctx, function (c) { roundRect(c, B.x, B.y, B.w, B.h, 4); }, M.pal[0], 3.5, {});
    M.stroke(ctx, function (c) { roundRect(c, B.x + 6, B.y + 6, B.w - 12, B.h - 12, 2); }, M.pal[1], 1.2, { alpha: 0.7 });
    /* 上下两排片孔：让「框」在胶片族里真的像胶片，其他族里也像个画框 */
    var n = 7, i;
    for (i = 0; i < n; i++) {
      var x = B.x + 12 + (B.w - 24) * (i / (n - 1));
      M.fill(ctx, function (c) { roundRect(c, x - 4, B.y + 1, 8, 5, 1.5); }, M.pal[1], { alpha: 0.75 });
      M.fill(ctx, function (c) { roundRect(c, x - 4, B.y + B.h - 6, 8, 5, 1.5); }, M.pal[1], { alpha: 0.75 });
    }
    if (P.label) M.text(ctx, P.label, B.x + B.w / 2, B.y + B.h / 2, P.size || 18, M.pal[3], {});
  };

  FORM.arcseg = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var r = Math.min(B.w, B.h) * 0.40 * (P.scale || 1);
    var a0 = -Math.PI * 0.5, sweep = Math.PI * 2 * tri(p);
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, a0, a0 + sweep); }, M.pal[0], 8, {});
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r * 0.72, a0, a0 + sweep * 0.6); }, M.pal[1], 3, { alpha: 0.7 });
  };

  FORM.mask = function (ctx, B, p, P, M) {
    var r = Math.min(B.w, B.h) * 0.42 * (P.scale || 1);
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    ctx.save();
    ctx.beginPath(); ctx.rect(B.x, B.y, B.w, B.h); ctx.clip();
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); }, M.pal[0], { box: B });
    ctx.restore();
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); }, M.pal[3], 2, {});
    if (P.label) M.text(ctx, P.label, cx, cy, P.size || 16, M.pal[3], {});
  };

  FORM.envelope = function (ctx, B, p, P, M) {
    var w = B.w * 0.72, h = B.h * 0.5;
    var x = B.x + (B.w - w) / 2, y = B.y + (B.h - h) / 2;
    var k = 1 + 0.03 * Math.sin(p * TAU());
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
    M.fill(ctx, function (c) { roundRect(c, x, y, w, h, 4); }, M.pal[0], { box: { x: x, y: y, w: w, h: h } });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(x, y); c.lineTo(x + w / 2, y + h * 0.55); c.lineTo(x + w, y);
    }, M.pal[1], 2, {});
    M.particle(ctx, x + w / 2, y + h * 0.55, 6, M.pal[1], {});
    ctx.restore();
  };

  FORM.sun = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h * 0.62;
    var r = Math.min(B.w, B.h) * 0.34 * (P.scale || 1);
    for (var i = 0; i < 7; i++) {
      var yy = cy - r + (i / 7) * r * 1.4;
      var half = Math.sqrt(Math.max(0, r * r - (yy - cy) * (yy - cy)));
      M.fill(ctx, function (c) { c.rect(cx - half, yy, half * 2, r * 0.10); }, M.pal[0], { alpha: i % 2 ? 0 : 0.9, box: B });
    }
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, Math.PI, TAU()); }, M.pal[1], 2, { alpha: 0.6 });
  };

  FORM.gear = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var r = Math.min(B.w, B.h) * 0.34 * (P.scale || 1);
    var teeth = P.teeth || 12, rot = p * TAU() * 0.5;
    M.fill(ctx, function (c) {
      c.beginPath();
      for (var i = 0; i < teeth * 2; i++) {
        var a = rot + (i / (teeth * 2)) * TAU();
        var rr = (i % 2 === 0) ? r : r * 0.78;
        var x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.closePath();
    }, M.pal[0], { box: B });
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r * 0.30, 0, TAU()); }, M.pal[4], { alpha: 0.6 });
  };

  FORM.ticker = function (ctx, B, p, P, M) {
    var h = B.h * 0.34, y = B.y + (B.h - h) / 2;
    M.fill(ctx, function (c) { roundRect(c, B.x, y, B.w, h, 4); }, M.pal[4], { alpha: 0.5 });
    var s = P.label || 'TICKER';
    var tw = B.w * 0.8;
    var off = ((p * 1) % 1) * (tw + s.length * 7);
    ctx.save();
    ctx.beginPath(); ctx.rect(B.x, y, B.w, h); ctx.clip();
    M.text(ctx, s, B.x + B.w / 2 - tw / 2 + off, y + h / 2, P.size || 13, M.pal[0], { align: 'left' });
    M.text(ctx, s, B.x + B.w / 2 - tw / 2 + off + tw, y + h / 2, P.size || 13, M.pal[0], { align: 'left' });
    ctx.restore();
  };

  FORM.pixelIcon = function (ctx, B, p, P, M) {
    // 用 8×8 的字符画当像素图，nearest 放大成像素图标
    var g = P.glyph || ['11111111', '10000001', '10110101', '10100101', '10111101', '10100001', '10011001', '11111111'];
    var rows = g.length, cols = g[0].length;
    var cell = Math.min(B.w / cols, B.h / rows) * (P.scale || 1);
    var ox = B.x + (B.w - cell * cols) / 2, oy = B.y + (B.h - cell * rows) / 2;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        if (g[i][j] !== '1') continue;
        var on = (hash(i, j, 3) + p * 2) % 1;
        M.fill(ctx, function (c) { c.rect(ox + j * cell, oy + i * cell, cell, cell); },
          (i + j) % 3 === 0 ? M.pal[1] : M.pal[0], { alpha: 0.72 + 0.28 * Math.sin(on * 6.28) });
      }
    }
  };

  FORM.face = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var r = Math.min(B.w, B.h) * 0.36 * (P.scale || 1);
    /* 动法（原来只有 3px 的上下浮 —— p=0.5 时归零，与首帧逐像素相同）：
       1) **眨眼**：眼睛每隔 0.4 圈闭一次（闭眼时画一条横线）；
       2) **嘴型变化**：微笑 ↔ 张嘴（口型随周期变）；
       3) 腮红一明一暗。
       眼睛/嘴/腮红是「表情级」变化，比整脸平移的变动像素大得多。 */
    var bob = Math.sin(p * TAU()) * 3;
    var blink = (p * 2.5) % 1 < 0.12;          // 每 0.4 圈眨一次
    var talk = Math.sin(p * TAU() * 2) > 0.3;  // 张嘴
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy + bob, r, 0, TAU()); }, M.pal[0], { box: B });
    var ex = r * 0.38, ey = cy + bob - r * 0.14, er = r * 0.15;
    if (blink) {
      /* 闭眼：一条短横线 */
      M.fill(ctx, function (c) { roundRect(c, cx - ex - er, ey - er * 0.35, er * 2, er * 0.7, er * 0.35); },
        M.pal[4], {});
      M.fill(ctx, function (c) { roundRect(c, cx + ex - er, ey - er * 0.35, er * 2, er * 0.7, er * 0.35); },
        M.pal[4], {});
    } else {
      M.particle(ctx, cx - ex, ey, er, M.pal[4], {});
      M.particle(ctx, cx + ex, ey, er, M.pal[4], {});
    }
    /* 嘴：微笑（弧）/ 张嘴（椭圆） */
    if (talk) {
      M.fill(ctx, function (c) {
        c.beginPath();
        c.ellipse(cx, cy + bob + r * 0.34, r * 0.20, r * 0.16, 0, 0, TAU());
      }, M.pal[1], {});
    } else {
      M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy + bob + r * 0.34, r * 0.26, 0.15, Math.PI - 0.15); }, M.pal[1], {});
    }
    /* 腮红：左右两团淡粉，一明一暗 */
    var blush = 0.20 + 0.18 * (0.5 + 0.5 * Math.sin(p * TAU() * 2 + 1.1));
    M.fill(ctx, function (c) { c.beginPath(); c.ellipse(cx - r * 0.62, cy + bob + r * 0.16, r * 0.18, r * 0.11, 0, 0, TAU()); },
      M.pal[1], { alpha: blush });
    M.fill(ctx, function (c) { c.beginPath(); c.ellipse(cx + r * 0.62, cy + bob + r * 0.16, r * 0.18, r * 0.11, 0, 0, TAU()); },
      M.pal[1], { alpha: blush });
  };

  FORM.window = function (ctx, B, p, P, M) {
    var r = Math.min(B.w, B.h) * 0.40 * (P.scale || 1);
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU()); ctx.clip();
    M.fill(ctx, function (c) { c.rect(B.x, B.y, B.w, B.h); }, M.pal[4], { alpha: 0.5, box: B });
    for (var i = 0; i < 4; i++) {
      var y = B.y + (i / 4) * B.h + (p * B.h * 0.25) % (B.h / 4);
      M.fill(ctx, function (c) { c.rect(B.x, y, B.w, 5); }, M.pal[0], { alpha: 0.28 });
    }
    ctx.restore();
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); }, M.pal[0], 3, {});
  };

  FORM.mountain = function (ctx, B, p, P, M) {
    var n = 3;
    for (var i = 0; i < n; i++) {
      var k = i / n;
      var pts = [], cnt = 7;
      for (var j = 0; j < cnt; j++) {
        var u = j / (cnt - 1);
        var y = B.y + B.h * (0.78 - k * 0.28) - Math.abs(Math.sin(u * 3.1 + i)) * B.h * 0.22;
        pts.push([B.x + B.w * u, y]);
      }
      M.fill(ctx, function (c) {
        polyPath(c, pts);
        c.lineTo(B.x + B.w, B.y + B.h); c.lineTo(B.x, B.y + B.h); c.closePath();
      }, i % 2 ? M.pal[1] : M.pal[0], { alpha: 0.20 + 0.14 * i, box: B });
    }
  };

  FORM.tube = function (ctx, B, p, P, M) {
    var w = B.w * 0.22, h = B.h * 0.66;
    var x = B.x + B.w * 0.18, y = B.y + B.h * 0.2;
    /* 动法（原来只有「一滴漆往下淌」—— 罐体本身纹丝不动，
       那一滴只有 4px，120 条里专属动法最弱，min 0.0048）：
       1) 罐身**上下压**（喷漆时手会往下压）0~4px；
       2) 罐身**左右倾** ±3°；
       3) 罐口**喷出**一小团漆雾；
       4) 底下那滴漆继续淌。
       注意：`tri(p)` 是三角波，**两端速度为 0**，p=0 / 0.5 会卡住 →
       整帧几乎不动。压身和滴漆都改成**整数圈正弦 / fract**，
       循环无缝且没有端点停顿；tilt 用 2 圈与 press 的 1 圈错开相位。 */
    var press = Math.round((0.5 + 0.5 * Math.sin(p * TAU())) * 4);
    var tilt = Math.sin(p * TAU() * 2) * 0.052;      // ±3°（2 圈，与 press 错相）
    ctx.save();
    ctx.translate(x + w / 2, y);
    ctx.rotate(tilt);
    ctx.translate(-(x + w / 2), -y);
    var yy = y + press;
    M.fill(ctx, function (c) { roundRect(c, x, yy, w, h, w * 0.3); }, M.pal[0], { box: { x: x, y: yy, w: w, h: h } });
    M.fill(ctx, function (c) { roundRect(c, x + w * 0.32, yy + h * 0.78, w * 0.36, h * 0.26, 2); }, M.pal[4], {});
    M.fill(ctx, function (c) { roundRect(c, x, yy - h * 0.12, w, h * 0.16, 3); }, M.pal[3], {});
    ctx.restore();
    /* 动法 3：罐口喷出的漆雾（5 团**斜向喷出**，按压越深喷得越多。
       原来只有 3 团原地扩散、半径 5~12、alpha 0.30 —— 动态面积太小，
       整条只有 0.81% 的像素在变，是 130 条里最弱的之一。
       改成：5 团 + 沿喷出方向位移 + 半径随喷压放大。 */
    var spray = 0.35 + 0.65 * (press / 4);
    for (var i = 0; i < 5; i++) {
      var u = (p * 3 + i / 5) % 1;
      var fr = (4 + u * 9) * spray;
      var dx = u * 30 * spray, dy = -u * 16 * spray;
      M.fill(ctx, function (c) {
        c.beginPath();
        c.arc(x + w * 0.5 + dx, yy - h * 0.16 + dy, fr, 0, TAU());
      }, M.pal[1], { alpha: 0.34 * (1 - u) * spray });
    }
    /* 动法 4：底下那滴漆 —— 每圈滴一滴，落到最低就消失（2 圈 → 循环无缝） */
    var dp = (p * 2) % 1;
    M.fill(ctx, function (c) {
      c.beginPath();
      c.arc(x + w * 0.5, yy + h * 1.0 + dp * h * 0.45, 4 * (1 - dp * 0.4), 0, TAU());
    }, M.pal[1], { alpha: 0.9 * (1 - dp) });
  };

  FORM.blade = function (ctx, B, p, P, M) {
    var cx = B.x + B.w * 0.3, cy = B.y + B.h * 0.72;
    var L = Math.min(B.w, B.h) * 0.62;
    var ang = -0.9 + Math.sin(p * TAU()) * 0.14;
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(ang);
    M.fill(ctx, function (c) { roundRect(c, 0, -L, 9, L, 4); }, M.pal[3], { box: { x: 0, y: -L, w: 9, h: L } });
    M.fill(ctx, function (c) { roundRect(c, 1, -L, 3, L, 2); }, M.pal[0], { alpha: 0.7 });
    M.fill(ctx, function (c) { roundRect(c, -16, -6, 34, 12, 6); }, M.pal[3], { box: { x: -16, y: -6, w: 34, h: 12 } });
    ctx.restore();
    M.fill(ctx, function (c) { blobPath(c, cx + Math.cos(ang) * L * 0.7, cy + Math.sin(ang) * L * 0.7, 7, 6, 5, 0.3, 1); }, M.pal[0], {});
  };

  FORM.palette = function (ctx, B, p, P, M) {
    var cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    var r = Math.min(B.w, B.h) * 0.38 * (P.scale || 1);
    M.fill(ctx, function (c) { c.beginPath(); c.ellipse(cx, cy, r, r * 0.72, 0, 0, TAU()); }, M.pal[2], { box: B });
    for (var i = 0; i < 5; i++) {
      var a = (i / 5) * TAU() + p * 0.4;
      M.fill(ctx, function (c) { c.beginPath(); c.arc(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.42, r * 0.17, 0, TAU()); }, M.pal[i % 4], {});
    }
  };

  /* ======================================================================
     v2 · 专属画法（每族 10 个不重名的 form）
     ----------------------------------------------------------------------
     v1 的病根：40 个通用形态被 13 个族瓜分，130 条 = 40 种「东西」× 13 种皮。
     马哥的原话：「为什么风格不一样，里面的素材都是一样的呢？
     位置都一样，长得都差不多，只是你把风格改了，这不行啊！
     我要的是 130 个都不能重复，每个跟每个之间都不重复。」

     v2 的规矩：**每条一个专属画法**，画法名全局唯一。
     这一段先落赛博霓虹 10 个（其余 12 族逐族补）。
     ====================================================================== */

  /* 1 锁定角框：四个角括号夹住一个跳动的准星点 */
  FORM.lockOnBrackets = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var pulse = 0.5 + 0.5 * Math.sin(p * TAU());
    var arm = Math.min(w, h) * 0.30;
    var inset = 6 + 8 * (1 - pulse);          // 括号随呼吸收放
    var q = [[inset, inset, 1, 1], [w - inset, inset, -1, 1],
             [inset, h - inset, 1, -1], [w - inset, h - inset, -1, -1]];
    for (var i = 0; i < 4; i++) {
      var k = q[i];
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(k[0] + k[2] * arm, k[1]);
        c.lineTo(k[0], k[1]);
        c.lineTo(k[0], k[1] + k[3] * arm);
      }, M.pal[0], 3, { alpha: 0.45 + 0.55 * pulse });
    }
    // 中心：跳动的准星点 + 十字
    var cx = w / 2, cy = h / 2, r = 2.5 + 3.5 * pulse;
    M.particle(ctx, cx, cy, r, M.pal[1], { alpha: 0.6 + 0.4 * pulse });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - 13, cy); c.lineTo(cx - 5, cy);
      c.moveTo(cx + 5, cy); c.lineTo(cx + 13, cy);
      c.moveTo(cx, cy - 13); c.lineTo(cx, cy - 5);
      c.moveTo(cx, cy + 5); c.lineTo(cx, cy + 13);
    }, M.pal[2], 1.5, { alpha: 0.75 });
  };

  /* 2 频谱柱阵：一排高低乱跳的霓虹柱，底下一条扫描线来回扫 */
  FORM.spectrumColumns = function (ctx, B, p, P, M) {
    var n = P.n || 11, gap = 4;
    var bw = (B.w - gap * (n - 1)) / n;
    var base = B.h - 7;
    for (var i = 0; i < n; i++) {
      var seed = P.seed + i * 13;
      // 两个不同频率叠加 → 高低乱跳但不规则，且是 p 的纯函数
      var a = 0.5 + 0.5 * Math.sin(p * TAU() * 2 + hash(seed, 1, 1) * TAU());
      var b = 0.5 + 0.5 * Math.sin(p * TAU() * 3.3 + hash(seed, 2, 2) * TAU());
      var hh = (B.h * 0.78) * (0.22 + 0.78 * a * b);
      var x = i * (bw + gap);
      M.fill(ctx, function (c) { roundRect(c, x, base - hh, bw, hh, 2); },
        i % 2 ? M.pal[1] : M.pal[0], { alpha: 0.9 });
    }
    // 底部扫描线来回扫
    var sx = B.w * (0.5 + 0.5 * Math.sin(p * TAU()));
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(sx - 16, base + 4); c.lineTo(sx + 16, base + 4);
    }, M.pal[2], 2, { alpha: 0.85 });
  };

  /* 3 横向扫描光：一道窄光横扫过一片细栅格 */
  FORM.sweepBeam = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    // 细栅格 = 水平细条（百叶窗），用渐变淡出，不能是平涂硬线
    for (var y = 0; y <= h; y += 6) {
      var gg = ctx.createLinearGradient(0, y, 0, y + 1);
      gg.addColorStop(0, hslA(M.pal[0], 0.16));
      gg.addColorStop(1, hslA(M.pal[0], 0.04));
      ctx.save();
      ctx.strokeStyle = gg; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      ctx.restore();
    }
    // 横扫的窄光
    var bx = w * (0.5 + 0.5 * Math.sin(p * TAU()));
    var g = ctx.createLinearGradient(bx - 24, 0, bx + 24, 0);
    g.addColorStop(0, hslA(M.pal[1], 0));
    g.addColorStop(0.5, hslA(M.pal[1], 0.42));
    g.addColorStop(1, hslA(M.pal[1], 0));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.fillRect(bx - 24, 0, 48, h);
    ctx.restore();
    M.stroke(ctx, function (c) { c.beginPath(); c.moveTo(bx, 0); c.lineTo(bx, h); },
      M.pal[3], 1.6, { alpha: 0.95 });
  };

  /* 4 故障标签：一行字被切成三段错位，红蓝两层分离 */
  FORM.glitchLabel = function (ctx, B, p, P, M) {
    var s = P.label || 'ERROR';
    var size = P.size || 14;
    var cx = B.w / 2, cy = B.h / 2;
    var seed = P.seed || 4;
    var top = cy - size * 0.85, span = size * 1.7;
    for (var i = 0; i < 3; i++) {
      // 每条横带一个错位量：p 的纯函数，逐帧 seek 不会打架
      // 错位幅度收到 8px —— 原来 14px 太狠，字直接糊成一团认不出来，
      // 故障感要的是「能看出是字、但被切错位」，不是「一堆彩色乱码」。
      var jx = (hash(seed, i, 1) - 0.5) * 8 * Math.sin(p * TAU() * 2 + i * 2.1);
      var y0 = top + span * (i / 3);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, y0, B.w, span / 3 + 0.5);
      ctx.clip();
      // 红蓝两层分离（偏移小、alpha 低），白色主体压在最上面
      M.text(ctx, s, cx - 3, cy, size, M.pal[1], { alpha: 0.5 });
      M.text(ctx, s, cx + 3, cy, size, M.pal[2], { alpha: 0.5 });
      M.text(ctx, s, cx + jx, cy, size, M.pal[3], { alpha: 1 });
      ctx.restore();
    }
  };

  /* 5 电路脉络：一条从左下蜿蜒到右上的电路，节点逐个脉冲 */
  FORM.circuitVeins = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 5;
    var n = 5 + Math.floor(hash(seed, 1, 1) * 3);   // 5~7 段
    var pts = [[w * 0.06, h * 0.90]];
    var x = w * 0.06, y = h * 0.90;
    for (var i = 0; i < n; i++) {
      if (i % 2 === 0) x += w * (0.18 + hash(seed, i, 3) * 0.13);
      else y -= h * (0.22 + hash(seed, i, 4) * 0.15);
      pts.push([Math.min(x, w * 0.94), Math.max(y, h * 0.08)]);
    }
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(pts[0][0], pts[0][1]);
      for (var j = 1; j < pts.length; j++) c.lineTo(pts[j][0], pts[j][1]);
    }, M.pal[0], 2.6, { alpha: 0.95 });
    // 节点依次脉冲
    for (var k = 1; k < pts.length; k++) {
      var ph = (p + k * 0.13) % 1;
      var a = 0.2 + 0.8 * Math.pow(1 - ph, 3);
      M.particle(ctx, pts[k][0], pts[k][1], 2.5 + 3.5 * a, k % 2 ? M.pal[1] : M.pal[2], { alpha: a });
    }
  };

  /* 6 遥测读数窗：一块小面板，数字在跳，底下有迷你波形 */
  FORM.telemetryPanel = function (ctx, B, p, P, M) {
    var pad = 7, w = B.w, h = B.h;
    var pw = w - pad * 2, ph = h - pad * 2;
    M.fill(ctx, function (c) { roundRect(c, pad, pad, pw, ph, 5); },
      M.pal[4], { alpha: 0.5, box: { x: pad, y: pad, w: pw, h: ph } });
    M.stroke(ctx, function (c) { roundRect(c, pad, pad, pw, ph, 5); }, M.pal[0], 1.5, { alpha: 0.9 });
    M.text(ctx, P.label || 'SYS', pad + 7, pad + 11, 9, M.pal[3],
      { align: 'left', alpha: 0.8 });
    // 读数每秒跳 6 次（p 的纯函数）
    var seed = P.seed || 6;
    var v = Math.floor(hash(seed, Math.floor(p * 6), 1) * 90) + 10;
    M.text(ctx, String(v), pad + 7, pad + ph * 0.46, 19, M.pal[2], { align: 'left' });
    // 迷你波形
    var wy = pad + ph - 13;
    M.stroke(ctx, function (c) {
      c.beginPath();
      for (var x = 0; x <= pw - 14; x += 3) {
        var yy = wy + Math.sin(x / 8 + p * TAU() * 2 + seed) * 3.5;
        if (x === 0) c.moveTo(pad + 7 + x, yy); else c.lineTo(pad + 7 + x, yy);
      }
    }, M.pal[1], 1.4, { alpha: 0.9 });
  };

  /* 7 雷达扇扫：圆盘里一条扇形光扫过，扫过的地方亮点 */
  FORM.radarSweep = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    var r = Math.min(B.w, B.h) * 0.44;
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); }, M.pal[0], 1.7, { alpha: 0.85 });
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r * 0.55, 0, TAU()); }, M.pal[4], 1, { alpha: 0.45 });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - r, cy); c.lineTo(cx + r, cy);
      c.moveTo(cx, cy - r); c.lineTo(cx, cy + r);
    }, M.pal[4], 1, { alpha: 0.4 });
    var sweep = p * TAU();
    M.fill(ctx, function (c) {
      c.beginPath(); c.moveTo(cx, cy);
      c.arc(cx, cy, r * 0.94, sweep - 0.9, sweep);
      c.closePath();
    }, M.pal[1], { alpha: 0.30 });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(cx + Math.cos(sweep) * r * 0.94, cy + Math.sin(sweep) * r * 0.94);
    }, M.pal[3], 2, {});
    // 光点：扫描线刚扫过才亮
    var seed = P.seed || 7;
    for (var i = 0; i < 5; i++) {
      var a = hash(seed, i, 1) * TAU();
      var rr = r * (0.25 + 0.68 * hash(seed, i, 2));
      var d = ((sweep - a) % TAU() + TAU()) % TAU();
      var lit = Math.max(0, 1 - d / 1.4);
      M.particle(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr,
        2 + 2.5 * lit, i % 2 ? M.pal[2] : M.pal[3], { alpha: 0.2 + 0.8 * lit });
    }
  };

  /* 8 倒计时环：环逐渐收拢，亮点在环上跑，中心是数字 */
  FORM.countdownRing = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    var r0 = Math.min(B.w, B.h) * 0.44;
    var r = r0 * (1 - 0.5 * p);                 // p 0→1 环收紧
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r0, 0, TAU()); },
      M.pal[4], 1.2, { alpha: 0.4 });
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); },
      M.pal[0], 4, { alpha: 0.92 });
    var a = p * TAU() * 2;
    M.particle(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4.5, M.pal[1], {});
    var n = Math.max(1, 5 - Math.floor(p * 5));
    M.text(ctx, String(n), cx, cy, P.size || 22, M.pal[3], {});
  };

  /* 9 蓄力斜纹条：斜纹填充的横条，填满会闪一下
     动法（原来 `fill = 0.12 + 0.88 * p` 是**单调增长** ——
     离首帧的差异随时间单调变大，最早那几个时刻差异最小；
     而且 p>0.93 的闪光只占 7% 周期）：
     1) 填充改成**往复**（正弦，首尾相接）；
     2) 斜纹**在条内滚动**（持续动，不靠闪光）；
     3) 填满时的闪光改成**周期性**出现。 */
  FORM.chargeBar = function (ctx, B, p, P, M) {
    // 条高跟盒子走（原来写死 22，在 56 高的盒子里只占 39%，看着像一根细线）
    var h = B.h * 0.46, y = B.h / 2 - h / 2, x0 = 4, w = B.w - 8;
    M.fill(ctx, function (c) { roundRect(c, x0, y, w, h, h / 2); },
      M.pal[4], { alpha: 0.45, box: { x: x0, y: y, w: w, h: h } });
    /* 动法 1：填充往复（连续正弦，首尾相接 → 循环无缝） */
    var fill = 0.12 + 0.88 * (0.5 + 0.5 * Math.sin(p * TAU()));
    var fw = Math.max(h, w * fill);
    M.fill(ctx, function (c) { roundRect(c, x0, y, fw, h, h / 2); }, M.pal[0], { alpha: 0.9 });
    // 斜纹裁在填充区内（roundRect 自己会 beginPath，不能直接拿来当裁剪路径）
    ctx.save();
    ctx.beginPath();
    var rr = h / 2;
    ctx.moveTo(x0 + rr, y);
    ctx.lineTo(x0 + fw - rr, y); ctx.quadraticCurveTo(x0 + fw, y, x0 + fw, y + rr);
    ctx.lineTo(x0 + fw, y + h - rr); ctx.quadraticCurveTo(x0 + fw, y + h, x0 + fw - rr, y + h);
    ctx.lineTo(x0 + rr, y + h); ctx.quadraticCurveTo(x0, y + h, x0, y + h - rr);
    ctx.lineTo(x0, y + rr); ctx.quadraticCurveTo(x0, y, x0 + rr, y);
    ctx.closePath();
    ctx.clip();
    /* 动法 2：斜纹在条内**滚动**（持续动，不依赖闪光） */
    var scroll = (p * 9) % 9;
    M.stroke(ctx, function (c) {
      c.beginPath();
      for (var sx = x0 - h - 9 + scroll; sx < x0 + fw + h; sx += 9) {
        c.moveTo(sx, y + h); c.lineTo(sx + h, y);
      }
    }, M.pal[3], 1.5, { alpha: 0.45 });
    ctx.restore();
    /* 动法 3：填充到高位时的闪光改成**周期性**出现（原来 p>0.93 只占 7% 周期） */
    var ph = (p * 2) % 1;
    if (ph < 0.12) {
      var flash = 1 - ph / 0.12;
      M.stroke(ctx, function (c) { roundRect(c, x0, y, w, h, h / 2); },
        M.pal[1], 3, { alpha: flash });
    }
  };

  /* 10 全息立方：线框立方体缓慢自转，棱上有光扫过 */
  FORM.holoCube = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    // 立方体要**整个装在盒子里**：透视会让顶点往外扩（最远 1.35 倍），
    // 角点还会转到 √2 倍，所以 s 不能按盒宽直接取。
    var s = Math.min(B.w, B.h) * 0.26;
    var yaw = p * TAU();
    var cosY = Math.cos(yaw), sinY = Math.sin(yaw);
    var v = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
             [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
    var pts = [], zs = [];
    for (var i = 0; i < 8; i++) {
      var rx = v[i][0] * cosY + v[i][2] * sinY;
      var rz = -v[i][0] * sinY + v[i][2] * cosY;
      var persp = 1 / (1 + 0.28 * rz);
      pts.push([cx + rx * s * persp, cy + v[i][1] * s * persp]);
      zs.push(rz);
    }
    var edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4],
                 [0, 4], [1, 5], [2, 6], [3, 7]];
    for (var e = 0; e < edges.length; e++) {
      var ia = edges[e][0], ib = edges[e][1];
      var a = pts[ia], b = pts[ib];
      // 靠前的边更亮
      var bright = 0.32 + 0.55 * (1 - (zs[ia] * 0.5 + 0.5));
      M.stroke(ctx, function (c) {
        c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]);
      }, M.pal[0], 1.6, { alpha: bright });
    }
    // 棱上跑的光点
    var idx = Math.floor(p * edges.length) % edges.length;
    var ea = pts[edges[idx][0]], eb = pts[edges[idx][1]];
    var t = (p * edges.length) % 1;
    M.particle(ctx, ea[0] + (eb[0] - ea[0]) * t, ea[1] + (eb[1] - ea[1]) * t,
      3.5, M.pal[1], {});
  };

  /* ======================================================================
     v2 · 专属画法 · 第二族：花卉水彩
     ----------------------------------------------------------------------
     水彩的手感和霓虹完全不同：靠**半透明叠色**和**边缘积色**出效果，
     不是靠辉光。所以这一族的画法一律用 M.fill 的低 alpha 叠 2~3 层，
     边缘再补一道深色描边（纸上水彩的「边缘深中间浅」就是这个道理）。
     ====================================================================== */

  /* 1 盛开花：九瓣水彩花，花心一点花粉 */
  FORM.bloomFlower = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    var R = Math.min(B.w, B.h) * 0.48;
    var n = 9, seed = P.seed || 5;
    var rot = p * TAU() * 0.25;                 // 缓慢转
    // **开花**：花瓣开合。只做纯旋转不行 —— 九瓣是近似对称的，
    // 转起来网格签名几乎不变，探针会判「画面不动」（实测踩过）。
    // 开合会大幅改变着墨面积，才是真正看得见的动。
    var open = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(p * TAU()));
    for (var i = 0; i < n; i++) {
      var a = rot + (i / n) * TAU();
      // 每瓣大小略有差异（否则还是对称的）
      var sz = 0.86 + 0.28 * hash(seed, i, 1);
      var len = R * sz * open;
      M.fill(ctx, function (c) { petalPath(c, cx, cy, len, len * 0.42, a); },
        M.pal[0], { alpha: 0.30 });
      M.fill(ctx, function (c) { petalPath(c, cx, cy, len * 0.72, len * 0.30, a); },
        M.pal[0], { alpha: 0.50 });
      M.fill(ctx, function (c) { petalPath(c, cx, cy, len * 0.48, len * 0.19, a); },
        M.pal[4], { alpha: 0.36 });
    }
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, R * 0.19, 0, TAU()); },
      M.pal[2], { alpha: 0.85 });
    for (var k = 0; k < 7; k++) {
      var aa = hash(seed, k, 1) * TAU();
      var rr = R * 0.22 * (0.35 + hash(seed, k, 2));
      M.particle(ctx, cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr, 1.5,
        M.pal[4], { alpha: 0.8 });
    }
  };

  /* 2 藤蔓卷：一条卷曲的藤蔓，叶子沿藤错开 */
  FORM.tendril = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var N = 40, R0 = Math.min(w, h) * 0.44;
    var pts = [];
    for (var i = 0; i <= N; i++) {
      var u = i / N;
      var a = u * TAU() * 1.6 + p * TAU() * 0.2;
      var r = R0 * (1 - 0.70 * u);
      pts.push([w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r * 0.92]);
    }
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(pts[0][0], pts[0][1]);
      for (var j = 1; j < pts.length; j++) c.lineTo(pts[j][0], pts[j][1]);
    }, M.pal[1], 2.6, { alpha: 0.9 });
    // 叶子沿藤错开
    for (var k = 2; k < N; k += 7) {
      var q = pts[k];
      var side = (k % 2 === 0) ? 1 : -1;
      var a2 = Math.atan2(pts[k + 1][1] - q[1], pts[k + 1][0] - q[0]) + side * 1.25;
      M.fill(ctx, function (c) { leafPath(c, q[0], q[1], 17, 7, a2); },
        M.pal[1], { alpha: 0.72 });
    }
  };

  /* 3 叶脉标本：一片叶子，主脉和侧脉都画出来 */
  FORM.veinLeaf = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h * 0.94;
    var L = Math.min(B.w, B.h) * 0.88;
    var W = L * 0.33;
    var ang = Math.sin(p * TAU()) * 0.055;      // 轻轻摆
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(ang); ctx.translate(-cx, -cy);
    // leafPath 的叶子从 (0,0) 长到 (0,len)，**旋转 -π 才是朝上**
    //（用 -π/2 会朝右，叶脉就会画到叶子外面去 —— 踩过）
    M.fill(ctx, function (c) { leafPath(c, cx, cy, L, W, -Math.PI); },
      M.pal[1], { alpha: 0.38 });
    M.stroke(ctx, function (c) {
      c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx, cy - L);
    }, M.pal[1], 2.2, { alpha: 0.85 });
    for (var i = 1; i <= 6; i++) {
      var t = i / 7;
      var y0 = cy - L * t;
      var half = W * Math.sin(Math.PI * t) * 0.95;
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(cx, y0);
        c.quadraticCurveTo(cx + half * 0.55, y0 - L * 0.02, cx + half, y0 - L * 0.10);
        c.moveTo(cx, y0);
        c.quadraticCurveTo(cx - half * 0.55, y0 - L * 0.02, cx - half, y0 - L * 0.10);
      }, M.pal[1], 1.1, { alpha: 0.55 });
    }
    ctx.restore();
  };

  /* 4 水彩晕团：一团晕开的颜料，边缘深中间浅 */
  FORM.washBloom = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    var R = Math.min(B.w, B.h) * (0.40 + 0.03 * Math.sin(p * TAU()));
    var seed = P.seed || 7;
    for (var i = 0; i < 3; i++) {
      var rr = R * (1 - i * 0.26);
      M.fill(ctx, function (c) { blobPath(c, cx, cy, rr, 9, seed + i * 13, 0.24, 0.86); },
        M.pal[i % 3], { alpha: 0.24 + i * 0.10 });
    }
    // 边缘积色：水彩干在纸上会有一圈更深的边
    M.stroke(ctx, function (c) { blobPath(c, cx, cy, R * 0.97, 9, seed, 0.24, 0.86); },
      M.pal[0], 4, { alpha: 0.32 });
  };

  /* 5 露珠：一颗水珠，里面有折射的高光 */
  FORM.dewDrop = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    var R = Math.min(B.w, B.h) * 0.31 * (1 + 0.03 * Math.sin(p * TAU()));
    // 水是**透明**的：中间要透，边缘和底部才有颜色
    var g = ctx.createRadialGradient(cx - R * 0.30, cy - R * 0.36, R * 0.04,
                                     cx, cy, R * 1.20);
    g.addColorStop(0, hslA(M.pal[2], 0.42));
    g.addColorStop(0.45, hslA(M.pal[0], 0.12));
    g.addColorStop(0.82, hslA(M.pal[3], 0.22));
    g.addColorStop(1, hslA(M.pal[1], 0.42));
    ctx.save();
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(cx, cy, R, R * 1.16, 0, 0, TAU());
    ctx.fill();
    ctx.restore();
    // 一圈亮边（水的弯月面）
    M.stroke(ctx, function (c) {
      c.beginPath(); c.ellipse(cx, cy, R * 0.97, R * 1.13, 0, 0, TAU());
    }, M.pal[2], 1.6, { alpha: 0.55 });
    // 高光
    M.particle(ctx, cx - R * 0.34, cy - R * 0.46, R * 0.15, M.pal[2], { alpha: 0.95 });
    // 底部折射出来的暗斑
    M.fill(ctx, function (c) {
      c.beginPath();
      c.ellipse(cx + R * 0.10, cy + R * 0.58, R * 0.46, R * 0.17, 0, 0, TAU());
    }, M.pal[1], { alpha: 0.34 });
    M.fill(ctx, function (c) {
      c.beginPath();
      c.ellipse(cx, cy + R * 1.40, R * 0.70, R * 0.11, 0, 0, TAU());
    }, M.pal[1], { alpha: 0.14 });
  };

  /* 6 彩纸屑：一把彩纸屑撒开的瞬间 */
  FORM.confetti = function (ctx, B, p, P, M) {
    var seed = P.seed || 8, n = 18;
    for (var i = 0; i < n; i++) {
      var hx = hash(seed, i, 1), hy = hash(seed, i, 2);
      var hs = hash(seed, i, 3), hr = hash(seed, i, 4);
      var spread = 0.22 + 0.78 * p;             // 越撒越开
      var x = B.w / 2 + (hx - 0.5) * B.w * 0.92 * spread;
      var y = B.h * 0.16 + hy * B.h * 0.56 + p * 24 * (0.4 + hs);
      var sz = 5 + hs * 7;
      var rot2 = (hr * 360 + p * 200 * (i % 2 ? 1 : -1)) * Math.PI / 180;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(rot2);
      M.fill(ctx, function (c) {
        c.beginPath(); c.rect(-sz / 2, -sz / 4, sz, sz / 2);
      }, M.pal[i % 4], { alpha: 0.82 });
      ctx.restore();
    }
  };

  /* 7 花粉飘散：花粉颗粒向上飘，颗粒有虚实 */
  FORM.pollenDrift = function (ctx, B, p, P, M) {
    var seed = P.seed || 9, n = 16;
    for (var i = 0; i < n; i++) {
      var hx = hash(seed, i, 1), hy = hash(seed, i, 2), hs = hash(seed, i, 3);
      var ph = (p + hy) % 1;
      var x = hx * B.w + Math.sin(ph * TAU() * 1.5 + i) * 9;
      var y = B.h * 0.94 - ph * B.h * 0.84;
      var fade = Math.sin(ph * Math.PI);        // 中途最实，两端虚掉
      M.particle(ctx, x, y, 1.4 + hs * 2.6, i % 2 ? M.pal[2] : M.pal[4],
        { alpha: 0.20 + 0.55 * fade });
    }
  };

  /* 8 蜡封信封：信封口压一枚圆蜡印 */
  FORM.waxEnvelope = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var bw = Math.min(w * 0.84, 152), bh = Math.min(h * 0.60, 90);
    var x = (w - bw) / 2, y = (h - bh) / 2 + 5;
    M.fill(ctx, function (c) { roundRect(c, x, y, bw, bh, 5); }, M.pal[2], { alpha: 0.78 });
    M.stroke(ctx, function (c) { roundRect(c, x, y, bw, bh, 5); }, M.pal[0], 1.4, { alpha: 0.5 });
    // 封口三角
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(x, y); c.lineTo(x + bw / 2, y + bh * 0.52); c.lineTo(x + bw, y);
      c.closePath();
    }, M.pal[4], { alpha: 0.66 });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(x, y); c.lineTo(x + bw / 2, y + bh * 0.52); c.lineTo(x + bw, y);
    }, M.pal[0], 1.2, { alpha: 0.45 });
    // 蜡印：圆 + 放射压纹（慢慢转）
    var sx = x + bw / 2, sy = y + bh * 0.44, sr = bh * 0.19;
    M.fill(ctx, function (c) { c.beginPath(); c.arc(sx, sy, sr, 0, TAU()); },
      M.pal[0], { alpha: 0.95 });
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(sx, sy, sr * 0.62, 0, TAU()); },
      M.pal[0], 2, { alpha: 0.45 });
    M.stroke(ctx, function (c) {
      c.beginPath();
      for (var i = 0; i < 6; i++) {
        var a = (i / 6) * TAU() + p * TAU() * 0.15;
        c.moveTo(sx + Math.cos(a) * sr * 0.20, sy + Math.sin(a) * sr * 0.20);
        c.lineTo(sx + Math.cos(a) * sr * 0.50, sy + Math.sin(a) * sr * 0.50);
      }
    }, M.pal[0], 1.2, { alpha: 0.42 });
  };

  /* 9 培育标签：一枚小标签插在土里，写着品种
     动法（原来**完全没有专属动法** —— 整张图是死的）：
     1) 签顶的新芽**轻轻摇摆**（三角波 + 取整，避开 sin 取整的死区）；
     2) 标签牌**左右微摆** 1~2px（与新芽异相位，两者不会同时停）；
     3) 土堆上一圈更深的湿土在呼吸。 */
  FORM.seedlingLabel = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, cx = w / 2;
    var soilY = h * 0.88;
    /* 动法 3：土堆颜色呼吸（湿土在变深变浅） */
    var soilA = 0.40 + 0.12 * (0.5 + 0.5 * Math.sin(p * TAU() * 2));
    M.fill(ctx, function (c) {
      c.beginPath();
      c.ellipse(cx, soilY, w * 0.30, h * 0.07, 0, Math.PI, TAU());
      c.closePath();
    }, M.pal[1], { alpha: soilA });
    /* 动法 1：新芽摇摆（三角波，取整到 1px） */
    var triW = 1 - Math.abs(((p * 2) % 2) - 1) * 2;   // 0→1→0 三角波
    var sway = Math.round(triW * 3) - 1;                // -1 ~ +2 px
    /* 动法 2：标签牌左右微摆（异相位，避开与新芽同时停） */
    var triW2 = 1 - Math.abs(((p * 2 + 0.25) % 2) - 1) * 2;
    var tagDx = Math.round(triW2 * 2) - 1;              // -1 ~ +1 px
    // 竹签
    M.fill(ctx, function (c) { roundRect(c, cx - 2.5 + tagDx * 0.5, h * 0.18, 5, h * 0.70, 2); },
      M.pal[2], { alpha: 0.85 });
    // 标签牌
    var pw = Math.min(w * 0.66, 108), ph = h * 0.25;
    var px = cx - pw / 2 + tagDx, py = h * 0.30;
    M.fill(ctx, function (c) { roundRect(c, px, py, pw, ph, 6); }, M.pal[3], { alpha: 0.9 });
    M.stroke(ctx, function (c) { roundRect(c, px, py, pw, ph, 6); }, M.pal[0], 1.3, { alpha: 0.45 });
    M.text(ctx, P.label || '花菱草', cx + tagDx, py + ph / 2, P.size || 13, M.pal[1], {});
    // 签顶的新芽（跟着摇摆）
    M.fill(ctx, function (c) { leafPath(c, cx + sway, h * 0.22, 15, 6, -1.05 + sway * 0.02); },
      M.pal[1], { alpha: 0.8 });
  };

  /* 10 压花标本：一朵被压平的花，贴在一张小纸上 */
  FORM.pressedFlower = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var pw = Math.min(w * 0.76, 134), ph = Math.min(h * 0.82, 110);
    var px = (w - pw) / 2, py = (h - ph) / 2;
    var tilt = Math.sin(p * TAU()) * 0.028;
    ctx.save();
    ctx.translate(w / 2, h / 2); ctx.rotate(tilt); ctx.translate(-w / 2, -h / 2);
    // 纸
    M.fill(ctx, function (c) { c.beginPath(); c.rect(px, py, pw, ph); },
      M.pal[2], { alpha: 0.70 });
    // 压平的花瓣：扁平、褪色
    var cx = px + pw * 0.5, cy = py + ph * 0.54;
    for (var i = 0; i < 7; i++) {
      var a = (i / 7) * TAU() + 0.3;
      M.fill(ctx, function (c) { petalPath(c, cx, cy, ph * 0.34, ph * 0.20, a); },
        M.pal[0], { alpha: 0.30 });
    }
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, ph * 0.08, 0, TAU()); },
      M.pal[4], { alpha: 0.45 });
    // 胶带（斜贴在纸上）
    var tx = px + pw * 0.18, ty = py + 7, ta = -0.5, tw = 25, th = 10;
    var tp = [[-tw / 2, -th / 2], [tw / 2, -th / 2], [tw / 2, th / 2], [-tw / 2, th / 2]]
      .map(function (q) {
        return [tx + q[0] * Math.cos(ta) - q[1] * Math.sin(ta),
                ty + q[0] * Math.sin(ta) + q[1] * Math.cos(ta)];
      });
    M.fill(ctx, function (c) { polyPath(c, tp); }, M.pal[2], { alpha: 0.55 });
    ctx.restore();
  };


  /* 像素图标字形库（8×8）——像素族 10 个元素各一张脸 */
  var GLYPHS = {
    heart: ['01100110', '11111111', '11111111', '11111111', '01111110', '00111100', '00011000', '00000000'],
    sword: ['00000111', '00001110', '00011100', '00111000', '01110000', '11100000', '11000000', '11000000'],
    coin: ['00111100', '01111110', '11111111', '11100111', '11100111', '11111111', '01111110', '00111100'],
    chest: ['00011000', '00111100', '01111110', '11111111', '11100111', '11111111', '11111111', '11111111'],
    flame: ['00011000', '00011000', '00111100', '00111100', '01111110', '01111110', '11111111', '01111110'],
    bubble: ['11111111', '10000001', '10100101', '10100101', '10100101', '10000001', '11111111', '00000000'],
    slot: ['11111111', '11111111', '11000011', '11000011', '11000011', '11111111', '11111111', '00000000'],
    bomb: ['00000100', '00001100', '00011000', '00111100', '00111100', '00111100', '00111100', '00011000'],
    star: ['00010000', '00111000', '00111000', '11111110', '01111100', '01111100', '10110101', '01000100'],
    target: ['00111100', '01100110', '11011011', '11111111', '11011011', '01100110', '00111100', '00000000']
  };

  /* ============================================================== 位置锚点
     10 个位置 = 这批素材「可以摆在视频哪里」的全部可能。
     盒最大 170×110（画布 480×270），占面积不到 15% → 明确的非全屏。
  ======================================================================== */
  var ANCHORS = {
    tl: [6, 6, 190, 120], tc: [145, 6, 190, 120], tr: [284, 6, 190, 120],
    ml: [6, 75, 190, 120], c: [145, 75, 190, 120], mr: [284, 75, 190, 120],
    bl: [6, 144, 190, 120], bc: [145, 144, 190, 120], br: [284, 144, 190, 120],
    bar: [10, 103, 460, 64],
    /* v2 新增 5 个区域。v1 的规格里 corner / full / diag 三个锚点
       **一次都没被用上**，9 个网格位各塞 13 条 —— 这就是「位置都一样」的来历。 */
    vbar: [6, 62, 96, 150], lbar: [6, 198, 150, 56],
    corner: [336, 6, 120, 120], full: [100, 78, 280, 120], diag: [30, 22, 210, 120]
  };
  /* 元素盒外扩这么多才允许作画（给辉光/投影留位置）。
     盒子以外的画布**完全透明**，这批是能叠进视频的小挂件。 */
  var MARGIN = 16;

  /* ================================================================ 引擎 */
  function build(spec, canvas) {
    var fam = MAT[spec.family] || MAT.cyber;
    var M = fam;
    // 原始调色板只取一次，之后每帧从这里派生（见 render 里的说明）
    if (!fam.hslpal) fam.hslpal = fam.pal.slice();
    var W = spec.w || 480, H = spec.h || 270;
    if (!canvas) throw new Error('Sticker.build 需要 canvas');
    var ctx = canvas.getContext('2d');
    // 输出是 960 宽（渲染管线统一 STAGE_OUT_W），画布按 2 倍像素密度画，
    // 否则 480 的画布被截图放大成 960 → 细节全糊。
    var DPR = spec.dpr || 2;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    if (canvas.style) {
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    }
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.imageSmoothingEnabled = true;

    // 像素族：先画到低分辨率离屏画布，再最近邻放大 —— 这才是真像素感
    var off = null, octx = null, OW = 0, OH = 0;
    if (spec.pixelated) {
      OW = Math.round(W / 4); OH = Math.round(H / 4);
      off = document.createElement('canvas');
      off.width = OW; off.height = OH;
      octx = off.getContext('2d');
    }

    /* ================================================================
       特效层（底衬 / 装饰 / 颗粒）离屏 + 羽化
       ---------------------------------------------------------------
       为什么必须离屏
       ---------------
       各族的 decor 几乎都这么写：
           var g = ctx.createRadialGradient(...);
           ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
       渐变的半径常常比元素盒还大（漏光、扫描带、网格地平线都是），
       于是 fillRect 把超出盒子的部分**硬切**在盒子边上 ——
       叠到画面上就看到一块带直角的方形补丁（实测 film-02 的橙块
       被切在盒子右缘，cyber-03/05/09/10 底下一整片矩形网格）。

       颗粒层（post）更糟：它是「往整个盒子里撒点」，
       满盒子的 1px 噪点本身就构成一个方块。

       怎么修
       -------
       把这两层画到**独立离屏画布**，再用 `destination-in` 叠一个
       以元素盒为内切椭圆的羽化遮罩，最后合成回主画布。
       盒子边缘的 alpha 已经趋近 0 → 硬边被彻底抹掉，
       噪点变成一团柔软的云，主体（画法本体）保持实心硬边不动。

       两层分开是因为顺序：底衬+装饰在主体**下面**，
       颗粒要在主体**上面**（胶片颗粒要盖住画面）。
       ================================================================ */
    var fxb = null, fxbc = null, fxp = null, fxpc = null;

    function ensureFx(canvas, ctx2) {
      var tw = off ? OW : W * DPR;
      var th = off ? OH : H * DPR;
      if (canvas.width !== tw || canvas.height !== th) {
        canvas.width = tw; canvas.height = th;
      }
      return ctx2;
    }

    /* 椭圆羽化：中心实、边缘 0。半径取元素盒的内切椭圆 ——
       盒子边缘正好落在 alpha≈0 的位置，装饰层的硬切因此被抹平。 */
    function feather(ctx2, B, padX, padY) {
      var sc = off ? (OW / W) : DPR;
      ctx2.setTransform(1, 0, 0, 1, 0, 0);
      ctx2.save();
      ctx2.globalCompositeOperation = 'destination-in';
      ctx2.translate((B.x + B.w / 2) * sc, (B.y + B.h / 2) * sc);
      ctx2.scale((B.w / 2) * sc, (B.h / 2) * sc);
      var g = ctx2.createRadialGradient(0, 0, 0, 0, 0, 1);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(0.55, 'rgba(0,0,0,0.92)');
      g.addColorStop(0.82, 'rgba(0,0,0,0.55)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx2.fillStyle = g;
      ctx2.beginPath();
      ctx2.arc(0, 0, 1, 0, TAU());
      ctx2.fill();
      ctx2.restore();
      ctx2.globalCompositeOperation = 'source-over';
    }

    try {
      if (document.fonts && document.fonts.load) {
        document.fonts.load('800 32px MiSans', '永');
      }
    } catch (e) { /* 字体没加载也不该崩 */ }

    function pal(i) { return fam.pal[i % fam.pal.length]; }

    /* 元素盒：spec.box 优先（精确矩形），否则回退到锚点表。
       v1 只能选 10 个锚点 → 130 条挤在 9 个网格位上（每格 13 条），
       马哥看到的原话是「位置都一样」。v2 由规格书解算出 130 个
       **两两不同的精确矩形**（见 _tools/sticker_design.py 的 resolve_placements），
       这里只负责把它摆到画布上。 */
    var BOX = spec.box
      ? { x: spec.box[0], y: spec.box[1], w: spec.box[2], h: spec.box[3] }
      : (function () {
          var a = ANCHORS[spec.anchor] || ANCHORS.c;
          return { x: a[0], y: a[1], w: a[2], h: a[3] };
        })();

    /* 旋转：v1 的 SPEC 里根本没有 rot，规格书却给每条写了角度 —— 角度一直
       是死的。现在补上：绕元素盒中心转，裁剪区按旋转后的轴对齐外接盒外扩，
       否则斜着的元素会被裁掉一角。 */
    var ROT = (spec.rot || 0) * Math.PI / 180;

    function render(t) {
      var dur = spec.duration || 5;
      // 循环相位。speed 取整数才无缝（speed 圈跑完回到 0）。
      var p = ((t * (spec.speed || 1) / dur) % 1 + 1) % 1;
      var B = BOX;
      var sc = spec.scale == null ? 1 : spec.scale;
      var P = {
        label: spec.label, size: (spec.size || 18) * (0.85 + 0.15 * sc),
        scale: sc, seed: spec.seed, n: spec.n, cols: spec.cols, rows: spec.rows,
        petals: spec.petals, spikes: spec.spikes, teeth: spec.teeth,
        fill: spec.fill, lw: spec.lw, bgAlpha: spec.bgAlpha,
        glyph: GLYPHS[spec.glyph] || GLYPHS.star,
        energy: spec.energy || 1, hue: spec.hue || 0, speed: spec.speed || 1,
        rot: spec.rot || 0, n2: spec.n2
      };
      // 色相偏移：只作用在调色板上，形态不变。
      // pal 换成「包装对象」数组：形态层可以直接把它丢给 ctx.strokeStyle。
      //
      // ⚠️ 原始调色板必须另存一份（fam.hslpal）：M 就是材质对象本身，
      // 直接改 M.pal 会把材质自己的调色板也改掉，下一帧再包一层，
      // 越包越深 → hsl 算出 NaN → 颜色非法 → 画出来全黑。
      var rawPal = P.hue
        ? fam.hslpal.map(function (c) { return [c[0] + P.hue, c[1], c[2]]; })
        : fam.hslpal;
      M.pal = rawPal.map(palEntry);

      var g = ctx;
      if (off) {
        octx.setTransform(1, 0, 0, 1, 0, 0);
        octx.clearRect(0, 0, OW, OH);
        octx.setTransform(OW / W, 0, 0, OH / H, 0, 0);
        g = octx;
      } else {
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        ctx.clearRect(0, 0, W, H);
      }

      /* 只在元素盒附近作画（外扩 MARGIN 给辉光留位置），
         盒子以外**完全透明** —— 这批是能塞进视频任意位置的小挂件，
         画布其余部分必须是真的空，叠到画面上才干净。
         顺带好处：装饰层自动变成「贴着元素」而不是铺满全画布。
         旋转过的元素要按旋转后的轴对齐外接盒外扩，否则会被裁掉一角。 */
      var cosR = Math.abs(Math.cos(ROT)), sinR = Math.abs(Math.sin(ROT));
      var extW = B.w * cosR + B.h * sinR;
      var extH = B.w * sinR + B.h * cosR;
      var padX = Math.max(0, (extW - B.w) / 2) + MARGIN;
      var padY = Math.max(0, (extH - B.h) / 2) + MARGIN;
      CURW = B.w;          // 文字自适应用的当前元素盒宽度

      /* ---- 第 1 层：底衬 + 装饰（离屏 + 羽化，在主体下面）---- */
      if (!fxb) { fxb = document.createElement('canvas'); fxbc = fxb.getContext('2d'); }
      ensureFx(fxb, fxbc);
      var FSC = off ? (OW / W) : DPR;
      fxbc.setTransform(1, 0, 0, 1, 0, 0);
      fxbc.clearRect(0, 0, fxb.width, fxb.height);
      fxbc.setTransform(FSC, 0, 0, FSC, 0, 0);
      fxbc.save();
      fxbc.translate(B.x, B.y);
      /* ⚠️ 这里传的是**循环相位 p**，不是绝对时间 t。
         绝对时间 t 在循环接缝处（t=0 与 t=duration）天差地别 ——
         底衬/装饰层用 t 就会在接缝处跳一下，整帧不无缝。
         逐帧 seek 校验（p=0 与 p=1 必须逐像素相同）会判失败。
         各材质里要用时间，只准用 p 的**整数圈周期函数**。 */
      if (M.backing) { try { M.backing(fxbc, B.w, B.h, p, spec); } catch (e) { } }
      try { M.decor(fxbc, B.w, B.h, p, spec); } catch (e) { /* 装饰层出错不能拖垮主体 */ }
      fxbc.restore();
      feather(fxbc, B, padX, padY);
      g.save();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(fxb, 0, 0);
      g.restore();

      /* ---- 第 2 层：主体（实心硬边，不羽化）---- */
      g.save();
      g.beginPath();
      g.rect(B.x - padX, B.y - padY, B.w + padX * 2, B.h + padY * 2);
      g.clip();
      g.translate(B.x, B.y);
      var L = { x: 0, y: 0, w: B.w, h: B.h };
      var kind = FORM[spec.kind] || FORM.ring;
      /* 统一的「呼吸 + 浮动」：小元素自身的动作幅度有限，
         统一给一点点缩放和位移，保证每条都在动，而且动得克制。

         ⚠️ **像素族例外**：像素族是「先画到 1/4 离屏再最近邻放大」，
         任何非整数缩放（±2.8% 的呼吸）都会让每个像素块落到半像素上，
         放大后全是糊边。像素必须落在整数网格上。
         所以像素族不套呼吸/漂移 —— 它的动由画法自己做
         （烟升、火苗跳、旗波这些），照样在动，而且像素是锐的。

         ⚠️⚠️ **周期必须是 3 圈，不能是 1/2 圈**（2026-10-20 晚，坑 35）：
         画法最常见的动法是 `sin(p*TAU())`（1 圈）或 `sin(p*TAU()*2)`（2 圈）。
         引擎原来也是 1/2 圈 → **和画法同相位**，
         在 p=0.24 / 0.48 附近两者**一起归零**，
         整帧变成「引擎的呼吸 + 画法的动」同时为零的静止画面。
         实测 120 条里有 30 条在 p=0.5（引擎变换恰好是恒等）时与首帧**逐像素相同**。

         改成 3 圈后，引擎的零点在 p=1/6、1/2、5/6，
         画法的零点在 p=0、0.5（1 圈）或 0、0.25、0.5、0.75（2 圈）——
         虽然仍有重合，但**周期不同 → 曲线形状不同**，
         两者不会在同一个相位同时为零，静止帧被消除。 */
      var breathe = spec.pixelated ? 1 : 1 + 0.028 * Math.sin(p * TAU() * 3);
      var driftX = spec.pixelated ? 0 : Math.sin(p * TAU() * 3) * 2.2;
      var driftY = spec.pixelated ? 0 : Math.sin(p * TAU() * 2) * 1.6;
      g.save();
      g.translate(L.w / 2 + driftX, L.h / 2 + driftY);
      g.rotate(ROT);
      g.scale(breathe, breathe);
      g.translate(-L.w / 2, -L.h / 2);
      try { kind(g, L, p, P, M); } catch (e) {
        // 形态层出错时也要出点东西，不能是空帧。
        // 但**必须把错误报出去** —— 静默画洋红块会被当成"风格"，
        // 踩过：FORM.flower 里 TA() 拼错，整族的花全是洋红方块，
        // 一眼只当是配色怪，没人想到是报错。
        api.lastError = (e && e.message) ? e.message : String(e);
        if (api.onError) { try { api.onError(api.lastError); } catch (e2) { } }
        g.save();
        g.fillStyle = '#ff00ff';
        g.fillRect(0, 0, L.w, L.h);
        g.restore();
      }
      g.restore();
      g.restore();

      /* ---- 第 3 层：颗粒 / 划痕（离屏 + 羽化，盖在主体上面）---- */
      if (!fxp) { fxp = document.createElement('canvas'); fxpc = fxp.getContext('2d'); }
      ensureFx(fxp, fxpc);
      fxpc.setTransform(1, 0, 0, 1, 0, 0);
      fxpc.clearRect(0, 0, fxp.width, fxp.height);
      fxpc.setTransform(FSC, 0, 0, FSC, 0, 0);
      fxpc.save();
      fxpc.translate(B.x, B.y);
      try { M.post(fxpc, B.w, B.h, p, spec); } catch (e) { }
      fxpc.restore();
      feather(fxpc, B, padX, padY);
      g.save();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(fxp, 0, 0);
      g.restore();

      if (off) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
      }
    }

    var api = {
      render: render,
      lastError: null,
      bounds: function () {
        // footprint = 实际会着墨的范围（元素盒 + 外扩），用来断言「非全屏」
        var fx = Math.max(0, BOX.x - MARGIN), fy = Math.max(0, BOX.y - MARGIN);
        var fw = Math.min(W, BOX.x + BOX.w + MARGIN) - fx;
        var fh = Math.min(H, BOX.y + BOX.h + MARGIN) - fy;
        return { x: BOX.x, y: BOX.y, w: BOX.w, h: BOX.h,
                 fx: fx, fy: fy, fw: fw, fh: fh, rot: spec.rot || 0 };
      },
      family: spec.family,
      kind: spec.kind,
      duration: spec.duration || 5
    };
    return api;
  }

  global.Sticker = {
    build: build,
    MAT: MAT, FORM: FORM, ANCHORS: ANCHORS, GLYPHS: GLYPHS,
    hash: hash, mkRng: mkRng, tri: tri, bell: bell,
    /* 路径与数学辅助函数：**暴露出来给各族独立的画法文件用**。
       v2 的 130 个专属画法按族拆成 `sticker_forms_<族>.js`，
       这样各族可以并行开发、互不覆盖同一个文件。 */
    TAU: TAU, lerp: lerp, clamp: clamp, smooth: smooth,
    easeOut: easeOut, easeInOut: easeInOut,
    hsl: hsl, hslA: hslA, palEntry: palEntry,
    roundRect: roundRect, blobPath: blobPath, starPath: starPath,
    polyPath: polyPath, arcPath: arcPath, wavePath: wavePath,
    petalPath: petalPath, leafPath: leafPath, ribbonPath: ribbonPath
  };
})(window);
