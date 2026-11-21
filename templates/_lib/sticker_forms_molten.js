/* 熔岩灼烧 · 10 个专属画法
   ----------------------------------------------------------------------
   这一族的手感：**暗底 + 高热的橙红 + 冷却的硬壳**，对比拉满。
   通用手法：先铺一层近黑的硬壳（M.pal[2]），再在裂缝 / 断口处叠一条
   加色发光的亮线（M.stroke 走 lighter）—— 就是「缝里透着红」。

   材质调色板（M.pal，见 sticker.js 的 MAT.molten）：
     [0] 亮红橙（热）  [1] 琥珀橙（更热）
     [2] 近黑（冷壳）  [3] 暖深灰（灰烬 / 铁）  [4] 纯黑

   10 条的轮廓刻意互不相同：
     柱 / 网 / 环 / 滩 / 烟 / 带 / 迸 / 板 / 砧 / 岩
   10 条的动法也互不相同：
     呼吸 + 滴落 / 热浪跑线 / 核心脉动 / 缓流 / 上翻 / 滚动高光 /
     迸射 / 热光游走 / 砧面余温 / 缝火闪烁
   ------------------------------------------------------------------ */
(function (S) {
  'use strict';
  var FORM = S.FORM;
  var TAU = S.TAU, hash = S.hash, tri = S.tri, bell = S.bell;
  var blobPath = S.blobPath;

  /* ---------------------------------------------------------- 本族小工具 */
  /** 折线 / 多边形。第一个动作永远是 beginPath。 */
  function poly(c, pts, close) {
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    if (close !== false) c.closePath();
  }
  function ellipse(c, x, y, rx, ry, rot) {
    c.beginPath();
    c.ellipse(x, y, Math.max(0.2, rx), Math.max(0.2, ry), rot || 0, 0, TAU());
  }
  /** M.fill 的渐变中心在 box 的 (0.4, 0.3) 处 —— 想让高光落在形状中心，
      box 就要往回挪：gbox(cx, cy, w, h) 让渐变中心正好等于 (cx, cy)。 */
  function gbox(cx, cy, bw, bh) {
    return { x: cx - bw * 0.4, y: cy - bh * 0.3, w: bw, h: bh };
  }
  /** 循环相位：p 与 p+1 完全一致（无缝循环的地基）。
      乘数必须是整数 —— 0.5 / 1.3 这类会让 p=1 和 p=0 对不上。 */
  function cyc(x) { return x - Math.floor(x); }

  /* ==================================================================
     1 熔岩喷泉：一根向上喷的熔浆柱，柱顶炸成一片冠状熔浪，
       柱缘挂着往下淌的熔滴。竖构图，重心在下。
     ================================================================== */
  FORM.lavaFountain = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 101;
    var cx = w * 0.5;
    var base = h * 0.97;
    var pulse = 0.93 + 0.11 * Math.sin(p * TAU());
    var top = base - h * 0.62 * pulse;
    var w0 = w * 0.105, wm = w * 0.05, wt = w * 0.125;

    /* 喷口周围摊开的熔滩 */
    M.fill(ctx, function (c) { c.beginPath(); ellipse(c, cx, base - 3, w * 0.27, h * 0.10); },
      M.pal[0], { alpha: 0.88, box: gbox(cx, base - 3, w * 0.54, h * 0.20) });
    /* 冷壳：柱体外缘的硬壳 */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - w0, base);
      c.bezierCurveTo(cx - w0 * 0.9, base - (base - top) * 0.45,
                      cx - wm, base - (base - top) * 0.76, cx - wt, top);
      c.lineTo(cx + wt, top);
      c.bezierCurveTo(cx + wm, base - (base - top) * 0.76,
                      cx + w0 * 0.9, base - (base - top) * 0.45, cx + w0, base);
      c.closePath();
    }, M.pal[2], { alpha: 0.96, box: gbox(cx, (top + base) / 2, wt * 2.4, (base - top) * 1.4) });
    /* 热浆：柱体 */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - w0 * 0.70, base);
      c.bezierCurveTo(cx - w0 * 0.60, base - (base - top) * 0.45,
                      cx - wm * 0.8, base - (base - top) * 0.76, cx - wt * 0.62, top + 2);
      c.lineTo(cx + wt * 0.62, top + 2);
      c.bezierCurveTo(cx + wm * 0.8, base - (base - top) * 0.76,
                      cx + w0 * 0.60, base - (base - top) * 0.45, cx + w0 * 0.70, base);
      c.closePath();
    }, M.pal[0], { alpha: 1, box: gbox(cx, (top + base) / 2, wt * 1.6, (base - top) * 1.3) });
    /* 白热芯 */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - w0 * 0.34, base);
      c.bezierCurveTo(cx - w0 * 0.30, base - (base - top) * 0.5,
                      cx - wm * 0.4, base - (base - top) * 0.78, cx - wt * 0.26, top + 4);
      c.lineTo(cx + wt * 0.26, top + 4);
      c.bezierCurveTo(cx + wm * 0.4, base - (base - top) * 0.78,
                      cx + w0 * 0.30, base - (base - top) * 0.5, cx + w0 * 0.34, base);
      c.closePath();
    }, M.pal[1], { alpha: 1, box: gbox(cx, (top + base) / 2, wt * 0.9, (base - top) * 1.2) });

    /* 柱顶炸开的冠状熔浪：一大片连着的熔团，不是一串珠子 */
    for (var i = 0; i < 5; i++) {
      var a = -1.15 + i * 0.58;
      var sp = 1 + 0.18 * Math.sin(p * TAU() * 2 + i * 1.3);
      var rr = wt * 1.15 * sp;
      var bx = cx + Math.sin(a) * rr;
      var by = top - Math.cos(a) * rr * 0.52;
      var br = wt * (0.52 + 0.26 * hash(seed, i, 1));
      M.fill(ctx, function (c) { c.beginPath(); ellipse(c, bx, by, br, br * 0.80, a * 0.4); },
        M.pal[0], { alpha: 0.95, box: gbox(bx, by, br * 2.2, br * 1.8) });
    }
    /* 冠状熔团的白热芯 */
    for (var q = 0; q < 3; q++) {
      var a2 = -0.7 + q * 0.7;
      var rr2 = wt * 1.0;
      var bx2 = cx + Math.sin(a2) * rr2;
      var by2 = top - Math.cos(a2) * rr2 * 0.5;
      M.particle(ctx, bx2, by2, wt * 0.34, M.pal[1], { alpha: 0.85 });
    }
    /* 柱缘淌下的熔滴 */
    for (var d = 0; d < 6; d++) {
      var side = (d % 2 === 0) ? -1 : 1;
      var u = tri(p + d * 0.27);
      var fall = u * u;
      var dx = cx + side * (wt * 0.92 + 4 + 2.5 * Math.sin(p * TAU() * 3 + d));
      var dy = top + (base - top) * (0.20 + 0.76 * fall);
      var dr = 2.0 + 1.0 * hash(seed, d, 2);
      M.fill(ctx, function (c) { c.beginPath(); ellipse(c, dx, dy, dr, dr * (1 + 2.4 * fall)); },
        M.pal[1], { alpha: 0.92, box: gbox(dx, dy, dr * 2.4, dr * 6.5) });
      M.particle(ctx, dx, dy + dr * 1.8 * fall, dr * 0.85, M.pal[1], { alpha: 0.8 });
    }
    /* 溅起的火星 */
    for (var s = 0; s < 6; s++) {
      var u2 = cyc(p + hash(seed, s, 3));
      var sx = cx + (hash(seed, s, 4) - 0.5) * w * 0.46;
      var sy = top - u2 * h * 0.26;
      M.particle(ctx, sx, sy, 1.6 * (1 - u2 * 0.6), M.pal[1], { alpha: 0.8 * (1 - u2) });
    }
  };

  /* ==================================================================
     2 裂纹网：地面裂开的网状裂缝。破碎的岩层地面，缝里透出红光，
       一道热浪沿着裂缝网跑。横铺满盒子的构图。
     ================================================================== */
  FORM.crackNet = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 202;
    var y0 = h * 0.28;                       /* 地平线 */

    /* 破碎的岩层地面：顶边是参差的断口 */
    var edge = [];
    for (var e = 0; e <= 22; e++) {
      var ex = w * e / 22;
      var ey = y0 + (hash(seed, e, 1) - 0.5) * h * 0.10 + Math.sin(e * 0.8) * h * 0.03;
      edge.push([ex, ey]);
    }
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(0, h);
      c.lineTo(0, edge[0][1]);
      for (var i = 1; i < edge.length; i++) c.lineTo(edge[i][0], edge[i][1]);
      c.lineTo(w, h);
      c.closePath();
    }, M.pal[2], { alpha: 0.88, box: gbox(w * 0.5, h * 0.78, w * 1.6, h * 1.2) });
    /* 岩层纹理：横向的层理 + 地平线上被照亮的一线 */
    for (var s = 0; s < 5; s++) {
      var sy = y0 + 8 + (h - y0) * (0.18 + 0.19 * s);
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(0, sy);
        for (var t = 1; t <= 8; t++) {
          c.lineTo(w * t / 8, sy + Math.sin(t * 1.4 + s) * h * 0.012);
        }
      }, M.pal[3], 1.3, { alpha: 0.20 });
    }
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(edge[0][0], edge[0][1]);
      for (var u = 1; u < edge.length; u++) c.lineTo(edge[u][0], edge[u][1]);
    }, M.pal[0], 1.6, { alpha: 0.22 });
    /* 岩面上的裂纹质感（暗线，不发光） */
    for (var f = 0; f < 7; f++) {
      var fx = w * hash(seed, f, 2);
      var fy = h * (0.45 + 0.5 * hash(seed, f, 3));
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(fx, fy);
        c.lineTo(fx + (hash(seed, f, 4) - 0.5) * w * 0.18, fy + (hash(seed, f, 5) - 0.5) * h * 0.2);
      }, M.pal[3], 1.4, { alpha: 0.4 });
    }

    var rows = 4, cols = 6;
    function node(i, j) {
      var fx2 = (i + 0.5) / cols;
      var x = fx2 * w + (hash(seed, i * 7 + j, 2) - 0.5) * (w / cols) * 0.62;
      var fy2 = Math.pow(j / (rows - 1), 1.3);
      var y = y0 + 6 + fy2 * (h - y0 - 10);
      return [x, y];
    }
    var k = 0;
    function drawCrack(a, b) {
      var mx = (a[0] + b[0]) / 2 + (hash(seed, k, 3) - 0.5) * w * 0.08;
      var my = (a[1] + b[1]) / 2 + (hash(seed, k, 4) - 0.5) * h * 0.11;
      var heat = Math.pow(Math.max(0, Math.sin(TAU() * (hash(seed, k, 5) - p))), 5);
      var path = function (c) {
        c.beginPath();
        c.moveTo(a[0], a[1]);
        c.quadraticCurveTo(mx, my, b[0], b[1]);
      };
      M.stroke(ctx, path, M.pal[0], 2.2, { alpha: 0.42 });
      M.stroke(ctx, path, M.pal[1], 1.0, { alpha: 0.12 + 0.88 * heat });
      k++;
    }
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        if (i < cols - 1 && hash(seed, i * 5 + j, 6) > 0.20) drawCrack(node(i, j), node(i + 1, j));
        if (j < rows - 1 && hash(seed, i * 3 + j, 7) > 0.26) drawCrack(node(i, j), node(i, j + 1));
      }
    }
    /* 贯穿的主裂缝 */
    drawCrack(node(1, rows - 1), node(3, 0));
    drawCrack(node(4, rows - 1), node(2, 1));
    drawCrack(node(0, 2), node(5, 2));
    /* 地平线上的碎石 */
    for (var r = 0; r < 6; r++) {
      var rx = w * (0.06 + 0.17 * r) + (hash(seed, r, 8) - 0.5) * w * 0.06;
      var ry = y0 + (hash(seed, r, 9) - 0.5) * h * 0.10;
      var rr2 = 3 + 4 * hash(seed, r, 10);
      M.fill(ctx, function (c) { c.beginPath(); ellipse(c, rx, ry, rr2, rr2 * 0.66); },
        M.pal[2], { alpha: 0.95, box: gbox(rx, ry, rr2 * 2.4, rr2 * 1.8) });
      M.stroke(ctx, function (c) { c.beginPath(); ellipse(c, rx, ry, rr2, rr2 * 0.66); },
        M.pal[0], 1.0, { alpha: 0.14 });
    }
  };

  /* ==================================================================
     3 火山口：一座火山的锥体，顶上是一个发光的环形山口，
       熔浆从右坡淌下来。三角形剪影，和别的画法完全不是一路。
     ================================================================== */
  FORM.crater = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 303;
    var cx = w * 0.50;
    var top = h * 0.17;                 /* 山口高度 */
    var baseY = h * 0.95;
    var rw = w * 0.115;                 /* 山口半宽 */
    var bowl = h * 0.115;               /* 碗深 */
    var pulse = 0.92 + 0.12 * Math.sin(p * TAU());

    /* 山体：左坡 → 山口 → 右坡 */
    var body = [
      [w * 0.07, baseY],
      [w * 0.15, h * 0.74],
      [w * 0.24, h * 0.56],
      [w * 0.32, h * 0.34],
      [cx - rw * 1.25, top + h * 0.02],
      [cx - rw, top],
      [cx - rw * 0.55, top + bowl * 0.72],
      [cx, top + bowl],
      [cx + rw * 0.55, top + bowl * 0.72],
      [cx + rw, top],
      [cx + rw * 1.3, top + h * 0.03],
      [w * 0.70, h * 0.32],
      [w * 0.79, h * 0.55],
      [w * 0.88, h * 0.76],
      [w * 0.95, baseY]
    ];
    M.fill(ctx, function (c) { c.beginPath(); poly(c, body); }, M.pal[2],
      { alpha: 1, box: gbox(cx, h * 0.7, w * 1.2, h * 1.1) });
    /* 山体上受光的一面 */
    M.fill(ctx, function (c) {
      poly(c, [[w * 0.07, baseY], [w * 0.15, h * 0.74], [w * 0.24, h * 0.56],
               [w * 0.32, h * 0.34], [cx - rw * 1.25, top + h * 0.02],
               [cx - rw * 0.35, top + h * 0.06], [w * 0.30, h * 0.60],
               [w * 0.20, h * 0.80], [w * 0.14, baseY]]);
    }, M.pal[3], { alpha: 0.30, box: gbox(w * 0.26, h * 0.66, w * 0.6, h * 0.8) });

    /* 山口里的熔浆 */
    M.fill(ctx, function (c) {
      poly(c, [[cx - rw, top], [cx - rw * 0.55, top + bowl * 0.72], [cx, top + bowl],
               [cx + rw * 0.55, top + bowl * 0.72], [cx + rw, top]]);
    }, M.pal[0], { alpha: 1, box: gbox(cx, top + bowl * 0.4, rw * 2.4, bowl * 1.6) });
    M.fill(ctx, function (c) {
      poly(c, [[cx - rw * 0.62, top + h * 0.006], [cx - rw * 0.3, top + bowl * 0.55],
               [cx, top + bowl * 0.82], [cx + rw * 0.3, top + bowl * 0.55],
               [cx + rw * 0.62, top + h * 0.006]]);
    }, M.pal[1], { alpha: 0.95, box: gbox(cx, top + bowl * 0.4, rw * 1.5, bowl * 1.1) });
    /* 山口的辉光唇口 */
    M.stroke(ctx, function (c) {
      poly(c, [[cx - rw, top], [cx - rw * 0.55, top + bowl * 0.72], [cx, top + bowl],
               [cx + rw * 0.55, top + bowl * 0.72], [cx + rw, top]], false);
    }, M.pal[0], 2.6, { alpha: 0.45 + 0.45 * pulse });

    /* 从山口右侧淌下来的熔浆：顺着右坡往下，贴着坡面 */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - rw * 0.1, top + bowl * 0.55);
      c.lineTo(cx + rw * 1.0, top + h * 0.015);
      c.lineTo(w * 0.745, h * 0.52);
      c.lineTo(w * 0.715, h * 0.62);
      c.lineTo(w * 0.685, h * 0.51);
      c.lineTo(cx + rw * 0.5, top + bowl * 0.5);
      c.closePath();
    }, M.pal[0], { alpha: 1, box: gbox(cx + w * 0.09, h * 0.33, w * 0.42, h * 0.68) });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx + rw * 0.45, top + h * 0.03);
      c.lineTo(w * 0.712, h * 0.55);
    }, M.pal[1], 1.8, { alpha: 0.45 + 0.4 * pulse });
    /* 升腾的余烬 */
    for (var s = 0; s < 6; s++) {
      var u = cyc(p + hash(seed, s, 5));
      var ex = cx + (hash(seed, s, 6) - 0.5) * rw * 2.4;
      var ey = top + bowl * 0.4 - u * h * 0.20;
      M.particle(ctx, ex, ey, 1.9 * (1 - u * 0.5), M.pal[1], { alpha: 0.75 * (1 - u) });
    }
    /* 动法：**烟柱**从山口升起（熔岩族的标志性动法）。
       原来只有 6 颗小余烬在飘，变动像素 min 只有 0.0138 ——
       烟柱是大面积的连续变化，每一帧都在变。 */
    for (var q = 0; q < 5; q++) {
      var uq = cyc(p + hash(seed, q, 11));
      var qx = cx + (hash(seed, q, 12) - 0.5) * rw * 1.2 + Math.sin(p * TAU() + q) * 3;
      var qy = top - uq * h * 0.30;
      var qr = (3 + uq * 9) * (P.scale || 1);
      M.particle(ctx, qx, qy, qr, M.pal[2], { alpha: 0.34 * (1 - uq) * (1 - uq) });
    }
  };

  /* ==================================================================
     4 熔池纹：一滩缓慢流动的熔浆。外圈是冷却的暗壳，里头是热浆，
       表面有流动的亮纹，漂着冷却的壳岛。扁而宽的构图。
     ================================================================== */
  FORM.lavaPool = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 404;
    var cx = w * 0.5, cy = h * 0.58, rx = w * 0.44, ry = h * 0.32;
    var N = 30;
    function outline(c, wob, k) {
      c.beginPath();
      for (var i = 0; i <= N; i++) {
        var a = (i / N) * TAU();
        var rr = (1 + 0.10 * Math.sin(a * 3 + wob) + 0.05 * Math.sin(a * 5 - wob * 2)) * k;
        var x = cx + Math.cos(a) * rx * rr;
        var y = cy + Math.sin(a) * ry * rr * (1 + 0.06 * Math.sin(a * 2 - wob));
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.closePath();
    }
    /* 池边的冷却暗壳 */
    M.fill(ctx, function (c) { c.beginPath(); outline(c, p * TAU(), 1); }, M.pal[2],
      { alpha: 0.95, box: gbox(cx, cy, rx * 2.4, ry * 2.4) });
    /* 里面的热浆 */
    M.fill(ctx, function (c) { c.beginPath(); outline(c, p * TAU(), 0.80); }, M.pal[0],
      { alpha: 1, box: gbox(cx, cy, rx * 2.0, ry * 2.0) });
    /* 更热的几摊 */
    for (var i = 0; i < 4; i++) {
      var a = hash(seed, i, 1) * TAU() + p * TAU();
      var d = rx * (0.16 + 0.34 * hash(seed, i, 2));
      var bx = cx + Math.cos(a) * d * 0.95;
      var by = cy + Math.sin(a) * d * 0.55;
      var br = rx * (0.15 + 0.13 * hash(seed, i, 3));
      M.fill(ctx, function (c) { c.beginPath(); ellipse(c, bx, by, br, br * 0.60); }, M.pal[1],
        { alpha: 0.55, box: gbox(bx, by, br * 2.2, br * 1.4) });
    }
    /* 表面流动的亮纹 */
    for (var v = 0; v < 4; v++) {
      var off = (hash(seed, v, 4) - 0.5) * ry * 1.0;
      var dir = hash(seed, v, 5) > 0.5 ? 1 : -1;
      var ph = p * TAU() * dir;
      M.stroke(ctx, function (c) {
        c.beginPath();
        for (var i2 = 0; i2 <= 20; i2++) {
          var u = i2 / 20;
          var x = cx - rx * 0.78 + u * rx * 1.56;
          var y = cy + off + Math.sin(u * 5.5 + ph + v) * ry * 0.15;
          if (i2 === 0) c.moveTo(x, y); else c.lineTo(x, y);
        }
      }, M.pal[1], 1.7, { alpha: 0.45 });
    }
    /* 漂在表面的冷却壳岛 */
    for (var s = 0; s < 3; s++) {
      var sx = cx + (hash(seed, s, 6) - 0.5) * rx * 1.0 + Math.sin(p * TAU() + s) * 5;
      var sy = cy + (hash(seed, s, 7) - 0.5) * ry * 0.8;
      var sr = rx * (0.09 + 0.07 * hash(seed, s, 8));
      M.fill(ctx, function (c) { c.beginPath(); blobPath(c, sx, sy, sr, 7, seed + s * 13, 0.30, 0.68); },
        M.pal[2], { alpha: 0.94, box: gbox(sx, sy, sr * 2.4, sr * 1.6) });
      M.stroke(ctx, function (c) { c.beginPath(); blobPath(c, sx, sy, sr, 7, seed + s * 13, 0.30, 0.68); },
        M.pal[0], 1.1, { alpha: 0.3 });
    }
  };

  /* ==================================================================
     5 灰烬柱：一团向上翻卷的烟灰。小而蓬松的灰团一层层往上飘，
       越飘越大越淡，边缘散成灰屑。**不是实心柱子**。
     ================================================================== */
  FORM.ashPlume = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 505;
    var cx = w * 0.42, base = h * 0.99;

    /* 底部的余温 */
    M.fill(ctx, function (c) { c.beginPath(); ellipse(c, cx, base - 2, w * 0.15, h * 0.05); },
      M.pal[0], { alpha: 0.24, box: gbox(cx, base - 2, w * 0.3, h * 0.1) });
    /* 一大片稀薄的灰雾（体积感） */
    M.fill(ctx, function (c) { c.beginPath(); ellipse(c, cx + w * 0.08, h * 0.5, w * 0.30, h * 0.42); },
      M.pal[3], { alpha: 0.10, box: gbox(cx + w * 0.08, h * 0.5, w * 0.66, h * 0.9) });
    /* 翻卷的烟灰团：细碎、蓬松、越往上越大越淡 */
    for (var i = 0; i < 14; i++) {
      var u = cyc(p + i / 14);
      var y = base - 3 - u * (h * 0.99);
      var lean = u * u * w * 0.16;                       /* 越往上飘得越远 */
      var curl = Math.sin(u * 5.4 + i * 0.8) * w * 0.075 * (0.25 + u);
      var x = cx + lean + curl + (hash(seed, i, 1) - 0.5) * w * 0.07;
      var r = w * (0.030 + 0.072 * u) * (0.8 + 0.45 * hash(seed, i, 2));
      var a = Math.pow(Math.sin(Math.PI * u), 0.6) * 0.52;
      /* 影：先铺一团更暗的，灰团才有体积 */
      M.fill(ctx, function (c) { c.beginPath(); blobPath(c, x + r * 0.3, y + r * 0.25, r * 1.05, 9, seed + i * 17, 0.42, 0.86); },
        M.pal[4], { alpha: a * 0.75, box: gbox(x + r * 0.3, y + r * 0.25, r * 2.4, r * 2.1) });
      /* 亮面 */
      M.fill(ctx, function (c) { c.beginPath(); blobPath(c, x - r * 0.15, y - r * 0.2, r * 0.88, 9, seed + i * 17 + 3, 0.44, 0.86); },
        M.pal[3], { alpha: a, box: gbox(x - r * 0.15, y - r * 0.2, r * 2.1, r * 1.9) });
    }
    /* 翻卷的丝缕：几道扭上去的细烟 */
    for (var t = 0; t < 4; t++) {
      var wt = 2.4 + 1.8 * hash(seed, t, 7);
      M.stroke(ctx, function (c) {
        c.beginPath();
        for (var i3 = 0; i3 <= 14; i3++) {
          var u3 = i3 / 14;
          var wx = cx + u3 * u3 * w * 0.20 + Math.sin(u3 * 5.2 + t * 1.5) * w * 0.09
                   + (hash(seed, t, 8) - 0.5) * w * 0.08;
          var wy = base - 6 - u3 * h * (0.55 + 0.35 * hash(seed, t, 9));
          if (i3 === 0) c.moveTo(wx, wy); else c.lineTo(wx, wy);
        }
      }, M.pal[3], wt, { alpha: 0.3 });
    }
    /* 底部还在烧的碎屑 */
    for (var e = 0; e < 4; e++) {
      var ue = cyc(p + e / 4);
      M.particle(ctx, cx + (hash(seed, e, 3) - 0.5) * w * 0.16,
        base - 8 - ue * h * 0.22, 1.6 * (1 - ue * 0.6), M.pal[1], { alpha: 0.8 * (1 - ue) });
    }
    /* 飞散的灰屑 */
    for (var f = 0; f < 12; f++) {
      var u2 = cyc(p + hash(seed, f, 4));
      var fx = cx + (hash(seed, f, 5) - 0.5) * w * 0.6 + Math.sin(u2 * 5 + f) * 7;
      var fy = base - u2 * h * 1.0;
      M.particle(ctx, fx, fy, 1.0 + 1.3 * hash(seed, f, 6), M.pal[3], { alpha: 0.45 * (1 - u2) });
    }
  };

  /* ==================================================================
     6 熔金流：一条从左上往右下流淌的熔金带，末端积起一滩。
       带的边缘是波浪状的冷壳，金色高光沿着带滚过去。
     ================================================================== */
  FORM.moltenFlow = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 606;
    var x0 = w * 0.04, y0 = h * 0.06, x1 = w * 0.78, y1 = h * 0.58;
    var hw0 = h * 0.16;

    function ctr(u) {
      return [x0 + (x1 - x0) * u,
              y0 + (y1 - y0) * u
              + Math.sin(u * 3.4 + p * TAU()) * h * 0.07
              + Math.sin(u * 7.1 - p * TAU()) * h * 0.025];
    }
    function band(c, k) {
      c.beginPath();
      var N = 26, i;
      for (i = 0; i <= N; i++) {
        var u = i / N, pt = ctr(u), q = ctr(Math.min(1, u + 0.02));
        var tx = q[0] - pt[0], ty = q[1] - pt[1];
        var len = Math.sqrt(tx * tx + ty * ty) || 1;
        /* 半宽带波动 → 边缘是熔浆该有的起伏，不是直尺 */
        var hw = hw0 * (1 - 0.34 * u) * k * (1 + 0.16 * Math.sin(u * 9.3 + p * TAU() * 2));
        var x = pt[0] - (ty / len) * hw, y = pt[1] + (tx / len) * hw;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      for (i = N; i >= 0; i--) {
        var u2 = i / N, p2 = ctr(u2), q2 = ctr(Math.min(1, u2 + 0.02));
        var tx2 = q2[0] - p2[0], ty2 = q2[1] - p2[1];
        var len2 = Math.sqrt(tx2 * tx2 + ty2 * ty2) || 1;
        var hw2 = hw0 * (1 - 0.34 * u2) * k * (1 + 0.13 * Math.sin(u2 * 8.1 - p * TAU() * 2 + 1));
        c.lineTo(p2[0] + (ty2 / len2) * hw2, p2[1] - (tx2 / len2) * hw2);
      }
      c.closePath();
    }
    var mid = [(x0 + x1) / 2, (y0 + y1) / 2];
    /* 外缘冷壳 */
    M.fill(ctx, function (c) { c.beginPath(); band(c, 1.30); }, M.pal[2],
      { alpha: 0.95, box: gbox(mid[0], mid[1], w * 1.1, h * 1.0) });
    /* 熔金主体 */
    M.fill(ctx, function (c) { c.beginPath(); band(c, 1); }, M.pal[0],
      { alpha: 1, box: gbox(mid[0], mid[1], w * 1.1, h * 1.0) });
    /* 金芯 */
    M.fill(ctx, function (c) { c.beginPath(); band(c, 0.44); }, M.pal[1],
      { alpha: 0.95, box: gbox(mid[0], mid[1], w * 0.9, h * 0.8) });

    /* 末端积起的熔池 */
    var end = ctr(1);
    M.fill(ctx, function (c) { c.beginPath(); ellipse(c, end[0], end[1], w * 0.13, h * 0.11); },
      M.pal[0], { alpha: 0.95, box: gbox(end[0], end[1], w * 0.28, h * 0.24) });
    M.fill(ctx, function (c) { c.beginPath(); ellipse(c, end[0], end[1], w * 0.07, h * 0.055); },
      M.pal[1], { alpha: 0.95, box: gbox(end[0], end[1], w * 0.16, h * 0.13) });

    /* 沿带滚过的金色高光 */
    for (var s = 0; s < 6; s++) {
      var u = cyc(p + s / 6);
      var a = ctr(u), b = ctr(Math.min(1, u + 0.07));
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(a[0], a[1]);
        c.lineTo(b[0], b[1]);
      }, M.pal[1], 3.0, { alpha: 0.15 + 0.6 * Math.sin(Math.PI * u) });
    }
    /* 起点溅出的碎金 */
    for (var q = 0; q < 4; q++) {
      var u3 = cyc(p + q / 4 + hash(seed, q, 1) * 0.3);
      M.particle(ctx, x0 + (hash(seed, q, 2) - 0.5) * w * 0.12,
        y0 - u3 * h * 0.14, 1.6 * (1 - u3 * 0.5), M.pal[1], { alpha: 0.7 * (1 - u3) });
    }
  };

  /* ==================================================================
     7 火星飞溅：四处迸开的火星。一束束短促的亮痕从中心甩出去，
       甩到最远时淡掉，再从中心重新甩出。
     ================================================================== */
  FORM.emberSpray = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 707;
    var cx = w * 0.5, cy = h * 0.50;
    var maxR = Math.min(w, h) * 0.54;

    /* 爆心 */
    M.fill(ctx, function (c) { c.beginPath(); ellipse(c, cx, cy, w * 0.042, h * 0.046); },
      M.pal[1], { alpha: 0.95, box: gbox(cx, cy, w * 0.09, h * 0.1) });
    M.particle(ctx, cx, cy, w * 0.07, M.pal[0], { alpha: 0.5 });

    /* 四处迸开的火星 */
    for (var i = 0; i < 26; i++) {
      var a = hash(seed, i, 1) * TAU();
      var u = cyc(p + hash(seed, i, 2));
      var r = 5 + u * maxR;
      var len = 10 + 24 * (1 - u * 0.45);
      var fade = Math.sin(Math.PI * u);
      var x0 = cx + Math.cos(a) * Math.max(0, r - len);
      var y0 = cy + Math.sin(a) * Math.max(0, r - len);
      var x1 = cx + Math.cos(a) * r;
      var y1 = cy + Math.sin(a) * r;
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(x0, y0);
        c.lineTo(x1, y1);
      }, M.pal[0], 2.8, { alpha: 0.3 + 0.5 * fade });
      M.particle(ctx, x1, y1, 1.5 + 1.8 * fade, M.pal[1], { alpha: 0.85 * fade });
    }
    /* 扩散的热浪环 */
    var ru = cyc(p);
    var rr = 8 + ru * maxR * 1.15;
    M.stroke(ctx, function (c) { c.beginPath(); ellipse(c, cx, cy, rr, rr * (h / w)); },
      M.pal[0], 2.2, { alpha: 0.5 * (1 - ru) });
  };

  /* ==================================================================
     8 硬化壳：冷却结壳的碎片拼成的板面，板与板之间的缝里透着红。
       板是不规则的（近似 Voronoi 胞腔），几乎不动，只有热光在一块
       板一块板之间缓慢转移。
     ================================================================== */
  FORM.crustShell = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 808;
    var gx = 4, gy = 3;

    /* 一块壳片：格子的四角被随机推开 / 收拢 → 形状不规则，
       片与片错位叠着，缝里透着红。 */
    function plate(c, i, j) {
      var x0 = w * i / gx, x1 = w * (i + 1) / gx;
      var y0 = h * j / gy, y1 = h * (j + 1) / gy;
      var mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      var cw = x1 - x0, chh = y1 - y0;
      var k = [];
      var corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
      for (var n = 0; n < 4; n++) {
        var jx = (hash(seed, i * 11 + n, j + 3) - 0.5) * cw * 0.26;
        var jy = (hash(seed, i * 11 + n, j + 7) - 0.5) * chh * 0.26;
        var px = corners[n][0] + jx, py = corners[n][1] + jy;
        /* 往中心收一点，保证片与片之间留出缝 */
        var s1 = 0.03 + 0.11 * hash(seed, i * 5 + n, j + 1);
        var s2 = 0.03 + 0.11 * hash(seed, i * 5 + n, j + 2);
        k.push([mx + (px - mx) * (1 - s1), my + (py - my) * (1 - s2)]);
      }
      poly(c, k);
    }
    for (var j = 0; j < gy; j++) {
      for (var i = 0; i < gx; i++) {
        M.fill(ctx, function (c) { c.beginPath(); plate(c, i, j); }, M.pal[2],
          { alpha: 0.97, box: gbox(w * 0.5, h * 0.5, w * 5, h * 5) });
        /* 少数几片是被烤过的暖色壳 */
        if (hash(seed, i * 3 + j, 2) > 0.62) {
          M.fill(ctx, function (c) { c.beginPath(); plate(c, i, j); }, M.pal[3],
            { alpha: 0.16, box: gbox(w * 0.5, h * 0.5, w * 5, h * 5) });
        }
        /* 缝里的红光缓慢地在片与片之间转移 */
        var glow = 0.12 + 0.88 * bell(p + i * 0.14 + j * 0.09);
        M.stroke(ctx, function (c) { c.beginPath(); plate(c, i, j); }, M.pal[0], 1.3,
          { alpha: 0.10 + 0.50 * glow });
      }
    }
    /* 两道特别烫的主缝（顺着片的接缝走，不是一条直棍） */
    for (var s = 0; s < 2; s++) {
      var x = w * (0.26 + s * 0.42);
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(x, h * 0.10);
        c.lineTo(x + (hash(seed, s, 3) - 0.5) * w * 0.08, h * 0.46);
        c.lineTo(x + (hash(seed, s, 4) - 0.5) * w * 0.12, h * 0.78);
        c.lineTo(x + (hash(seed, s, 5) - 0.5) * w * 0.08, h * 0.94);
      }, M.pal[1], 1.2, { alpha: 0.18 + 0.45 * bell(p + s * 0.3) });
    }
  };

  /* ==================================================================
     9 铁砧：经典铁砧轮廓 —— 底座宽、中间有腰身、左侧出砧角，
       台面上留着锤痕，砧面还带着锻打后的余温。
     ================================================================== */
  FORM.anvil = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 909;
    var T = h * 0.30, TB = h * 0.45;
    var pts = [
      [w * 0.05, T + h * 0.035],      /* 砧角尖 */
      [w * 0.17, T],                  /* 台面前沿 */
      [w * 0.86, T],                  /* 台面后沿 */
      [w * 0.95, T + h * 0.03],       /* 砧尾 */
      [w * 0.95, TB],
      [w * 0.70, TB],                 /* 收进腰身 */
      [w * 0.63, h * 0.66],
      [w * 0.80, h * 0.76],           /* 撑开到底座 */
      [w * 0.87, h * 0.88],
      [w * 0.90, h * 0.96],
      [w * 0.12, h * 0.96],           /* 底座 */
      [w * 0.14, h * 0.88],
      [w * 0.22, h * 0.76],
      [w * 0.38, h * 0.66],           /* 腰身 */
      [w * 0.31, TB]
    ];
    /* 铁砧本体 */
    M.fill(ctx, function (c) { c.beginPath(); poly(c, pts); }, M.pal[2],
      { alpha: 1, box: gbox(w * 0.5, h * 0.6, w * 1.2, h * 0.9) });
    /* 台面（被锻打亮的一层） */
    M.fill(ctx, function (c) {
      poly(c, [[w * 0.17, T], [w * 0.86, T], [w * 0.83, T + h * 0.075], [w * 0.19, T + h * 0.075]]);
    }, M.pal[3], { alpha: 0.9, box: gbox(w * 0.5, T + h * 0.035, w * 0.9, h * 0.12) });
    /* 砧面的余温 */
    M.fill(ctx, function (c) {
      poly(c, [[w * 0.17, T], [w * 0.86, T], [w * 0.83, T + h * 0.075], [w * 0.19, T + h * 0.075]]);
    }, M.pal[0], { alpha: 0.26 + 0.14 * Math.sin(p * TAU()),
                   box: gbox(w * 0.5, T + h * 0.035, w * 0.9, h * 0.12) });
    /* 台面上沿的炽热边 */
    M.stroke(ctx, function (c) {
      poly(c, [[w * 0.05, T + h * 0.035], [w * 0.17, T], [w * 0.86, T], [w * 0.95, T + h * 0.03]], false);
    }, M.pal[0], 2.6, { alpha: 0.5 + 0.4 * Math.sin(p * TAU()) });
    M.stroke(ctx, function (c) {
      poly(c, [[w * 0.17, T], [w * 0.86, T]], false);
    }, M.pal[1], 1.4, { alpha: 0.35 + 0.45 * Math.sin(p * TAU() * 2) });
    /* 台面上的锤痕 */
    for (var i = 0; i < 5; i++) {
      var hx = w * (0.26 + i * 0.13);
      var hy = T + h * 0.038;
      var hr = 4.5 + 2.5 * hash(seed, i, 1);
      M.fill(ctx, function (c) { c.beginPath(); ellipse(c, hx, hy, hr, hr * 0.40); }, M.pal[2],
        { alpha: 0.9, box: gbox(hx, hy, hr * 2.6, hr * 1.2) });
      M.particle(ctx, hx + hr * 0.4, hy - hr * 0.2, 2.0,
        M.pal[1], { alpha: 0.35 + 0.45 * Math.sin(p * TAU() * 3 + i) });
    }
    /* 砧角上的火星 */
    for (var s = 0; s < 3; s++) {
      var u = cyc(p + s / 3);
      M.particle(ctx, w * 0.06 + u * w * 0.04, T + h * 0.03 - u * h * 0.16,
        1.6 * (1 - u * 0.5), M.pal[1], { alpha: 0.7 * (1 - u) });
    }
  };

  /* ==================================================================
     10 焦岩：几块烧焦的石头堆在一起，缝里还有火。
     ⚠️ 原来 5 块石头**横排一列**，盒子 460×64 → 渲出来是**横贯整屏的一排矮墩**，
     跟「一堆烧焦的石头」完全不像，也违背「可嵌入的小挂件」这个定位。
     现在改成 3 块**堆在一起**（2 底 1 上），盒子 150×130。
     每块石头有自己的底边 base —— 上层那块压在下面两块顶上。
     ================================================================== */
  FORM.charredRock = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1010;
    /* bx/bw/bh = 相对盒子宽/高；base = 底边相对盒高。
       ⚠️ 三块石头的高度差必须**拉开**（顶边分别在 0.52 / 0.44 / 0.22），
       否则轮廓线叠在一起，堆出来是一坨黑馒头，看不出是「几块石头」。 */
    var layout = [
      { bx: 0.00, bw: 0.50, bh: 0.46, base: 0.98 },
      { bx: 0.50, bw: 0.50, bh: 0.54, base: 0.98 },
      { bx: 0.30, bw: 0.44, bh: 0.30, base: 0.54 }
    ];
    var n = layout.length;

    /* 每块焦岩：圆钝的块石，轮廓参差 */
    var rocks = [];
    for (var i = 0; i < n; i++) {
      var L = layout[i];
      var bw = w * L.bw;
      var bx = w * L.bx + (hash(seed, i, 2) - 0.5) * w * 0.02;
      var bh = h * L.bh;
      var baseY = h * L.base;
      var pts = [];
      var k = 9;
      for (var t = 0; t < k; t++) {
        var ang = Math.PI + (t / (k - 1)) * Math.PI;   /* 上半圈 */
        var rr = 0.90 + 0.10 * hash(seed, i * 7 + t, 4);
        pts.push([bx + bw * 0.5 + Math.cos(ang) * bw * 0.5 * rr,
                  baseY + Math.sin(ang) * bh * rr]);
      }
      pts.push([bx + bw * 0.98, baseY]);
      pts.push([bx + bw * 0.02, baseY]);
      rocks.push({ pts: pts, bx: bx, bw: bw, bh: bh, baseY: baseY });
    }

    /* 岩石上方的热雾 */
    M.fill(ctx, function (c) { c.beginPath(); ellipse(c, w * 0.5, h * 0.26, w * 0.46, h * 0.18); },
      M.pal[0], { alpha: 0.05, box: gbox(w * 0.5, h * 0.26, w * 0.9, h * 0.5) });
    /* 焦岩本体 */
    for (var r = 0; r < n; r++) {
      M.fill(ctx, function (c) { c.beginPath(); poly(c, rocks[r].pts); }, M.pal[2],
        { alpha: 0.97, box: gbox(rocks[r].bx + rocks[r].bw * 0.5, rocks[r].baseY, w * 2.0, h * 1.2) });
    }
    /* 受光的断面：贴着石头的左上角 */
    for (var f = 0; f < n; f++) {
      var rp = rocks[f].pts;
      var rbY = rocks[f].baseY;
      M.fill(ctx, function (c) {
        poly(c, [rp[0], rp[1], rp[2], [rp[2][0] - (rp[2][0] - rp[0][0]) * 0.25, rbY], [rp[0][0], rbY]]);
      }, M.pal[3], { alpha: 0.16, box: gbox(rocks[f].bx + rocks[f].bw * 0.3, rbY - h * 0.3, w * 0.6, h * 0.7) });
    }
    /* 每块石头沿上弧勾一道**受热的暖边**。
       原来只有左上角一小片（alpha 0.16），三块深色石头叠在一起
       完全分不开 —— 堆出来是一坨黑山形，看不出是「几块石头」。
       勾边之后每块的轮廓才认得出来，暖边也符合「缝里还有火」的概念。 */
    for (var e2 = 0; e2 < n; e2++) {
      var eq = rocks[e2].pts;
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(eq[0][0], eq[0][1]);
        for (var q = 1; q < eq.length - 2; q++) { c.lineTo(eq[q][0], eq[q][1]); }
      }, M.pal[3], 1.8, { alpha: 0.34 });
    }

    /* 石头内部燃烧的裂缝：各烧各的，节奏不同 */
    for (var c2 = 0; c2 < 6; c2++) {
      var rk = rocks[c2 % n];
      var cy2 = rk.baseY;
      var cx = rk.bx + rk.bw * (0.25 + 0.5 * hash(seed, c2, 5));
      var ty = rk.bh * (0.45 + 0.4 * hash(seed, c2, 6));
      var fl = 0.5 + 0.5 * Math.sin(TAU() * (p * (1 + (c2 % 3)) + hash(seed, c2, 3)));
      M.stroke(ctx, function (cc) {
        cc.beginPath();
        cc.moveTo(cx, cy2);
        cc.lineTo(cx + (hash(seed, c2, 4) - 0.5) * w * 0.012, (ty + cy2) * 0.5);
        cc.lineTo(cx + (hash(seed, c2, 7) - 0.5) * w * 0.02, cy2 - ty);
      }, M.pal[0], 2.0, { alpha: 0.25 + 0.55 * fl });
      M.stroke(ctx, function (cc) {
        cc.beginPath();
        cc.moveTo(cx, cy2);
        cc.lineTo(cx + (hash(seed, c2, 4) - 0.5) * w * 0.012, (ty + cy2) * 0.5);
      }, M.pal[1], 1.1, { alpha: 0.2 + 0.6 * fl });
      M.particle(ctx, cx, cy2 - ty, 2.2, M.pal[1], { alpha: 0.3 + 0.5 * fl });
    }
    /* 上升的余烬 */
    for (var e = 0; e < 8; e++) {
      var u = cyc(p + hash(seed, e, 6));
      var ex = w * (0.05 + 0.9 * hash(seed, e, 7));
      var ey = h * 0.26 - u * h * 0.22;
      M.particle(ctx, ex + Math.sin(u * 4 + e) * 4, ey, 1.4 * (1 - u * 0.5),
        M.pal[1], { alpha: 0.6 * (1 - u) });
    }
  };
})(window.Sticker);
