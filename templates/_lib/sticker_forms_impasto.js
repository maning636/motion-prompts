/* 厚涂油画 · 10 个专属画法
   ------------------------------------------------------------------
   这一族的手感是**厚**，四件事做出来：
     · **不透明的实色块**（alpha ≈ 1），不要半透明糊
     · **边缘是刀刮出来的直棱**（硬边多边形 S.polyPath），不是圆滑轮廓
     · **高光是压在表面的一层短亮划**（沿主笔画方向的窄条），不是发光晕
     · **有厚度**：同一个色块往右下压一层暗面 → 看得见颜料堆起来的边
   厚涂**不用柔和渐变做主体** —— 渐变是花卉水彩族的东西。
   调色板 MAT.impasto：
     pal[0] 赭橙 / pal[1] 钴蓝 / pal[2] 米白 / pal[3] 橄榄褐 / pal[4] 深褐
   ------------------------------------------------------------------ */
(function (S) {
  var FORM = S.FORM;
  var hash = S.hash, TAU = S.TAU;
  var polyPath = S.polyPath, roundRect = S.roundRect;
  var lerp = S.lerp, clamp = S.clamp, tri = S.tri;

  /* ======================================================================
     本文件内部的小工具（只在这里用，不动共享引擎）
     ====================================================================== */

  /** 一次 fill 画好几个互不相连的子路径（每个子路径自带 closePath）。 */
  function multi(c, list) {
    for (var i = 0; i < list.length; i++) {
      var pts = list[i];
      c.moveTo(pts[0][0], pts[0][1]);
      for (var k = 1; k < pts.length; k++) c.lineTo(pts[k][0], pts[k][1]);
      c.closePath();
    }
  }

  /** 一段两头有粗细的笔迹：端点 a→b，两端半宽 wa / wb。 */
  function seg(a, b, wa, wb) {
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / len, ny = dx / len;
    return [
      [a[0] + nx * wa, a[1] + ny * wa],
      [b[0] + nx * wb, b[1] + ny * wb],
      [b[0] - nx * wb, b[1] - ny * wb],
      [a[0] - nx * wa, a[1] - ny * wa]
    ];
  }

  /** 压在表面的一道短亮划：沿 ang 方向、长 len、宽 w 的窄条。 */
  function shine(x, y, len, ang, w) {
    var hx = Math.cos(ang) * len * 0.5, hy = Math.sin(ang) * len * 0.5;
    var nx = -Math.sin(ang) * w * 0.5, ny = Math.cos(ang) * w * 0.5;
    return [
      [x - hx + nx, y - hy + ny],
      [x + hx + nx, y + hy + ny],
      [x + hx - nx, y + hy - ny],
      [x - hx - nx, y - hy - ny]
    ];
  }

  /** 沿一条直线生成带粗细变化的两条边（刀身 / 笔杆 / 笔锋都用它）。 */
  function ribbon(a, b, prof, n) {
    n = n || 10;
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / len, ny = dx / len;
    var top = [], bot = [], i, u, hw, x, y;
    for (i = 0; i <= n; i++) {
      u = i / n;
      hw = prof(u);
      x = a[0] + dx * u; y = a[1] + dy * u;
      top.push([x + nx * hw, y + ny * hw]);
      bot.push([x - nx * hw, y - ny * hw]);
    }
    var pts = top.slice();
    for (i = bot.length - 1; i >= 0; i--) pts.push(bot[i]);
    return pts;
  }

  /** 折线上取 u(0..1) 处的点与单位方向。 */
  function along(pts, u) {
    var total = 0, i, segs = [];
    for (i = 0; i < pts.length - 1; i++) {
      var dx = pts[i + 1][0] - pts[i][0], dy = pts[i + 1][1] - pts[i][1];
      var L = Math.sqrt(dx * dx + dy * dy);
      segs.push({ x: pts[i][0], y: pts[i][1], dx: dx, dy: dy, L: L });
      total += L;
    }
    var d = u * total;
    for (i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (d <= s.L || i === segs.length - 1) {
        var t = s.L ? d / s.L : 0;
        var L2 = s.L || 1;
        return [s.x + s.dx * t, s.y + s.dy * t, s.dx / L2, s.dy / L2];
      }
      d -= s.L;
    }
    var last = segs[segs.length - 1];
    return [last.x + last.dx, last.y + last.dy, last.dx / (last.L || 1), last.dy / (last.L || 1)];
  }

  /** 飞白笔迹：把折线拆成小段，按 hash 决定哪几段留白（干笔飞白）。 */
  function dry(pts, w0, w1, seed, tag, gap) {
    var total = 0, i;
    for (i = 0; i < pts.length - 1; i++) {
      total += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    }
    var n = clamp(Math.round(total / 8), 3, 16), out = [];
    for (i = 0; i < n; i++) {
      var u0 = i / n, u1 = (i + 1) / n;
      if (hash(seed, i, tag) < gap) continue;          // 这段留白 = 飞白
      var a = along(pts, u0), b = along(pts, u1);
      var wa = lerp(w0, w1, u0) * (0.82 + 0.36 * hash(seed, i, tag + 7));
      var wb = lerp(w0, w1, u1) * (0.82 + 0.36 * hash(seed, i, tag + 9));
      out.push({
        q: seg([a[0], a[1]], [b[0], b[1]], wa, wb),
        a: a, b: b, wa: wa, wb: wb
      });
    }
    return out;
  }

  /** 把干笔的每一段再拆出上层亮划（压在笔画表面的一层短亮条）。 */
  function dryShine(list, k) {
    var out = [], i;
    for (i = 0; i < list.length; i++) {
      var s = list[i];
      var nx = -s.b[3], ny = s.b[2];                  // 笔画的左法线
      var ox = -nx * s.wa * k, oy = -ny * s.wa * k;   // 往「上」侧偏
      out.push(seg([s.a[0] + ox, s.a[1] + oy], [s.b[0] + ox, s.b[1] + oy],
        s.wa * 0.26, s.wb * 0.26));
    }
    return out;
  }

  /** 整体右移 + 下移一点点的同形多边形 —— 用来垫出颜料的「厚度」。 */
  function thick(pts, dx, dy) {
    var out = [], i;
    for (i = 0; i < pts.length; i++) out.push([pts[i][0] + dx, pts[i][1] + dy]);
    return out;
  }

  /** Catmull-Rom 平滑：把几个控制点插值成一条顺滑的手写曲线。 */
  function smoothPath(p, per) {
    per = per || 6;
    var out = [], i, j;
    for (i = 0; i < p.length - 1; i++) {
      var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      for (j = 0; j < per; j++) {
        var t = j / per, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t +
            (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
            (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t +
            (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
            (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
        ]);
      }
    }
    out.push([p[p.length - 1][0], p[p.length - 1][1]]);
    return out;
  }

  /* ======================================================================
     v3 · 厚涂油画 · 10 个专属画法
     ----------------------------------------------------------------------
     v2 的毛病是「一小块扁平色块」：元素只占元素盒两成、边缘圆滑、没有厚度。
     这次每一条都重画：
       · 主体撑满元素盒（60%~90%）
       · 轮廓一律硬边多边形 / 圆角矩形，不用 blobPath 当主体
       · 底层一块 + 上面压一块，看得出叠压
       · 同一形状右下沉一层暗面 = 看得出厚
       · 表面沿主笔画方向压一道**短**亮划
       · 每条都在动，相位函数是连续周期函数（p=0 与 p=1 完全一致）
     ====================================================================== */

  /* 1 刮刀色块：一坨厚涂的颜料，边缘有刮痕 —— 280×120 */
  FORM.knifeBlob = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1301;
    var T = p * TAU();
    var cx = w * 0.50, cy = h * 0.48, i;

    /* 底层大块：刀刮出来的直棱多边形（横向铺开，撑满元素盒） */
    var base = [
      [-0.45, -0.10], [-0.34, -0.30], [-0.06, -0.39], [0.24, -0.33],
      [0.44, -0.12], [0.40, 0.16], [0.14, 0.33], [-0.18, 0.30], [-0.43, 0.12]
    ];
    var bp = [];
    for (i = 0; i < base.length; i++) {
      bp.push([
        cx + base[i][0] * w + (hash(seed, i, 1) - 0.5) * 8,
        cy + base[i][1] * h + (hash(seed, i, 2) - 0.5) * 6
      ]);
    }
    /* 厚：先在右下垫一层暗面，同形右移下沉 → 露出颜料堆起来的边 */
    M.fill(ctx, function (c) { polyPath(c, thick(bp, 5, 6)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, bp); c.closePath(); }, M.pal[0], { alpha: 1 });

    /* 上面压的一块：钴蓝，硬边，边缘看得出盖住底色（叠压） */
    ctx.save();
    ctx.translate(cx + w * 0.09, cy - h * 0.05);
    ctx.rotate(0.045 * Math.sin(T + 0.6));
    ctx.translate(-cx, -cy + h * 0.05);
    var top = [
      [cx + 0.01 * w, cy - 0.27 * h], [cx + 0.26 * w, cy - 0.33 * h],
      [cx + 0.41 * w, cy - 0.12 * h], [cx + 0.30 * w, cy + 0.08 * h],
      [cx + 0.03 * w, cy + 0.04 * h]
    ];
    M.fill(ctx, function (c) { polyPath(c, thick(top, 4, 5)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, top); c.closePath(); }, M.pal[1], { alpha: 1 });
    /* 压在蓝块表面的一道短亮划 */
    M.fill(ctx, function (c) {
      multi(c, [shine(cx + 0.14 * w, cy - 0.18 * h, w * 0.16, -0.30, 5)]);
    }, M.pal[2], { alpha: 0.60 });
    ctx.restore();

    /* 刮痕：几道**短**的刀路，薄薄地压在表面上，底下带一道暗影 */
    var ang = -0.26;
    var lights = [], darks = [];
    for (i = 0; i < 4; i++) {
      var yy = cy - h * 0.19 + i * h * 0.13;
      var x0 = cx - w * 0.34 + hash(seed, i, 3) * w * 0.16;
      var l = w * (0.07 + hash(seed, i, 4) * 0.05);
      var slide = 5 * Math.sin(T + i * 1.1);
      var a = [x0 + slide, yy], b = [x0 + l + slide, yy + l * Math.tan(ang)];
      lights.push(seg(a, b, 2.2, 0.7));
      darks.push(seg([a[0], a[1] + 2.6], [b[0], b[1] + 2.6], 1.5, 0.5));
    }
    M.fill(ctx, function (c) { multi(c, darks); }, M.pal[4], { alpha: 0.30 });
    M.fill(ctx, function (c) { multi(c, lights); }, M.pal[2], { alpha: 0.24 });

    /* 边上挤出来的一点点颜料（厚涂的证据） */
    M.fill(ctx, function (c) {
      multi(c, [
        seg([cx - 0.40 * w, cy + 0.18 * h], [cx - 0.44 * w, cy + 0.26 * h], 3.4, 2.0),
        seg([cx + 0.36 * w, cy + 0.12 * h], [cx + 0.41 * w, cy + 0.19 * h], 3.0, 1.8),
        seg([cx - 0.16 * w, cy + 0.28 * h], [cx - 0.13 * w, cy + 0.34 * h], 2.8, 1.6)
      ]);
    }, M.pal[0], { alpha: 1 });
  };

  /* 2 调色板：椭圆木调色板，颜料坑里颜色不同 —— 200×125 */
  FORM.paletteBoard = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1302;
    var T = p * TAU();
    var cx = w * 0.50, cy = h * 0.60;
    var rx = w * 0.45, ry = h * 0.35, i;

    function wood(k, jit) {
      var pts = [];
      for (var i2 = 0; i2 < 16; i2++) {
        var a = (i2 / 16) * TAU();
        var kk = k * (1 + (jit || 0) * (hash(seed, i2, 3) - 0.5));
        pts.push([cx + Math.cos(a) * rx * kk, cy + Math.sin(a) * ry * kk]);
      }
      return pts;
    }
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(0.030 * Math.sin(T + 0.8)); ctx.translate(-cx, -cy);

    /* 木盘：深色外沿 + 木色本体（一圈深边 = 厚度） */
    M.fill(ctx, function (c) { polyPath(c, wood(1.07, 0.05)); c.closePath(); }, M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, wood(1.00, 0.05)); c.closePath(); }, M.pal[0], { alpha: 1 });

    /* 木纹 */
    var grain = [];
    for (i = 0; i < 3; i++) {
      var gy = cy - ry * 0.62 + i * ry * 0.60;
      grain.push(seg([cx - rx * 0.66, gy], [cx + rx * 0.34, gy - 3 + i], 1.1, 0.8));
    }
    M.fill(ctx, function (c) { multi(c, grain); }, M.pal[4], { alpha: 0.24 });

    /* 颜料坑：五个，颜色各不相同，坑里是一坨一坨的颜料 */
    var wells = [M.pal[1], M.pal[2], M.pal[3], M.pal[1], M.pal[2]];
    for (i = 0; i < 5; i++) {
      var a2 = (-78 + i * 39) * Math.PI / 180;
      var wx = cx + Math.cos(a2) * rx * 0.56;
      var wy = cy + Math.sin(a2) * ry * 0.58;
      var ww = w * 0.068, wh = h * 0.082;
      var pl = 0.88 + 0.12 * Math.sin(T * 2 + i * 0.8 + 0.4);
      M.fill(ctx, function (c) {
        c.beginPath(); c.ellipse(wx, wy, ww * 1.14, wh * 1.14, 0, 0, TAU());
      }, M.pal[4], { alpha: 0.9 });
      var blob = [];
      for (var k = 0; k < 9; k++) {
        var ang = (k / 9) * TAU() + 0.4;
        var rr = 0.80 + 0.28 * hash(seed, k, i + 4);
        blob.push([wx + Math.cos(ang) * ww * rr * pl, wy + Math.sin(ang) * wh * rr * pl]);
      }
      M.fill(ctx, function (c) { polyPath(c, blob); c.closePath(); }, wells[i], { alpha: 1 });
      M.fill(ctx, function (c) {
        multi(c, [shine(wx - ww * 0.16, wy - wh * 0.40, ww * 0.95, -0.30, 3.2)]);
      }, M.pal[2], { alpha: 0.55 });
    }

    /* 拇指孔 */
    M.fill(ctx, function (c) {
      c.beginPath(); c.ellipse(cx - rx * 0.60, cy + ry * 0.10, w * 0.048, h * 0.058, 0, 0, TAU());
    }, M.pal[4], { alpha: 0.92 });

    /* 搁在盘上的一支画笔：深色木杆 + 浅色金属箍 + 沾了蓝颜料的笔锋 */
    var slide = 4 * Math.sin(T + 1.3);
    var ba = [w * 0.05 + slide, h * 0.30], bb = [w * 0.70 + slide, h * 0.08];
    var bp = ribbon(ba, bb, function (u) { return h * (0.046 - 0.012 * u); }, 6);
    M.fill(ctx, function (c) { polyPath(c, bp); c.closePath(); }, M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) {
      multi(c, [shine(ba[0] + (bb[0] - ba[0]) * 0.45, ba[1] + (bb[1] - ba[1]) * 0.45 - h * 0.022,
        w * 0.34, -0.185, 2.6)]);
    }, M.pal[2], { alpha: 0.50 });
    /* 金属箍 */
    var fa = [bb[0] - w * 0.055, bb[1] + h * 0.011];
    var fb = [bb[0] + w * 0.045, bb[1] - h * 0.009];
    var fp = ribbon(fa, fb, function () { return h * 0.052; }, 3);
    M.fill(ctx, function (c) { polyPath(c, fp); c.closePath(); }, M.pal[2], { alpha: 1 });
    /* 笔锋上的一点蓝颜料 */
    var tip = [fb[0] + w * 0.045, fb[1] - h * 0.012];
    var tb = [];
    for (i = 0; i < 8; i++) {
      var ta = (i / 8) * TAU() + 0.5;
      var trr = 0.78 + 0.30 * hash(seed, i, 7);
      tb.push([tip[0] + Math.cos(ta) * w * 0.045 * trr, tip[1] + Math.sin(ta) * h * 0.058 * trr]);
    }
    M.fill(ctx, function (c) { polyPath(c, tb); c.closePath(); }, M.pal[1], { alpha: 1 });
    M.fill(ctx, function (c) {
      multi(c, [shine(tip[0] - w * 0.010, tip[1] - h * 0.030, w * 0.05, -0.25, 2.8)]);
    }, M.pal[2], { alpha: 0.55 });
    ctx.restore();
  };

  /* 3 油管挤色：一支被挤扁的颜料管，末端挤出一坨 —— 190×120 */
  FORM.paintTube = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1303;
    var T = p * TAU();
    var cy = h * 0.50, i;

    /* 管身：折口厚、中间鼓、到管口收细 —— 硬边折线 */
    var prof = [[0.15, 0.375], [0.28, 0.235], [0.45, 0.205], [0.66, 0.355]];
    var top = [], bot = [];
    for (i = 0; i < prof.length; i++) {
      top.push([w * prof[i][0], h * prof[i][1]]);
      bot.push([w * prof[i][0], h * (1 - prof[i][1])]);
    }
    var body = top.slice();
    for (i = bot.length - 1; i >= 0; i--) body.push(bot[i]);
    M.fill(ctx, function (c) { polyPath(c, body); c.closePath(); }, M.pal[2], { alpha: 1 });

    /* 管身下缘的暗边（管子是圆的，底下有影） */
    var under = [];
    for (i = 0; i < bot.length - 1; i++) under.push(seg(bot[i], bot[i + 1], 3.0, 3.0));
    M.fill(ctx, function (c) { multi(c, under); }, M.pal[4], { alpha: 0.26 });

    /* 中间那道色带（CADMIUM 就印在这上面） */
    var band = [
      [w * 0.30, h * 0.240], [w * 0.60, h * 0.318],
      [w * 0.60, h * 0.682], [w * 0.30, h * 0.760]
    ];
    M.fill(ctx, function (c) { polyPath(c, band); c.closePath(); }, M.pal[0], { alpha: 1 });
    M.fill(ctx, function (c) {
      multi(c, [shine(w * 0.44, h * 0.272, w * 0.22, 0.175, 3.6)]);
    }, M.pal[2], { alpha: 0.45 });

    /* 管身字 */
    ctx.save();
    ctx.translate(w * 0.45, cy);
    ctx.rotate(0.175);
    M.text(ctx, P.label || 'CADMIUM', 0, 0, P.size || 11, M.pal[2],
      { align: 'center', baseline: 'middle' });
    ctx.restore();

    /* 折口（尾部压扁的金属封口，带几道折痕） */
    var crimp = [
      [w * 0.030, h * 0.400], [w * 0.072, h * 0.418], [w * 0.104, h * 0.386],
      [w * 0.136, h * 0.414], [w * 0.162, h * 0.386], [w * 0.162, h * 0.614],
      [w * 0.136, h * 0.586], [w * 0.104, h * 0.614], [w * 0.072, h * 0.582],
      [w * 0.030, h * 0.600]
    ];
    M.fill(ctx, function (c) { polyPath(c, crimp); c.closePath(); }, M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) {
      multi(c, [shine(w * 0.088, h * 0.430, w * 0.10, -0.10, 2.8)]);
    }, M.pal[2], { alpha: 0.45 });

    /* 管口 */
    M.fill(ctx, function (c) {
      polyPath(c, [
        [w * 0.650, h * 0.360], [w * 0.748, h * 0.440],
        [w * 0.748, h * 0.560], [w * 0.650, h * 0.640]
      ]);
      c.closePath();
    }, M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) {
      multi(c, [shine(w * 0.700, h * 0.462, w * 0.062, 0.32, 2.8)]);
    }, M.pal[2], { alpha: 0.45 });

    /* 末端挤出来的一坨：越挤越大 */
    var sq = 0.5 + 0.5 * Math.sin(T + 0.9);
    var bx = w * 0.868, by = h * 0.50;
    var br = h * (0.135 + 0.060 * sq);
    var blob = [];
    for (i = 0; i < 9; i++) {
      var ang = (i / 9) * TAU() + 0.25;
      var rr = 0.80 + 0.30 * hash(seed, i, 5);
      blob.push([bx + Math.cos(ang) * br * rr * 0.90, by + Math.sin(ang) * br * rr]);
    }
    /* 从管口到这坨之间的一条细料 */
    M.fill(ctx, function (c) {
      multi(c, [seg([w * 0.748, h * 0.500], [bx - br * 0.55, by], 3.4, 6.0)]);
    }, M.pal[0], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, thick(blob, 3, 4)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, blob); c.closePath(); }, M.pal[0], { alpha: 1 });
    M.fill(ctx, function (c) {
      multi(c, [shine(bx - br * 0.20, by - br * 0.52, br * 0.95, -0.22, 4.0)]);
    }, M.pal[2], { alpha: 0.60 });
    M.fill(ctx, function (c) {
      multi(c, [seg([bx - br * 0.72, by + br * 0.48], [bx + br * 0.70, by + br * 0.42], 2.6, 1.6)]);
    }, M.pal[4], { alpha: 0.30 });
  };

  /* 4 画布经纬：一格一格的布纹，格子里透着颜色 —— 210×110 */
  FORM.canvasWeave = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1304;
    var T = p * TAU();
    var i, j;

    /* 底：上好底料的生麻布（整块铺满） */
    M.fill(ctx, function (c) { c.beginPath(); c.rect(0, 0, w, h); }, M.pal[2], { alpha: 1 });

    /* 格子里的颜色：颜料透过布面渗出来（很淡，纱线还看得见） */
    var cols = 9, rows = 5, cwid = w / cols, chei = h / rows;
    var wash = [M.pal[0], M.pal[1], M.pal[3]];
    for (j = 0; j < rows; j++) {
      for (i = 0; i < cols; i++) {
        var hv = hash(seed, i, j);
        if (hv < 0.45) continue;                 /* 多数格子是没上色的生布 */
        var al = 0.10 + 0.20 * hash(seed, i, j + 7);
        M.fill(ctx, function (c) {
          c.beginPath(); c.rect(i * cwid, j * chei, cwid, chei);
        }, wash[Math.floor(hash(seed, i, j + 3) * 3) % 3], { alpha: al });
      }
    }

    /* 上面压的两坨厚涂（不透光，厚） */
    var daubs = [
      { x: 0.20, y: 0.32, rx: 0.20, ry: 0.30, c: M.pal[0], s: 11 },
      { x: 0.66, y: 0.74, rx: 0.26, ry: 0.26, c: M.pal[1], s: 23 },
      { x: 0.80, y: 0.24, rx: 0.15, ry: 0.22, c: M.pal[3], s: 37 }
    ];
    for (i = 0; i < daubs.length; i++) {
      var db = daubs[i];
      var pts = [], k;
      for (k = 0; k < 11; k++) {
        var ang = (k / 11) * TAU() + i * 0.4;
        var rr = 0.66 + 0.52 * hash(seed, k, db.s);
        pts.push([w * db.x + Math.cos(ang) * w * db.rx * rr,
          h * db.y + Math.sin(ang) * h * db.ry * rr]);
      }
      var dx = 4 * Math.sin(T + i * 1.7), dy = 3 * Math.cos(T + i * 1.1);
      var moved = [];
      for (k = 0; k < pts.length; k++) moved.push([pts[k][0] + dx, pts[k][1] + dy]);
      /* 厚：底下垫一层暗面 */
      M.fill(ctx, function (c) { polyPath(c, thick(moved, 3, 4)); c.closePath(); },
        M.pal[4], { alpha: 1 });
      M.fill(ctx, function (c) { polyPath(c, moved); c.closePath(); }, db.c, { alpha: 1 });
      /* 厚涂表面压一道短亮划 */
      M.fill(ctx, function (c) {
        multi(c, [shine(w * db.x + dx - w * db.rx * 0.2, h * db.y + dy - h * db.ry * 0.42,
          w * db.rx * 0.9, -0.22, 3.6)]);
      }, M.pal[2], { alpha: 0.45 });
    }

    /* 经纬：细密的纱线，竖线 + 横线，一侧深一侧亮（线是圆的） */
    var dark = [], light = [];
    for (i = 1; i < 14; i++) {
      var vx = w * i / 14;
      dark.push(seg([vx, 0], [vx, h], 0.7, 0.7));
      light.push(seg([vx + 0.9, 0], [vx + 0.9, h], 0.5, 0.5));
    }
    for (j = 1; j < 9; j++) {
      var hy = h * j / 9;
      dark.push(seg([0, hy], [w, hy], 0.7, 0.7));
      light.push(seg([0, hy + 0.9], [w, hy + 0.9], 0.5, 0.5));
    }
    M.fill(ctx, function (c) { multi(c, dark); }, M.pal[4], { alpha: 0.18 });
    M.fill(ctx, function (c) { multi(c, light); }, M.pal[2], { alpha: 0.35 });

    /* 交点上横压竖（织物的上下关系） */
    var over = [];
    for (j = 0; j < 8; j++) {
      for (i = 0; i < 13; i++) {
        if ((i + j) % 2) over.push(seg([w * (i + 1) / 14 - 0.9, h * (j + 1) / 9],
          [w * (i + 1) / 14 + 0.9, h * (j + 1) / 9], 1.0, 1.0));
      }
    }
    M.fill(ctx, function (c) { multi(c, over); }, M.pal[2], { alpha: 0.75 });

    /* 一道沿着横线跑的光（布面的反光在动，两端淡出 → 循环无缝） */
    var rx = w * (-0.12 + p * 1.24);
    M.fill(ctx, function (c) {
      multi(c, [seg([rx - 20, h * 4 / 9 - 0.6], [rx + 20, h * 4 / 9 - 0.6], 1.8, 1.8)]);
    }, M.pal[2], { alpha: 0.55 * Math.sin(p * Math.PI) });
  };

  /* 5 笔触签名：一甩而成的签名笔画，飞白很多 —— 200×120 */
  FORM.brushSignature = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1305;
    var T = p * TAU();
    var i, k;

    /* 手写签名：A 的大写 + 一串连笔 + 一甩而出的花体尾 */
    function X(x) { return w * x; }
    function Y(y) { return h * y; }
    var strokes = [
      /* A 的两条腿 */
      { pts: [[X(0.085), Y(0.66)], [X(0.170), Y(0.155)]], w: 7.2, tag: 1 },
      { pts: [[X(0.170), Y(0.155)], [X(0.262), Y(0.64)]], w: 6.4, tag: 2 },
      /* A 的横 */
      { pts: [[X(0.118), Y(0.46)], [X(0.232), Y(0.415)]], w: 4.8, tag: 3 },
      /* 连笔的 L I N：一条顺滑的手写曲线 */
      { pts: smoothPath([[X(0.300), Y(0.60)], [X(0.292), Y(0.30)], [X(0.320), Y(0.20)],
        [X(0.350), Y(0.34)], [X(0.356), Y(0.54)], [X(0.382), Y(0.26)],
        [X(0.412), Y(0.46)], [X(0.432), Y(0.24)], [X(0.462), Y(0.44)],
        [X(0.496), Y(0.24)], [X(0.524), Y(0.46)], [X(0.540), Y(0.30)]], 5),
        w: 5.4, tag: 4 },
      /* 一甩而出的花体尾巴 */
      { pts: smoothPath([[X(0.540), Y(0.30)], [X(0.640), Y(0.22)], [X(0.760), Y(0.15)],
        [X(0.880), Y(0.14)], [X(0.950), Y(0.22)], [X(0.958), Y(0.30)]], 5),
        w: 4.8, tag: 5 },
      /* 落款的下划线 */
      { pts: smoothPath([[X(0.070), Y(0.775)], [X(0.330), Y(0.845)], [X(0.560), Y(0.775)]], 5),
        w: 4.2, tag: 6 }
    ];

    var ink = M.pal[1];
    for (i = 0; i < strokes.length; i++) {
      var s = strokes[i];
      /* 手抖：每一笔的落笔位置在微微地动 */
      var wob = 1.3 * Math.sin(T + i * 0.9);
      var pts = [];
      for (k = 0; k < s.pts.length; k++) pts.push([s.pts[k][0], s.pts[k][1] + wob]);
      var pieces = dry(pts, s.w, s.w * 0.66, seed, s.tag, 0.16);
      var quads = [];
      for (k = 0; k < pieces.length; k++) quads.push(pieces[k].q);
      M.fill(ctx, function (c) { multi(c, quads); }, ink, { alpha: 1 });
      /* 笔画表面压一道短亮划（粗笔画才有） */
      if (s.w > 4.4) {
        M.fill(ctx, function (c) { multi(c, dryShine(pieces, 0.40)); }, M.pal[2], { alpha: 0.36 });
      }
    }

    /* 甩出去的三个墨点（越甩越远再回来） */
    for (i = 0; i < 3; i++) {
      var ph = (p + i * 0.31) % 1;
      var d = 0.03 + 0.09 * tri(ph);
      M.particle(ctx,
        w * (0.945 + Math.cos(i * 2.1) * d * 0.55),
        h * (0.150 + Math.sin(i * 2.1) * d * 0.55 - d * 0.35),
        1.8 + 1.8 * tri(ph), ink, { alpha: 0.92 });
    }
  };

  /* 6 调色刀：一把斜着的调色刀，刃上带颜料 —— 190×120 */
  FORM.paletteKnife = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1306;
    var T = p * TAU();
    var i;

    var a = [w * 0.045, h * 0.90];   /* 刀柄尾 */
    var b = [w * 0.960, h * 0.115];   /* 刀尖 */
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var len = Math.sqrt(dx * dx + dy * dy);
    var ux = dx / len, uy = dy / len;
    function at(u) { return [a[0] + dx * u, a[1] + dy * u]; }
    function nx(u) { return [-uy, ux]; }

    /* 木柄：底下垫一层暗面 = 厚度 */
    var handle = ribbon(at(0.0), at(0.225), function (u) {
      return h * (0.078 - 0.014 * u);
    }, 6);
    M.fill(ctx, function (c) { polyPath(c, thick(handle, 3, 4)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, handle); c.closePath(); }, M.pal[0], { alpha: 1 });
    /* 柄上的木纹 + 一道亮划 */
    var gg = [];
    for (i = 0; i < 2; i++) {
      var u0 = 0.05 + i * 0.09, u1 = u0 + 0.08;
      var p0 = at(u0), p1 = at(u1), n0 = nx(u0), n1 = nx(u1);
      gg.push(seg([p0[0] - n0[0] * 3, p0[1] - n0[1] * 3],
        [p1[0] - n1[0] * 3, p1[1] - n1[1] * 3], 1.0, 1.0));
    }
    M.fill(ctx, function (c) { multi(c, gg); }, M.pal[4], { alpha: 0.38 });
    M.fill(ctx, function (c) {
      var s0 = at(0.10), sn = nx(0.10);
      multi(c, [seg([s0[0] - sn[0] * 6, s0[1] - sn[1] * 6],
        [s0[0] + dx * 0.10 - sn[0] * 6, s0[1] + dy * 0.10 - sn[1] * 6], 1.8, 1.8)]);
    }, M.pal[2], { alpha: 0.45 });

    /* 金属箍 */
    var fer = ribbon(at(0.225), at(0.300), function () { return h * 0.090; }, 3);
    M.fill(ctx, function (c) { polyPath(c, fer); c.closePath(); }, M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) {
      var s1 = at(0.240), sn1 = nx(0.240);
      multi(c, [seg([s1[0] - sn1[0] * 5, s1[1] - sn1[1] * 5],
        [s1[0] + dx * 0.048 - sn1[0] * 5, s1[1] + dy * 0.048 - sn1[1] * 5], 2.0, 2.0)]);
    }, M.pal[2], { alpha: 0.55 });

    /* 刀身：硬边，中间宽、到尖收细（调色刀的刃是钝圆的） */
    var blade = ribbon(at(0.300), at(1.0), function (u) {
      if (u < 0.45) return h * (0.088 + 0.032 * (u / 0.45));
      if (u < 0.80) return h * (0.120 - 0.018 * ((u - 0.45) / 0.35));
      return h * (0.102 - 0.044 * ((u - 0.80) / 0.20));
    }, 14);
    M.fill(ctx, function (c) { polyPath(c, thick(blade, 3, 4)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, blade); c.closePath(); }, M.pal[2], { alpha: 1 });
    /* 刀身的冷影（贴着下缘） */
    var shade = ribbon(at(0.33), at(0.94), function (u) {
      return h * (0.062 - 0.026 * u);
    }, 8);
    M.fill(ctx, function (c) { polyPath(c, shade); c.closePath(); },
      S.hslA(M.pal[1], 0.45), { alpha: 1 });
    /* 刃上带的一坨厚颜料：骑在刃口上，会鼓 */
    var bead = ribbon(at(0.40), at(0.90), function (u) {
      return h * (0.046 + 0.018 * Math.sin(u * 5.2 + T + 0.4));
    }, 12);
    M.fill(ctx, function (c) { polyPath(c, thick(bead, 3, 4)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, bead); c.closePath(); }, M.pal[1], { alpha: 1 });
    /* 颜料表面的一道短亮划 */
    var sp = [];
    for (i = 0; i < 4; i++) {
      var u2 = 0.47 + i * 0.12;
      var q0 = at(u2), n2 = nx(u2);
      sp.push(seg([q0[0] - n2[0] * 5, q0[1] - n2[1] * 5],
        [q0[0] + dx * 0.09 - n2[0] * 5, q0[1] + dy * 0.09 - n2[1] * 5], 1.6, 1.6));
    }
    M.fill(ctx, function (c) { multi(c, sp); }, M.pal[2], { alpha: 0.55 });
    /* 刃尖挤出来的一点 */
    var tip = at(0.95);
    M.particle(ctx, tip[0], tip[1], h * 0.030, M.pal[1], { alpha: 1 });
  };

  /* 7 颜料飞溅：大小不一的颜料点四处飞 —— 200×120 */
  FORM.paintSplatter = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1307;
    var T = p * TAU();
    var cx = w * 0.46, cy = h * 0.50, i, k;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(0.05 * Math.sin(T + 0.4));
    ctx.translate(-cx, -cy);

    /* 甩出去的几道长条（粗→尖） */
    var streaks = [];
    for (i = 0; i < 8; i++) {
      var a = (i / 8) * TAU() + hash(seed, i, 1) * 0.5;
      var l = Math.min(w, h) * (0.24 + hash(seed, i, 2) * 0.30);
      var ph = (p + hash(seed, i, 3)) % 1;
      l *= 0.72 + 0.28 * tri(ph);
      var wdt = 3.4 + hash(seed, i, 4) * 4.4;
      streaks.push(seg([cx, cy],
        [cx + Math.cos(a) * l, cy + Math.sin(a) * l * 0.85], wdt, 0.8));
    }
    M.fill(ctx, function (c) { multi(c, streaks); }, M.pal[0], { alpha: 1 });

    /* 中间一大坨（硬边，厚） */
    var mass = [];
    for (k = 0; k < 13; k++) {
      var am = (k / 13) * TAU() + 0.2;
      var rr = 0.60 + 0.58 * hash(seed, k, 5);
      mass.push([cx + Math.cos(am) * Math.min(w, h) * 0.21 * rr,
        cy + Math.sin(am) * Math.min(w, h) * 0.20 * rr]);
    }
    M.fill(ctx, function (c) { polyPath(c, thick(mass, 3, 4)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, mass); c.closePath(); }, M.pal[0], { alpha: 1 });

    /* 上面压的一坨蓝（叠压） */
    var mass2 = [];
    for (k = 0; k < 11; k++) {
      var a2 = (k / 11) * TAU() + 0.9;
      var r2 = 0.66 + 0.50 * hash(seed, k, 6);
      mass2.push([cx + w * 0.10 + Math.cos(a2) * Math.min(w, h) * 0.135 * r2,
        cy - h * 0.11 + Math.sin(a2) * Math.min(w, h) * 0.125 * r2]);
    }
    M.fill(ctx, function (c) { polyPath(c, thick(mass2, 3, 3)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, mass2); c.closePath(); }, M.pal[1], { alpha: 1 });
    M.fill(ctx, function (c) {
      multi(c, [shine(cx + w * 0.07, cy - h * 0.16, Math.min(w, h) * 0.15, -0.30, 4.2)]);
    }, M.pal[2], { alpha: 0.55 });

    /* 四散的颜料点：大小不一，有的带小尾巴 */
    for (i = 0; i < 28; i++) {
      var aa = hash(seed, i, 7) * TAU();
      var ph2 = (p + hash(seed, i, 8)) % 1;
      var rad = Math.min(w, h) * (0.20 + hash(seed, i, 9) * 0.48);
      rad *= 0.80 + 0.20 * tri(ph2);
      var px = cx + Math.cos(aa) * rad * 1.30;
      var py = cy + Math.sin(aa) * rad * 0.92;
      var rr2 = 1.5 + hash(seed, i, 10) * 4.6;
      M.particle(ctx, px, py, rr2, i % 3 === 0 ? M.pal[1] : M.pal[0], { alpha: 1 });
      if (hash(seed, i, 11) > 0.70) {
        M.fill(ctx, function (c) {
          multi(c, [seg([px, py],
            [px - Math.cos(aa) * rr2 * 3.6, py - Math.sin(aa) * rr2 * 3.2], rr2 * 0.85, 0.4)]);
        }, M.pal[0], { alpha: 0.95 });
      }
    }
    ctx.restore();
  };

  /* 8 画框角：一个画框的角，钉子还挂着布 —— 190×120 */
  FORM.galleryCorner = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1308;
    var T = p * TAU();
    var t = Math.min(w, h) * 0.21;   /* 框的料宽 */
    var armX = w * 0.70, armY = h * 0.84;
    var i;

    /* 画布：框里面的那块布 */
    M.fill(ctx, function (c) {
      c.beginPath(); c.rect(t * 0.55, t * 0.55, w - t * 0.55, h - t * 0.55);
    }, M.pal[2], { alpha: 1 });

    /* 画布上的三笔厚涂 */
    var bl = [
      [[0.30, 0.34], [0.52, 0.28], [0.70, 0.44]],
      [[0.42, 0.80], [0.66, 0.66], [0.88, 0.78]],
      [[0.76, 0.20], [0.88, 0.40], [0.92, 0.60]]
    ];
    var bc = [M.pal[0], M.pal[1], M.pal[3]];
    for (i = 0; i < bl.length; i++) {
      var pts = bl[i], poly = [], k;
      for (k = 0; k < pts.length; k++) poly.push([w * pts[k][0], h * pts[k][1] - h * 0.075]);
      for (k = pts.length - 1; k >= 0; k--) poly.push([w * pts[k][0], h * pts[k][1] + h * 0.075]);
      M.fill(ctx, function (c) { polyPath(c, poly); c.closePath(); }, bc[i], { alpha: 1 });
      M.fill(ctx, function (c) {
        multi(c, [shine(w * pts[1][0], h * pts[1][1] - h * 0.048, w * 0.16, -0.10, 3.2)]);
      }, M.pal[2], { alpha: 0.45 });
    }

    /* 画框：L 形的料（斜接），深色木框 + 受光的一条亮面 + 内沿暗影 */
    M.fill(ctx, function (c) {
      polyPath(c, [
        [0, 0], [armX, 0], [armX - t, t], [t, t], [t, armY], [0, armY]
      ]);
      c.closePath();
    }, M.pal[4], { alpha: 1 });
    /* 受光的斜面（贴着外边的一条亮带） */
    M.fill(ctx, function (c) {
      polyPath(c, [
        [0, 0], [armX - t * 0.30, 0], [armX - t, t * 0.70], [t * 0.70, t * 0.70],
        [t * 0.70, armY - t * 0.30], [0, armY]
      ]);
      c.closePath();
    }, M.pal[2], { alpha: 1 });
    /* 框内沿的暗影 */
    M.fill(ctx, function (c) {
      multi(c, [
        seg([t * 0.72, t * 0.98], [w - 2, t * 0.98], 2.6, 2.6),
        seg([t * 0.98, t * 0.72], [t * 0.98, h - 2], 2.6, 2.6)
      ]);
    }, M.pal[4], { alpha: 0.40 });
    /* 斜接缝 */
    M.fill(ctx, function (c) {
      multi(c, [seg([t * 0.34, t * 1.02], [t * 1.02, t * 0.34], 1.8, 1.8)]);
    }, M.pal[4], { alpha: 0.45 });

    /* 钉子 + 搭在框上的那一角布（慢慢掀起来又落下） */
    var lift = 0.5 + 0.5 * Math.sin(T + 0.5);
    var nx = t * 0.50, ny = t * 0.50;
    ctx.save();
    ctx.translate(nx, ny);
    ctx.rotate(-0.10 - 0.17 * lift);
    M.fill(ctx, function (c) {
      polyPath(c, [[0, 0], [t * 1.00, -t * 0.34], [t * 0.58, t * 0.84], [t * 0.10, t * 0.46]]);
      c.closePath();
    }, M.pal[2], { alpha: 1 });
    M.fill(ctx, function (c) {
      multi(c, [seg([t * 0.16, t * 0.12], [t * 0.66, -t * 0.12], 1.8, 1.8)]);
    }, M.pal[4], { alpha: 0.30 });
    ctx.restore();
    /* 钉子 */
    M.fill(ctx, function (c) { c.beginPath(); c.arc(nx, ny, w * 0.018, 0, TAU()); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) {
      c.beginPath(); c.arc(nx - w * 0.005, ny - w * 0.005, w * 0.0065, 0, TAU());
    }, M.pal[2], { alpha: 0.55 + 0.45 * lift });
  };

  /* 9 颜料流挂：一道颜料从上面淌下来，末端积成滴 —— 96×150 */
  FORM.paintDrip = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1309;
    var T = p * TAU();
    var i;

    /* 中线在左右晃（颜料在慢慢淌） */
    function wave(y) { return w * 0.44 + Math.sin(T * 2 - y * 0.045 + 0.4) * w * 0.055; }

    /* 顶端那一摊（颜料在板边上堆着，底边是波浪状的） */
    var pool = [
      [w * 0.20, 0], [w * 0.80, 0], [w * 0.84, h * 0.030],
      [w * 0.64, h * 0.068], [w * 0.48, h * 0.054], [w * 0.34, h * 0.072],
      [w * 0.17, h * 0.036]
    ];
    M.fill(ctx, function (c) { polyPath(c, thick(pool, 2, 3)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, pool); c.closePath(); }, M.pal[0], { alpha: 1 });

    /* 淌下来的一道：两侧硬边（宽度有台阶，不是光滑的管子） */
    var prof = [[0.070, 0.235], [0.24, 0.200], [0.40, 0.228],
                [0.58, 0.180], [0.74, 0.150]];
    var L = [], R = [];
    for (i = 0; i < prof.length; i++) {
      var yy = h * prof[i][0], hw = w * prof[i][1], cxw = wave(yy);
      L.push([cxw - hw * 0.86, yy]);
      R.push([cxw + hw, yy]);
    }
    var col = L.slice();
    for (i = R.length - 1; i >= 0; i--) col.push(R[i]);
    M.fill(ctx, function (c) { polyPath(c, thick(col, 3, 3)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, col); c.closePath(); }, M.pal[0], { alpha: 1 });

    /* 柱子右缘的暗影（垂坠的厚度） */
    var sh = [];
    for (i = 0; i < R.length - 1; i++) sh.push(seg(R[i], R[i + 1], 3.0, 3.0));
    M.fill(ctx, function (c) { multi(c, sh); }, M.pal[4], { alpha: 0.30 });

    /* 柱身左缘压着的一道短亮划 */
    var hl = [];
    for (i = 0; i < L.length - 1; i++) {
      hl.push(seg([L[i][0] + 3, L[i][1]], [L[i + 1][0] + 3, L[i + 1][1]], 2.0, 2.0));
    }
    M.fill(ctx, function (c) { multi(c, hl); }, M.pal[2], { alpha: 0.55 });

    /* 末端积成的那一坨（会胀会缩） */
    var sq = 0.5 + 0.5 * Math.sin(T + 0.7);
    var dw = w * (0.245 + 0.035 * sq);
    var dh = h * (0.092 + 0.024 * sq);
    var dx0 = wave(h * 0.76);
    var dy0 = h * 0.845;
    var drop = [
      [dx0 - dw * 0.42, dy0 - dh * 0.95], [dx0 - dw * 0.95, dy0 - dh * 0.20],
      [dx0 - dw * 0.78, dy0 + dh * 0.55], [dx0 - dw * 0.28, dy0 + dh * 0.98],
      [dx0 + dw * 0.30, dy0 + dh * 0.94], [dx0 + dw * 0.80, dy0 + dh * 0.48],
      [dx0 + dw * 0.98, dy0 - dh * 0.22], [dx0 + dw * 0.44, dy0 - dh * 0.92]
    ];
    M.fill(ctx, function (c) { polyPath(c, thick(drop, 3, 3)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, drop); c.closePath(); }, M.pal[0], { alpha: 1 });
    M.fill(ctx, function (c) {
      multi(c, [shine(dx0 - dw * 0.16, dy0 - dh * 0.46, dw * 0.92, -0.18, 3.6)]);
    }, M.pal[2], { alpha: 0.55 });
    M.fill(ctx, function (c) {
      multi(c, [seg([dx0 - dw * 0.66, dy0 + dh * 0.52], [dx0 + dw * 0.50, dy0 + dh * 0.42], 2.6, 1.4)]);
    }, M.pal[4], { alpha: 0.28 });

    /* 旁边两颗小挂珠 */
    for (i = 0; i < 2; i++) {
      var side = i === 0 ? -1 : 1;
      var sy = h * (0.34 + i * 0.21);
      var ph = (p + i * 0.5) % 1;
      var sr = w * (0.048 + 0.022 * tri(ph));
      var sx = wave(sy) + side * w * 0.28;
      M.fill(ctx, function (c) { c.beginPath(); c.arc(sx, sy, sr, 0, TAU()); },
        M.pal[0], { alpha: 1 });
      M.fill(ctx, function (c) {
        c.beginPath(); c.arc(sx - sr * 0.28, sy - sr * 0.32, sr * 0.34, 0, TAU());
      }, M.pal[2], { alpha: 0.5 });
    }
  };

  /* 10 木柄画笔：一支笔，笔锋是湿的，笔杆有木纹 —— 190×120 */
  FORM.paintbrush = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1310;
    var T = p * TAU();
    var i;

    var a = [w * 0.035, h * 0.88];   /* 笔杆尾 */
    var b = [w * 0.545, h * 0.475];  /* 金属箍 */
    var cpt = [w * 0.955, h * 0.135];/* 笔锋尖 */
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var len = Math.sqrt(dx * dx + dy * dy);
    var ux = dx / len, uy = dy / len;
    function at(u) { return [a[0] + dx * u, a[1] + dy * u]; }
    function nx(u) { return [-uy, ux]; }

    ctx.save();
    /* 整支笔轻轻摇一下（在盒中心转） */
    ctx.translate(w * 0.5, h * 0.5);
    ctx.rotate(0.020 * Math.sin(T + 0.3));
    ctx.translate(-w * 0.5, -h * 0.5);

    /* 木杆（底下垫暗面 = 厚度） */
    var shaft = ribbon(at(0), at(1), function (u) {
      return h * (0.115 - 0.030 * u);
    }, 8);
    M.fill(ctx, function (c) { polyPath(c, thick(shaft, 3, 4)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, shaft); c.closePath(); }, M.pal[0], { alpha: 1 });
    /* 木纹 */
    var grain = [];
    for (i = 0; i < 3; i++) {
      var u0 = 0.06 + i * 0.27, u1 = u0 + 0.20;
      var p0 = at(u0), p1 = at(u1), n0 = nx(u0), n1 = nx(u1);
      grain.push(seg([p0[0] - n0[0] * 4, p0[1] - n0[1] * 4],
        [p1[0] - n1[0] * 4, p1[1] - n1[1] * 4], 1.0, 1.0));
    }
    M.fill(ctx, function (c) { multi(c, grain); }, M.pal[4], { alpha: 0.32 });
    /* 杆上表面的一道亮划 */
    M.fill(ctx, function (c) {
      var s0 = at(0.12), sn = nx(0.12);
      multi(c, [seg([s0[0] - sn[0] * 8, s0[1] - sn[1] * 8],
        [s0[0] + dx * 0.42 - sn[0] * 8, s0[1] + dy * 0.42 - sn[1] * 8], 2.2, 2.2)]);
    }, M.pal[2], { alpha: 0.45 });

    /* 金属箍（两道箍，中间一道亮线） */
    var fer = ribbon(b, [b[0] + (cpt[0] - b[0]) * 0.20, b[1] + (cpt[1] - b[1]) * 0.20],
      function () { return h * 0.125; }, 3);
    M.fill(ctx, function (c) { polyPath(c, fer); c.closePath(); }, M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) {
      var s1 = at(0.84), sn1 = nx(0.84);
      multi(c, [
        seg([s1[0] - sn1[0] * 7, s1[1] - sn1[1] * 7],
          [s1[0] + dx * 0.12 - sn1[0] * 7, s1[1] + dy * 0.12 - sn1[1] * 7], 2.2, 2.2),
        seg([s1[0] - sn1[0] * 7, s1[1] - sn1[1] * 7 + 6],
          [s1[0] + dx * 0.12 - sn1[0] * 7, s1[1] + dy * 0.12 - sn1[1] * 7 + 6], 1.4, 1.4)
      ]);
    }, M.pal[2], { alpha: 0.6 });

    /* 笔锋：湿的，蘸满钴蓝 */
    var fb = [b[0] + (cpt[0] - b[0]) * 0.20, b[1] + (cpt[1] - b[1]) * 0.20];
    var brush = ribbon(fb, cpt, function (u) {
      if (u < 0.32) return h * (0.120 + 0.026 * (u / 0.32));
      return h * (0.146 - 0.118 * ((u - 0.32) / 0.68));
    }, 12);
    M.fill(ctx, function (c) { polyPath(c, thick(brush, 3, 4)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, brush); c.closePath(); }, M.pal[1], { alpha: 1 });
    /* 毛根的深色 */
    var roots = ribbon(fb, [fb[0] + (cpt[0] - fb[0]) * 0.30, fb[1] + (cpt[1] - fb[1]) * 0.30],
      function (u) { return h * (0.122 - 0.012 * u); }, 4);
    M.fill(ctx, function (c) { polyPath(c, roots); c.closePath(); }, M.pal[4], { alpha: 0.5 });
    /* 笔锋上的亮划 */
    M.fill(ctx, function (c) {
      var n0b = nx(0);
      multi(c, [seg([fb[0] - n0b[0] * 6, fb[1] - n0b[1] * 6],
        [fb[0] + (cpt[0] - fb[0]) * 0.50 - n0b[0] * 6, fb[1] + (cpt[1] - fb[1]) * 0.50 - n0b[1] * 6], 2.0, 2.0)]);
    }, M.pal[2], { alpha: 0.55 });

    /* 笔尖那坨湿颜料（会鼓会晃） */
    var sq = 0.5 + 0.5 * Math.sin(T + 1.1);
    var wx = cpt[0] - w * 0.035, wy = cpt[1] + h * 0.030;
    var wet = [], k;
    for (k = 0; k < 10; k++) {
      var ang = (k / 10) * TAU() + 0.3;
      var rr = 0.72 + 0.38 * hash(seed, k, 2);
      wet.push([wx + Math.cos(ang) * w * 0.086 * rr * (0.9 + 0.2 * sq),
        wy + Math.sin(ang) * w * 0.072 * rr]);
    }
    M.fill(ctx, function (c) { polyPath(c, thick(wet, 3, 3)); c.closePath(); },
      M.pal[4], { alpha: 1 });
    M.fill(ctx, function (c) { polyPath(c, wet); c.closePath(); }, M.pal[1], { alpha: 1 });
    M.fill(ctx, function (c) {
      multi(c, [shine(wx - w * 0.020, wy - w * 0.030, w * 0.085, -0.35, 3.6)]);
    }, M.pal[2], { alpha: 0.60 });
    /* 往下淌的一小滴 */
    var dp = (p + 0.25) % 1;
    M.fill(ctx, function (c) {
      c.beginPath();
      c.ellipse(wx - w * 0.014, wy + w * 0.085 + 7 * tri(dp), w * 0.016, w * 0.021, 0, 0, TAU());
    }, M.pal[1], { alpha: 1 });
    ctx.restore();
  };

})(window.Sticker);
