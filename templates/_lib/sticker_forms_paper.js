/* ============================================================================
   纸艺剪纸 · 10 个专属画法
   ----------------------------------------------------------------------------
   这一族的手感是**一层一层剪纸叠起来**：
     · 每一层都是硬边形状（多边形 / 圆 / 弧），层与层之间靠 M.fill 自带的
       shadowOffsetY 拉开投影（不画辉光，纸是哑光的）；
     · 撕边 = 抖动折线（硬边），不是噪点圆；
     · 折纸物件（飞机 / 鹤 / 风车）必须有硬折痕，不画光滑曲面；
     · 调色板：pal[0] 米白纸 / pal[1] 牛皮纸 / pal[2] 雾蓝 /
                pal[3] 深墨（投影、描边）/ pal[4] 纯白（高光、背面）
   10 个 form 各有各的轮廓 / 构图 / 动法，不共用骨架。
   ============================================================================ */
(function (S) {
  'use strict';
  var FORM = S.FORM;
  var hash = S.hash, TAU = S.TAU, roundRect = S.roundRect;

  /* ------------------------------------------------------------------
     本族小工具：只往当前路径里加线段，**不自己 beginPath**
     （由调用方的路径函数先 beginPath，遵守「第一件事必须 beginPath」）
     ------------------------------------------------------------------ */

  /* 云朵剪影：平底 + 若干半圆凸起（硬边） */
  function cloudPath(c, x, y, w, rs) {
    c.moveTo(x, y);
    var xx = x;
    for (var i = 0; i < rs.length; i++) {
      var r = rs[i] * w;
      c.arc(xx + r, y, r, Math.PI, 0, false);
      xx += r * 2;
    }
  }

  /* 撕边：两点之间一条硬边抖动的折线（不是噪点圆） */
  function tornEdge(c, ax, ay, bx, by, n, seed, amp, start) {
    var i, t;
    if (start) c.moveTo(ax, ay); else c.lineTo(ax, ay);
    for (i = 1; i < n; i++) {
      t = i / n;
      c.lineTo(ax + (bx - ax) * t + (hash(seed, i, 1) - 0.5) * amp,
               ay + (by - ay) * t + (hash(seed, i, 2) - 0.5) * amp);
    }
    c.lineTo(bx, by);
  }

  /* 硬折痕：折纸的棱 */
  function crease(c, pts) {
    c.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
  }

  /* 圆角矩形挖一个圆洞。
     ⚠ 这里**不能用 fillRule='evenodd'** —— 本工程的渲染环境里 ctx.fillRule
     不生效（实测：设了也照样填满），而 M.fill 也不给传 fill 规则的入口。
     可靠做法是**绕向相反**：外框顺时针、洞口逆时针，nonzero 规则下就是洞。
     （逆时针 = arc(..., anticlockwise=true)） */
  function holedRound(c, x, y, w, h, r, hx, hy, hr) {
    c.beginPath();
    roundRect(c, x, y, w, h, r);
    c.moveTo(hx + hr, hy);
    c.arc(hx, hy, hr, 0, TAU(), true);   // 逆时针 → 挖空
    c.closePath();
  }

  /* ====================================================================
     1 层叠云朵：三层剪纸云，前后错开
     ==================================================================== */
  FORM.layeredClouds = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    /* 三层云：中间那颗大包是「云」的关键，凸起要够圆够大 */
    var L = [
      { y: 0.34, x: 0.16, cw: 0.72, rs: [0.10, 0.26, 0.14],
        k: 1, ph: 0.0, a: 0.022, c: M.pal[2], dy: 3 },
      { y: 0.62, x: 0.07, cw: 0.86, rs: [0.12, 0.24, 0.14],
        k: 2, ph: 1.9, a: 0.032, c: M.pal[1], dy: 4 },
      { y: 0.90, x: 0.10, cw: 0.92, rs: [0.09, 0.27, 0.14],
        k: 3, ph: 3.6, a: 0.026, c: M.pal[0], dy: 5 }
    ];
    for (var i = 0; i < L.length; i++) {
      (function (it) {
        var cw = w * it.cw, rMax = 0, j;
        for (j = 0; j < it.rs.length; j++) if (it.rs[j] > rMax) rMax = it.rs[j];
        /* 盒子太扁时把云收窄，保证整朵都留在盒子里 */
        var fit = Math.min(1, (h - 8) / (rMax * cw));
        cw *= fit;
        var y = Math.min(Math.max(h * it.y, rMax * cw + 3), h - 4);
        /* 三层各走各的速度 → 视差；sin 的相位差让三层明显错开 */
        var x = w * it.x + Math.sin(p * TAU() * it.k + it.ph) * w * it.a;
        M.fill(ctx, function (c) {
          c.beginPath();
          cloudPath(c, x, y, cw, it.rs);
          c.lineTo(x + cw, y);
          c.closePath();
        }, it.c, { dy: it.dy, blur: 9 });
      })(L[i]);
    }
  };

  /* ====================================================================
     2 剪影窗：一张纸上挖了个圆窗，窗外是另一层纸
     ==================================================================== */
  FORM.cutWindow = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var r = Math.min(w, h) * 0.42;
    var hx = w * 0.46, hy = h * 0.46;
    var dx = Math.sin(p * TAU()) * w * 0.075;      // 窗外那层纸横向平移
    var sx = w * 0.05, sy = h * 0.08, sw = w * 0.88, sh = h * 0.82;

    /* --- 窗外：裁在圆里的一层蓝色纸 + 远处的山 + 一只小鸟 --- */
    ctx.save();
    ctx.beginPath();
    ctx.arc(hx, hy, r, 0, TAU(), false);
    ctx.clip();
    M.fill(ctx, function (c) {
      c.beginPath();
      c.rect(hx - r - 2, hy - r - 2, r * 2 + 4, r * 2 + 4);
    }, M.pal[2], { dy: 0, blur: 0 });
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(hx - r - 2, hy + r * 0.30);
      c.lineTo(hx - r * 0.45 + dx, hy - r * 0.22);
      c.lineTo(hx + r * 0.20 + dx, hy + r * 0.26);
      c.lineTo(hx + r * 0.75 + dx, hy - r * 0.05);
      c.lineTo(hx + r + 2, hy + r * 0.18);
      c.lineTo(hx + r + 2, hy + r + 2);
      c.lineTo(hx - r - 2, hy + r + 2);
      c.closePath();
    }, M.pal[1], { dy: 0, blur: 0 });
    /* 小鸟：两片剪出来的小翅膀 */
    var bx = hx - r * 0.30 + dx, by = hy - r * 0.42;
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(bx, by);
      c.lineTo(bx - r * 0.22, by - r * 0.16);
      c.lineTo(bx - r * 0.04, by + r * 0.05);
      c.lineTo(bx + r * 0.14, by - r * 0.14);
      c.closePath();
    }, M.pal[4], { dy: 0, blur: 0 });
    ctx.restore();

    /* --- 窗框：一张挖了圆洞的纸 --- */
    M.fill(ctx, function (c) {
      holedRound(c, sx, sy, sw, sh, 7, hx, hy, r);
    }, M.pal[0], { dy: 5, blur: 11 });
    /* 洞口那圈纸的厚度（内切边） */
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.arc(hx, hy, r, 0, TAU(), false);
    }, M.pal[1], 2.4, { alpha: 0.85 });
    /* 窗框上的折痕（纸面被折过一道） */
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(sx + sw * 0.12, sy + sh * 0.66);
      c.lineTo(sx + sw * 0.34, sy + sh * 0.44);
      c.lineTo(sx + sw * 0.30, sy + sh * 0.20);
    }, M.pal[1], 1.2, { alpha: 0.5 });
  };

  /* ====================================================================
     3 折页卡：一张带折角的卡片，角会掀起来
     ==================================================================== */
  FORM.foldedCard = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var rot = 0.045 * Math.sin(p * TAU());          // 卡片轻轻摇
    var cw = w * 0.68, ch = h * 0.78;
    var cx = w * 0.5, cy = h * 0.52;
    var x0 = cx - cw / 2, y0 = cy - ch / 2, x1 = cx + cw / 2, y1 = cy + ch / 2;
    var s = Math.min(cw, ch) * 0.34;                // 折角边长
    var ax = x1 - s, by = y1 - s;                   // 折线两端
    /* 折角掀起的程度：0 = 完全折平（纸背贴在卡上），越大角越离开纸面 */
    var k = 0.06 + 0.38 * (0.5 + 0.5 * Math.sin(p * TAU()));
    var px = ax + (x1 - ax) * 0.5 * k, py = by + (y1 - by) * 0.5 * k;

    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(rot); ctx.translate(-cx, -cy);

    /* 卡片正面：右下角被剪掉一块（折走的那块）。
       三角形要**逆着外框的绕向**写，才是剪掉而不是补上（见 holedRound 注释）。 */
    M.fill(ctx, function (c) {
      c.beginPath();
      roundRect(c, x0, y0, cw, ch, 6);
      c.moveTo(ax, y1);
      c.lineTo(x1, y1);
      c.lineTo(x1, by);
      c.closePath();
    }, M.pal[0], { dy: 4, blur: 9 });

    /* 掀起来的折角（纸的背面，浅色） */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(ax, y1);
      c.lineTo(x1, by);
      c.lineTo(px, py);
      c.closePath();
    }, M.pal[4], { dy: 3, blur: 6 });
    /* 折线 + 折角的棱 */
    M.stroke(ctx, function (c) {
      c.beginPath();
      crease(c, [[ax, y1], [x1, by]]);
    }, M.pal[1], 1.6, { alpha: 0.75 });
    M.stroke(ctx, function (c) {
      c.beginPath();
      crease(c, [[ax, y1], [px, py], [x1, by]]);
    }, M.pal[1], 1.1, { alpha: 0.5 });

    /* 卡片上的三行"字" */
    for (var i = 0; i < 3; i++) {
      var ly = y0 + ch * (0.26 + i * 0.15);
      var lw = cw * (0.62 - i * 0.13);
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(x0 + cw * 0.13, ly);
        c.lineTo(x0 + cw * 0.13 + lw, ly);
      }, M.pal[1], 2.4, { alpha: 0.5 });
    }
    if (P.label) {
      M.text(ctx, P.label, cx, y0 + ch * 0.12, Math.min(20, cw * 0.14),
        M.pal[3], { align: 'center', baseline: 'middle' });
    }
    ctx.restore();
  };

  /* ====================================================================
     4 纸胶带：一条斜贴的胶带，压住一张照片角
     ==================================================================== */
  FORM.washiTape = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var seed = P.seed || 3;

    /* --- 被压住的照片角（白卡 + 一条雾蓝） --- */
    var px = w * 0.26, py = h * 0.64, pw = w * 0.40, ph = h * 0.50;
    ctx.save();
    ctx.translate(px, py); ctx.rotate(-0.10); ctx.translate(-px, -py);
    M.fill(ctx, function (c) {
      c.beginPath();
      c.rect(px - pw / 2, py - ph / 2, pw, ph);
    }, M.pal[4], { dy: 4, blur: 8 });
    M.fill(ctx, function (c) {
      c.beginPath();
      c.rect(px - pw / 2, py - ph / 2, pw, ph * 0.34);
    }, M.pal[2], { dy: 0, blur: 0 });
    ctx.restore();

    /* --- 胶带：斜向，两端是撕口 --- */
    var th = -0.30 + 0.02 * Math.sin(p * TAU());
    var dx = Math.cos(th), dy = Math.sin(th);
    var nx = -dy, ny = dx;
    var len = w * 0.47, hw = h * 0.15;   // 胶带整条都要留在盒子里（引擎只多给 16px）
    var creep = Math.sin(p * TAU()) * w * 0.03;     // 沿自身方向慢慢挪
    var ox = w * 0.5 + dx * creep, oy = h * 0.5 + dy * creep;
    var t0x = ox - dx * len, t0y = oy - dy * len;
    var t1x = ox + dx * len, t1y = oy + dy * len;

    M.fill(ctx, function (c) {
      c.beginPath();
      /* 上边 */
      c.moveTo(t0x + nx * hw, t0y + ny * hw);
      c.lineTo(t1x + nx * hw, t1y + ny * hw);
      /* 远端撕口 */
      var i, u, off, px2, py2;
      for (i = 0; i <= 5; i++) {
        u = i / 5;
        off = (hash(seed, i, 1) - 0.5) * hw * 0.55;
        px2 = t1x + nx * (hw - u * 2 * hw) + dx * off;
        py2 = t1y + ny * (hw - u * 2 * hw) + dy * off;
        c.lineTo(px2, py2);
      }
      /* 下边 */
      c.lineTo(t0x - nx * hw, t0y - ny * hw);
      /* 近端撕口 */
      for (i = 5; i >= 0; i--) {
        u = i / 5;
        off = (hash(seed, i, 2) - 0.5) * hw * 0.55;
        px2 = t0x + nx * (-hw + u * 2 * hw) + dx * off;
        py2 = t0y + ny * (-hw + u * 2 * hw) + dy * off;
        c.lineTo(px2, py2);
      }
      c.closePath();
    }, M.pal[0], { alpha: 0.86, dy: 3, blur: 7 });

    /* 胶带上的斜纹 */
    for (var k = -3; k <= 3; k++) {
      (function (kk) {
        var sx = ox + dx * (kk * len * 0.22), sy = oy + dy * (kk * len * 0.22);
        M.stroke(ctx, function (c) {
          c.beginPath();
          c.moveTo(sx + nx * hw * 0.72 + dx * hw * 0.55, sy + ny * hw * 0.72 + dy * hw * 0.55);
          c.lineTo(sx - nx * hw * 0.72 - dx * hw * 0.55, sy - ny * hw * 0.72 - dy * hw * 0.55);
        }, M.pal[1], 1.8, { alpha: 0.30 });
      })(k);
    }
  };

  /* ====================================================================
     5 撕边标签：手撕边的纸标签，挂在绳子上晃
     ==================================================================== */
  FORM.tornLabel = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var seed = P.seed || 7;
    var swing = 0.11 * Math.sin(p * TAU());
    var hx = w * 0.44, hy = h * 0.56;             // 穿绳的孔（也是摆动的支点）
    var ax = w * 0.30, ay = h * 0.04;             // 绳子的固定端
    var lw = w * 0.64, lh = h * 0.40;
    var x0 = hx - lw * 0.34, x1 = hx + lw * 0.66;
    var y0 = hy - lh * 0.5, y1 = hy + lh * 0.5;
    var hr = Math.min(w, h) * 0.045;

    /* 绳子：随标签摆动，弯度跟着变 */
    var mx = (ax + hx) * 0.5, my = (ay + hy) * 0.5;
    var nx = -(hy - ay), ny = (hx - ax);
    var nl = Math.sqrt(nx * nx + ny * ny) || 1;
    var bow = swing * h * 0.55;
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(ax, ay);
      c.quadraticCurveTo(mx + nx / nl * bow, my + ny / nl * bow, hx, hy);
    }, M.pal[3], 1.9, { alpha: 0.8 });

    ctx.save();
    ctx.translate(hx, hy); ctx.rotate(swing); ctx.translate(-hx, -hy);

    /* 标签本体：四条边全是撕口，孔是穿绳的洞（洞口逆时针 → 真挖空） */
    M.fill(ctx, function (c) {
      c.beginPath();
      tornEdge(c, x0, y0, x1, y0, 8, seed + 1, 4.0, true);
      tornEdge(c, x1, y0, x1, y1, 6, seed + 2, 4.0, false);
      tornEdge(c, x1, y1, x0, y1, 8, seed + 3, 4.0, false);
      tornEdge(c, x0, y1, x0, y0, 6, seed + 4, 4.0, false);
      c.moveTo(hx + hr, hy);
      c.arc(hx, hy, hr, 0, TAU(), true);
      c.closePath();
    }, M.pal[0], { dy: 4, blur: 9 });

    /* 孔的边（撕纸的厚边） */
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.arc(hx, hy, hr, 0, TAU(), false);
    }, M.pal[1], 1.6, { alpha: 0.8 });

    /* 标签上的字 */
    if (P.label) {
      M.text(ctx, P.label, hx + lw * 0.30, hy - lh * 0.10,
        Math.min(19, lh * 0.42), M.pal[3], { align: 'center', baseline: 'middle' });
    }
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(hx + lw * 0.02, hy + lh * 0.18);
      c.lineTo(hx + lw * 0.34, hy + lh * 0.18);
    }, M.pal[1], 2.2, { alpha: 0.55 });
    ctx.restore();
  };

  /* ====================================================================
     6 纸飞机：一只折好的纸飞机在斜飞（身后拖着航线虚线）
     ==================================================================== */
  FORM.paperPlane = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    /* 构图要点：纸飞机**沿对角线斜飞**（机头朝右上）。
       原来靠引擎的 rot=-22° 整体转盒子来实现斜飞，
       但那样整盒旋转会把元素挤到盒角、bbox 也撑不满 ——
       改成画法内部自带 -25° 机头朝向，落点沿对角线铺开，着墨才填得满盒子。
       机身长 L 取对角线长度的 0.60。 */
    var diag = Math.sqrt(w * w + h * h);
    var L = diag * 0.36;                        // 半机身长
    var dirA = -25 * Math.PI / 180;
    var dx0 = Math.cos(dirA), dy0 = Math.sin(dirA);
    var nx0 = -dy0, ny0 = dx0;                  // 机身的法向
    var cx = w * 0.50, cy = h * 0.52;
    var th = p * TAU();
    var px = cx + Math.sin(th) * w * 0.075;
    var py = cy + Math.sin(2 * th) * h * 0.115;
    var bank = 0.16 * Math.cos(th);              // 转弯时轻微侧倾

    /* 航线：身后一串短虚线（跟着同一条轨迹走） */
    for (var k = 1; k <= 6; k++) {
      (function (kk) {
        var t1 = th - kk * 0.30, t2 = t1 - 0.13;
        var x1 = cx + Math.sin(t1) * w * 0.075, y1 = cy + Math.sin(2 * t1) * h * 0.115;
        var x2 = cx + Math.sin(t2) * w * 0.075, y2 = cy + Math.sin(2 * t2) * h * 0.115;
        M.stroke(ctx, function (c) {
          c.beginPath();
          c.moveTo(x1, y1);
          c.lineTo(x2, y2);
        }, M.pal[1], 3.0, { alpha: 0.72 - kk * 0.08 });
      })(k);
    }

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(dirA + bank);
    /* 下半面（背面，牛皮纸） */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(L, 0);
      c.lineTo(-L * 0.80, L * 0.30);
      c.lineTo(-L * 0.20, 0);
      c.closePath();
    }, M.pal[1], { dy: 3, blur: 7 });
    /* 上半面（正面，米白纸） */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(L, 0);
      c.lineTo(-L * 0.80, -L * 0.40);
      c.lineTo(-L * 0.20, 0);
      c.closePath();
    }, M.pal[0], { dy: 4, blur: 8 });
    /* 中间的折痕 + 机尾的折边 */
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(L, 0);
      c.lineTo(-L * 0.20, 0);
    }, M.pal[3], 1.3, { alpha: 0.55 });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(-L * 0.80, -L * 0.40);
      c.lineTo(-L * 0.80, L * 0.30);
    }, M.pal[3], 1.2, { alpha: 0.45 });
    ctx.restore();
  };

  /* ====================================================================
     7 剪影树：一棵剪出来的树，叶子被风吹落
     ==================================================================== */
  /* 树冠的圆：[横向偏移, 纵向偏移, 半径]（相对树宽 / 树高），手摆的才连得住 */
  var CANOPY = [
    [-0.27, 0.03, 0.19], [0.00, -0.06, 0.25], [0.28, 0.02, 0.19],
    [-0.135, -0.12, 0.20], [0.16, -0.14, 0.22]
  ];
  FORM.cutTree = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var seed = P.seed || 11;
    var bx = w * 0.46, by = h * 0.94;
    var sway = 0.030 * Math.sin(p * TAU());
    var th = h * 0.38;                          // 树干高
    var cyc = by - th - h * 0.18;               // 树冠中心（要留出树干）

    ctx.save();
    ctx.translate(bx, by); ctx.rotate(sway); ctx.translate(-bx, -by);

    /* 地面：一小块纸的土丘 */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(bx - w * 0.26, by + h * 0.06);
      c.lineTo(bx - w * 0.12, by - h * 0.01);
      c.lineTo(bx + w * 0.06, by - h * 0.02);
      c.lineTo(bx + w * 0.24, by + h * 0.06);
      c.closePath();
    }, M.pal[1], { dy: 3, blur: 8 });

    /* 树干 + 树冠 = **同一张剪下来的剪影**：
       放在同一个路径里一次填色，才只有一道投影（分开填会变成几个黑团）。 */
    M.fill(ctx, function (c) {
      c.beginPath();
      /* 树干：上窄下宽 */
      c.moveTo(bx - w * 0.055, by);
      c.lineTo(bx - w * 0.024, by - th);
      c.lineTo(bx + w * 0.024, by - th);
      c.lineTo(bx + w * 0.055, by);
      c.closePath();
      /* 树冠：几个互相叠住的圆，合成一整块 */
      var i, cx2, cy2, r;
      for (i = 0; i < CANOPY.length; i++) {
        cx2 = bx + CANOPY[i][0] * w;
        cy2 = cyc + CANOPY[i][1] * h;
        r = CANOPY[i][2] * h;
        c.moveTo(cx2 + r, cy2);
        c.arc(cx2, cy2, r, 0, TAU(), false);
      }
    }, M.pal[3], { dy: 4, blur: 9 });
    ctx.restore();

    /* 落下的叶子：绕一圈回到原位（无缝） */
    for (var n = 0; n < 3; n++) {
      (function (nn) {
        var f = (p + nn * 0.33) % 1;
        var lx = bx + (hash(seed, nn, 7) - 0.5) * w * 0.30 + w * 0.06 * f;
        var ly = h * 0.30 + (by - h * 0.30) * f;
        var al = Math.sin(Math.PI * f) * 0.9;
        var rot = f * TAU() * 1.5 + nn;
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(rot);
        M.fill(ctx, function (c) {
          c.beginPath();
          c.moveTo(0, -h * 0.045);
          c.lineTo(h * 0.032, 0);
          c.lineTo(0, h * 0.045);
          c.lineTo(-h * 0.032, 0);
          c.closePath();
        }, M.pal[1], { alpha: al, dy: 2, blur: 5 });
        ctx.restore();
      })(n);
    }
  };

  /* ====================================================================
     8 拼贴框：几层不同颜色的纸拼成的框
     ==================================================================== */
  FORM.collageFrame = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var strips = [
      { x: 0.01, y: 0.04, w: 0.98, h: 0.17, rot: 0.030, c: M.pal[1],
        sl: 0.030, k: 1, ph: 0.0, ax: 1, ay: 0 },
      { x: 0.03, y: 0.79, w: 0.94, h: 0.16, rot: -0.026, c: M.pal[2],
        sl: 0.026, k: 2, ph: 1.3, ax: -1, ay: 0 },
      { x: 0.00, y: 0.20, w: 0.14, h: 0.64, rot: 0.022, c: M.pal[0],
        sl: 0.022, k: 1, ph: 2.5, ax: 0, ay: 1 },
      { x: 0.85, y: 0.18, w: 0.15, h: 0.66, rot: -0.020, c: M.pal[4],
        sl: 0.020, k: 2, ph: 3.7, ax: 0, ay: -1 }
    ];
    for (var i = 0; i < strips.length; i++) {
      (function (it) {
        var sw = w * it.w, sh = h * it.h;
        var sx = w * it.x, sy = h * it.y;
        /* 每条纸自己滑一点（拼贴的呼吸感），周期互不相同 */
        var d = Math.sin(p * TAU() * it.k + it.ph) * (it.ax ? w * it.sl : h * it.sl);
        var dx = it.ax ? d : 0, dy = it.ay ? d : 0;
        var cx = sx + sw / 2 + dx, cy = sy + sh / 2 + dy;
        var a = it.rot + 0.012 * Math.sin(p * TAU() * it.k + it.ph);
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(a); ctx.translate(-cx, -cy);
        M.fill(ctx, function (c) {
          c.beginPath();
          c.rect(sx, sy, sw, sh);
        }, it.c, { dy: 4, blur: 9 });
        ctx.restore();
      })(strips[i]);
    }
    /* 一条斜着压过左下角的短纸（拼贴的错落感） */
    var ax0 = w * 0.09, ay0 = h * 0.70;
    ctx.save();
    ctx.translate(ax0, ay0); ctx.rotate(-0.42); ctx.translate(-ax0, -ay0);
    M.fill(ctx, function (c) {
      c.beginPath();
      c.rect(ax0, ay0, w * 0.20, h * 0.085);
    }, M.pal[2], { dy: 3, blur: 7 });
    ctx.restore();
  };

  /* ====================================================================
     9 纸风车：六角纸风车在转
     ==================================================================== */
  FORM.pinwheel = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var cx = w * 0.44, cy = h * 0.40;
    var R = Math.min(w, h) * 0.50;
    var sway = 0.035 * Math.sin(p * TAU());

    /* 柄：先画，被风车头压住 */
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(sway); ctx.translate(-cx, -cy);
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - w * 0.016, cy);
      c.lineTo(cx + w * 0.016, cy);
      c.lineTo(cx + w * 0.075, h * 0.99);
      c.lineTo(cx + w * 0.026, h * 0.99);
      c.closePath();
    }, M.pal[1], { dy: 3, blur: 7 });
    ctx.restore();

    /* 风车头：六片折起来的三角叶片 */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(p * TAU());
    for (var i = 0; i < 6; i++) {
      (function (ii) {
        var a = ii / 6 * TAU();
        /* 注意：这里必须拆成数组 —— `R * (Math.cos(a), Math.sin(a))` 是逗号
           运算符，只取最后一项，角点会全部塌掉（踩过：叶片缩成一条线）。 */
        var A = [R * Math.cos(a), R * Math.sin(a)];
        var B = [R * Math.cos(a + 0.58), R * Math.sin(a + 0.58)];
        var F = [R * 0.56 * Math.cos(a + 0.30), R * 0.56 * Math.sin(a + 0.30)];
        /* 叶片背面 */
        M.fill(ctx, function (c) {
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(A[0], A[1]);
          c.lineTo(B[0], B[1]);
          c.closePath();
        }, M.pal[2], { dy: 2, blur: 6 });
        /* 折过来的正面（更亮，形成风车的旋） */
        M.fill(ctx, function (c) {
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(F[0], F[1]);
          c.lineTo(B[0], B[1]);
          c.closePath();
        }, M.pal[0], { dy: 2, blur: 6 });
        /* 硬折痕 */
        M.stroke(ctx, function (c) {
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(B[0], B[1]);
        }, M.pal[1], 1.2, { alpha: 0.55 });
      })(i);
    }
    /* 中间的轴钉 */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.arc(0, 0, R * 0.11, 0, TAU(), false);
    }, M.pal[3], { dy: 2, blur: 5 });
    M.fill(ctx, function (c) {
      c.beginPath();
      c.arc(-R * 0.03, -R * 0.035, R * 0.035, 0, TAU(), false);
    }, M.pal[4], { dy: 0, blur: 0 });
    ctx.restore();
  };

  /* ====================================================================
     10 折纸鹤：一只折纸鹤，翅膀张着拍
     ==================================================================== */
  FORM.origamiCrane = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    /* bar 构图：盒子是 460×64 的长条，鹤必须**横向摊开**才填得满。
       身体用 h 的比例（高），翅膀用 w 的比例（宽）。 */
    var cx = w * 0.50, cy = h * 0.58;
    var flap = 0.80 + 0.22 * Math.sin(p * TAU());   // 翅膀拍动
    var bob = 0.05 * Math.sin(p * TAU());

    /* --- 远侧翅膀（先画，雾蓝那层） --- */
    ctx.save();
    ctx.translate(cx, cy); ctx.scale(1, flap); ctx.translate(-cx, -cy);
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - w * 0.020, cy - h * 0.10);
      c.lineTo(cx - w * 0.430, cy - h * 0.34);
      c.lineTo(cx - w * 0.100, cy + h * 0.12);
      c.closePath();
    }, M.pal[2], { dy: 3, blur: 7 });
    ctx.restore();

    /* --- 身体 + 颈 + 头 + 尾（米白纸，硬折面） --- */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - w * 0.045, cy);
      c.lineTo(cx, cy - h * 0.26);
      c.lineTo(cx + w * 0.045, cy);
      c.lineTo(cx, cy + h * 0.24);
      c.closePath();
    }, M.pal[0], { dy: 3, blur: 8 });
    /* 颈：一条细长的折面，斜向左上（与远侧翅膀错开，才看得出是脖子） */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - w * 0.026, cy - h * 0.12);
      c.lineTo(cx - w * 0.130, cy - h * 0.50 + bob * h);
      c.lineTo(cx - w * 0.100, cy - h * 0.22 + bob * h);
      c.closePath();
    }, M.pal[0], { dy: 3, blur: 7 });
    /* 头 + 尖喙（牛皮纸，和米白的脖子分开一片纸，轮廓才咬得住） */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - w * 0.130, cy - h * 0.50 + bob * h);
      c.lineTo(cx - w * 0.205, cy - h * 0.42 + bob * h);
      c.lineTo(cx - w * 0.100, cy - h * 0.36 + bob * h);
      c.closePath();
    }, M.pal[1], { dy: 2, blur: 6 });
    /* 尾羽：右上翘的一片牛皮纸 */
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx + w * 0.030, cy - h * 0.08);
      c.lineTo(cx + w * 0.185, cy - h * 0.40);
      c.lineTo(cx + w * 0.070, cy + h * 0.05);
      c.closePath();
    }, M.pal[1], { dy: 3, blur: 7 });

    /* --- 近侧翅膀（米白，压在身体上） --- */
    ctx.save();
    ctx.translate(cx, cy); ctx.scale(1, flap); ctx.translate(-cx, -cy);
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx + w * 0.020, cy - h * 0.12);
      c.lineTo(cx + w * 0.425, cy - h * 0.40);
      c.lineTo(cx + w * 0.090, cy + h * 0.10);
      c.closePath();
    }, M.pal[0], { dy: 4, blur: 9 });
    /* 翅膀的硬折痕 */
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx + w * 0.020, cy - h * 0.12);
      c.lineTo(cx + w * 0.425, cy - h * 0.40);
    }, M.pal[1], 1.3, { alpha: 0.6 });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx + w * 0.020, cy - h * 0.12);
      c.lineTo(cx + w * 0.090, cy + h * 0.10);
    }, M.pal[1], 1.1, { alpha: 0.45 });
    ctx.restore();

    /* 身体的折棱 */
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - w * 0.045, cy);
      c.lineTo(cx + w * 0.045, cy);
    }, M.pal[1], 1.2, { alpha: 0.55 });
  };
})(window.Sticker);
