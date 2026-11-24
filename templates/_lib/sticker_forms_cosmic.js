/* 宇宙星云 · 10 个专属画法
   ------------------------------------------------------------------
   这一族的手感是**深邃 + 加色发光**：紫青双色、深空背景、
   一切亮部都靠 M.particle / M.fill 的加色叠出来。
   调色板：pal[0] 紫 / pal[1] 青 / pal[2] 深紫 / pal[3] 蓝青 / pal[4] 白
   ------------------------------------------------------------------ */
(function (S) {
  var FORM = S.FORM;
  var hash = S.hash, TAU = S.TAU, polyPath = S.polyPath;
  var roundRect = S.roundRect, blobPath = S.blobPath, starPath = S.starPath;

  /* 1 黑洞吸积：一个黑洞，周围是吸积盘 */
  FORM.blackHole = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    var r = Math.min(B.w, B.h) * 0.20;
    var spin = p * TAU();
    // 吸积盘（背半）
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(-0.32); ctx.scale(1, 0.30);
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(0, 0, r * 2.1, 0, TAU()); },
      M.pal[0], 7, { alpha: 0.85 });
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(0, 0, r * 1.6, 0, TAU()); },
      M.pal[1], 4, { alpha: 0.7 });
    ctx.restore();
    // 事件视界
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); },
      M.pal[2], { alpha: 0.95 });
    // 光子环
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r * 1.06, 0, TAU()); },
      M.pal[4], 2.4, { alpha: 0.95 });
    // 被吸积盘拉出的光弧（前半，压在视界上）
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(-0.32); ctx.scale(1, 0.30);
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.arc(0, 0, r * 2.1, spin, spin + 1.5);
    }, M.pal[4], 5, { alpha: 0.9 });
    ctx.restore();
    // 飞出去的粒子
    for (var i = 0; i < 8; i++) {
      var a = spin * 1.4 + (i / 8) * TAU();
      var rr = r * (2.4 + hash(P.seed || 41, i, 1) * 1.2);
      M.particle(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.4, 1.6,
        M.pal[1], { alpha: 0.55 });
    }
  };

  /* 2 超新星爆发：一颗星在炸开，冲击波一圈圈 */
  FORM.supernova = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    var R = Math.min(B.w, B.h) * 0.44;
    // 冲击波：几圈扩散的环
    for (var i = 0; i < 3; i++) {
      var u = (p + i / 3) % 1;
      var r = R * (0.15 + u * 0.85);
      M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); },
        M.pal[1], 1 + (1 - u) * 4, { alpha: 0.62 * (1 - u) + 0.05 });
    }
    // 核心
    var cr = R * (0.16 + 0.06 * Math.sin(p * TAU() * 2));
    M.particle(ctx, cx, cy, cr, M.pal[4], { alpha: 0.95 });
    M.particle(ctx, cx, cy, cr * 1.8, M.pal[0], { alpha: 0.6 });
    // 迸开的星芒
    for (var k = 0; k < 10; k++) {
      var a = (k / 10) * TAU() + p * 0.3;
      var len = R * (0.35 + hash(P.seed || 42, k, 1) * 0.55);
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(cx + Math.cos(a) * cr, cy + Math.sin(a) * cr);
        c.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
      }, M.pal[0], 1.8, { alpha: 0.7 });
    }
  };

  /* 3 星座连线：几个星点被线连成图形 */
  FORM.constellation = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 43;
    var n = 6, pts = [];
    for (var i = 0; i < n; i++) {
      pts.push([w * (0.12 + hash(seed, i, 1) * 0.76),
                h * (0.12 + hash(seed, i, 2) * 0.76)]);
    }
    // 连线：连成一条折线 + 一条闭合线
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(pts[0][0], pts[0][1]);
      for (var k = 1; k < n; k++) c.lineTo(pts[k][0], pts[k][1]);
    }, M.pal[1], 1.1, { alpha: 0.55 });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(pts[0][0], pts[0][1]);
      c.lineTo(pts[3][0], pts[3][1]);
      c.lineTo(pts[5][0], pts[5][1]);
      c.closePath();
    }, M.pal[0], 1, { alpha: 0.40 });
    // 星点（会呼吸）
    for (var j = 0; j < n; j++) {
      var tw = 0.55 + 0.45 * Math.sin(p * TAU() * 2 + j * 1.1);
      M.particle(ctx, pts[j][0], pts[j][1], 2 + 2.5 * tw, M.pal[4], { alpha: tw });
      M.particle(ctx, pts[j][0], pts[j][1], 6 + 5 * tw, M.pal[1], { alpha: 0.22 * tw });
    }
  };

  /* 4 彗星：一颗带长尾巴的星 */
  FORM.comet = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var hx = w * (0.70 - p * 0.10), hy = h * (0.34 + p * 0.10);
    // 尾巴：一串渐远的粒子
    for (var i = 1; i <= 22; i++) {
      var u = i / 22;
      var tx = hx - u * w * 0.62;
      var ty = hy + u * h * 0.30 + Math.sin(u * 3 + p * TAU()) * 5;
      M.particle(ctx, tx, ty, (1 - u) * 3.2 + 0.6, i % 2 ? M.pal[1] : M.pal[0],
        { alpha: (1 - u) * 0.7 });
    }
    // 彗头
    M.particle(ctx, hx, hy, 8, M.pal[4], { alpha: 0.95 });
    M.particle(ctx, hx, hy, 14, M.pal[1], { alpha: 0.45 });
    // 几道尾羽
    for (var k = 0; k < 3; k++) {
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(hx, hy);
        c.quadraticCurveTo(hx - w * 0.22, hy + (k - 1) * 9,
                           hx - w * 0.50, hy + (k - 1) * 16);
      }, k === 1 ? M.pal[4] : M.pal[1], 1.6, { alpha: 0.45 });
    }
  };

  /* 5 星云团：一团紫青交织的星云 */
  FORM.nebulaCloud = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 44;
    var cx = w / 2, cy = h / 2;
    // 几团云：紫的、青的，叠在一起
    for (var i = 0; i < 6; i++) {
      var a = hash(seed, i, 1) * TAU();
      var rr = Math.min(w, h) * (0.10 + hash(seed, i, 2) * 0.26);
      var x = cx + Math.cos(a) * rr * 0.8, y = cy + Math.sin(a) * rr * 0.55;
      var grow = 1 + 0.08 * Math.sin(p * TAU() + i);
      M.fill(ctx, function (c) {
        blobPath(c, x, y, Math.min(w, h) * 0.26 * grow, 9, seed + i * 11, 0.35, 0.7);
      }, i % 2 ? M.pal[0] : M.pal[1], { alpha: 0.26 });
    }
    // 星尘
    for (var k = 0; k < 22; k++) {
      var sx = hash(seed, k, 3) * w, sy = hash(seed, k, 4) * h;
      var tw = 0.4 + 0.6 * Math.sin(p * TAU() * 2 + k * 0.8);
      M.particle(ctx, sx, sy, 0.8 + hash(seed, k, 5) * 1.6, M.pal[4], { alpha: 0.75 * tw });
    }
    // 中心的一颗亮星
    M.particle(ctx, cx, cy, 4 + 2 * Math.sin(p * TAU()), M.pal[4], { alpha: 0.9 });
  };

  /* 6 宇航徽：一枚圆形任务徽章 */
  FORM.missionPatch = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    var r = Math.min(B.w, B.h) * 0.40;
    // 底圆
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); },
      M.pal[2], { alpha: 0.95 });
    // 外圈
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); },
      M.pal[4], 2.6, { alpha: 0.9 });
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r * 0.80, 0, TAU()); },
      M.pal[1], 1.4, { alpha: 0.7 });
    // 上半：一颗星 + 轨道
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy - r * 0.34, r * 0.15, 0, TAU()); },
      M.pal[4], { alpha: 0.95 });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.ellipse(cx, cy - r * 0.30, r * 0.52, r * 0.16, -0.35, 0, TAU());
    }, M.pal[1], 1.6, { alpha: 0.85 });
    // 环绕的小圆点（转）
    for (var i = 0; i < 5; i++) {
      var a = p * TAU() * 0.6 + (i / 5) * TAU();
      M.particle(ctx, cx + Math.cos(a) * r * 0.66, cy + Math.sin(a) * r * 0.66,
        2, M.pal[0], { alpha: 0.85 });
    }
    // 下方字带
    M.fill(ctx, function (c) {
      c.beginPath();
      c.rect(cx - r * 0.62, cy + r * 0.34, r * 1.24, r * 0.20);
    }, M.pal[1], { alpha: 0.85 });
  };

  /* 7 太阳能板阵：展开的太阳能板在转 */
  FORM.solarArray = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    var spin = p * TAU();
    var L = Math.min(B.w, B.h) * 0.44;
    // 中心轴
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, L * 0.16, 0, TAU()); },
      M.pal[3], { alpha: 0.95 });
    // 两片板（对着转）
    for (var k = 0; k < 2; k++) {
      var a = spin + k * Math.PI;
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(a);
      // 板
      M.fill(ctx, function (c) {
        c.beginPath();
        c.rect(L * 0.18, -L * 0.20, L * 0.82, L * 0.40);
      }, M.pal[2], { alpha: 0.9 });
      // 电池格
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 2; j++) {
          M.stroke(ctx, function (c) {
            c.beginPath();
            c.rect(L * (0.22 + i * 0.20), -L * 0.17 + j * L * 0.19, L * 0.16, L * 0.15);
          }, M.pal[1], 0.9, { alpha: 0.7 });
        }
      }
      // 支撑杆
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(0, 0); c.lineTo(L * 0.20, 0);
      }, M.pal[4], 2.4, { alpha: 0.9 });
      ctx.restore();
    }
    // 反射的光
    M.particle(ctx, cx, cy, L * 0.30, M.pal[4], { alpha: 0.35 });
  };

  /* 8 陨石：一块带着轨迹的陨石 */
  FORM.meteorite = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 45;
    /* 动法（原来陨石是**单调漂移** `0.72 - p*0.06` ——
       离首帧的差异随时间单调变化，最早那几个时刻差异最小；
       而且它是一个点状物，位移幅度又小）：
       1) 改成**往复**（正弦，首尾相接 → 循环无缝）；
       2) 石头本体**自转**；
       3) 拖尾的碎屑跟着一起动。 */
    var drift = 0.5 + 0.5 * Math.sin(p * TAU());
    var hx = w * (0.86 - drift * 0.20), hy = h * (0.24 + drift * 0.14);
    var spin = p * TAU();
    // 轨迹（一条淡的带子）
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(w * 1.05, h * 0.02);
      c.quadraticCurveTo(w * 0.5, h * 0.2, hx, hy);
    }, M.pal[1], 2.4, { alpha: 0.4 });
    // 拖尾的碎屑
    for (var i = 0; i < 8; i++) {
      var u = i / 8;
      M.particle(ctx, hx + u * w * 0.42, hy - u * h * 0.22 + Math.sin(u * 5) * 4,
        1.6 - u, M.pal[0], { alpha: 0.6 * (1 - u) });
    }
    // 石头本体（不规则多面块）—— 原来 r=min(w,h)*0.16 → 直径只有 38px，
    // 在 190×120 的盒子里缩成一个小白点，看不出是石头。
    var r = Math.min(w, h) * 0.30, pts = [];
    for (var k = 0; k < 7; k++) {
      /* 动法 2：石头**自转**（角点跟着 spin 转 → 轮廓一直在变） */
      var a = (k / 7) * TAU() + spin;
      var rr = r * (0.72 + hash(seed, k, 1) * 0.5);
      pts.push([hx + Math.cos(a) * rr, hy + Math.sin(a) * rr]);
    }
    M.fill(ctx, function (c) { polyPath(c, pts); c.closePath(); },
      M.pal[3], { alpha: 0.95 });
    // 受光面 / 背光面：把石头切成两块，才不像一块白板
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(hx + Math.cos(2.2 + spin) * r, hy + Math.sin(2.2 + spin) * r);
      for (var k2 = 0; k2 < 7; k2++) {
        var a2 = (k2 / 7) * TAU() + spin;
        if (a2 < 2.2 + spin) continue;
        c.lineTo(hx + Math.cos(a2) * r * 0.98, hy + Math.sin(a2) * r * 0.98);
      }
      c.closePath();
    }, M.pal[2], { alpha: 0.55 });
    M.stroke(ctx, function (c) { polyPath(c, pts); }, M.pal[1], 1.6, { alpha: 0.75 });
    // 陨石坑
    for (var q = 0; q < 3; q++) {
      var qa = hash(seed, q, 7) * TAU() + spin, qd = r * (0.15 + hash(seed, q, 8) * 0.45);
      M.fill(ctx, function (c) {
        c.beginPath();
        c.arc(hx + Math.cos(qa) * qd, hy + Math.sin(qa) * qd,
              r * (0.09 + hash(seed, q, 9) * 0.09), 0, TAU());
      }, M.pal[1], { alpha: 0.45 });
    }
    // 迎面的一层光
    M.particle(ctx, hx - r * 0.3, hy - r * 0.3, r * 0.55, M.pal[4], { alpha: 0.4 });
  };

  /* 9 脉冲星：一颗球体射出两道光束 */
  FORM.pulsar = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    var r = Math.min(B.w, B.h) * 0.16;
    var spin = p * TAU();
    // 两道光束（转）
    for (var k = 0; k < 2; k++) {
      var a = spin + k * Math.PI;
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(a);
      var g = ctx.createLinearGradient(0, 0, B.w, 0);
      g.addColorStop(0, S.hslA(M.pal[1], 0.55));
      g.addColorStop(1, S.hslA(M.pal[1], 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.45);
      ctx.lineTo(B.w, -r * 1.5);
      ctx.lineTo(B.w, r * 1.5);
      ctx.lineTo(0, r * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    // 球体
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); },
      M.pal[2], { alpha: 0.95 });
    M.particle(ctx, cx, cy, r * 0.6, M.pal[4], { alpha: 0.85 });
    M.particle(ctx, cx, cy, r * 1.5, M.pal[0], { alpha: 0.4 });
  };

  /* 10 坐标牌：一串赤经赤纬数字 */
  FORM.coordsPlate = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var s = P.label || 'RA 23h 14m';
    var size = P.size || 15;
    /* 这条是 vbar 构图（96×150 的窄条）——坐标牌本来就该是**竖着的窄牌**，
       原来做成横向牌（tw=min(w*0.84,138)=80 宽）塞进窄条里，
       数字还跟着打字机效果只显示 4 个（"RA 2"），完全读不出是坐标。 */
    var pw = w * 0.86, ph = h * 0.86;
    var px = (w - pw) / 2, py = (h - ph) / 2;
    // 底板
    M.fill(ctx, function (c) { roundRect(c, px, py, pw, ph, 3); },
      M.pal[2], { alpha: 0.92 });
    M.stroke(ctx, function (c) { roundRect(c, px, py, pw, ph, 3); },
      M.pal[1], 1.3, { alpha: 0.8 });
    // 顶头一条高亮条
    M.fill(ctx, function (c) {
      c.beginPath();
      c.rect(px + 6, py + 6, pw - 12, 3);
    }, M.pal[0], { alpha: 0.85 });

    /* 坐标数字**竖排**，从上往下依次点亮。
       数字「在跳」是动效，但**大部分时间必须是完整的一串** ——
       原来 floor(p*(len+2)) 让整条循环才打完，静帧只剩 4 个字符。
       另外竖排时**空格要跳过**（"RA 23h 14m" 里的空格占一行，
       渲出来是一列散字），字距也收紧一点。 */
    var chars = s.split('').filter(function (c) { return c !== ' '; });
    var lit = Math.min(chars.length, Math.max(1, Math.round(Math.min(1, p / 0.3) * chars.length)));
    var fs = Math.min(size, (pw - 18) / 0.62);
    for (var i = 0; i < lit; i++) {
      var a = i < lit - 1 ? 1 : (0.55 + 0.45 * Math.abs(Math.sin(p * TAU() * 2)));
      M.text(ctx, chars[i], px + pw / 2, py + 22 + i * (fs * 1.02), fs, M.pal[4],
        { alpha: a });
    }
    // 下面一排刻度
    for (var k = 0; k < 7; k++) {
      var tx = px + 9 + (pw - 18) * (k / 6);
      M.fill(ctx, function (c) {
        c.beginPath();
        c.rect(tx, py + ph - 14, 1.4, 6);
      }, M.pal[1], { alpha: 0.75 });
    }
    // 定位点
    M.particle(ctx, px + pw * (0.22 + 0.56 * p), py + ph - 17, 2.6, M.pal[0], { alpha: 0.95 });
  };
})(window.Sticker);
