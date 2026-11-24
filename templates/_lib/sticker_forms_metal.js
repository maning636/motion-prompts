/* 工业金属 · 10 个专属画法
   ---------------------------------------------------------------------------
   这一族的手感：**硬、糙、有重量**。边角画硬，不画圆软。
   表面质感只靠三样东西：
     1. 拉丝 —— 细横线（brushed）
     2. 高光带 —— 沿面走的一道亮
     3. 锈斑 —— 不规则小块深色（rust）
   铆钉 / 螺栓一律画成「暗边 + 亮心」的小圆头，不是纯圆点。
   调色板：pal[0] 钢灰 / pal[1] 锈橙 / pal[2] 警示黄 / pal[3] 深钢 / pal[4] 亮银。
   动法 10 条各不相同：扫光 / 反向咬合转 / 闪 / 光绕圈 / 链摆 / 拧 / 张合 / 开合 / 各转 / 绕桶。
   所有运动量都是 p 的整周期函数（p=0 与 p=1 画面一致，可无缝循环）。 */
(function (S) {
  'use strict';

  var FORM = S.FORM;
  var hash = S.hash, TAU = S.TAU, roundRect = S.roundRect;

  /* ===================================================================
     族内零件
     =================================================================== */

  /** 铆钉头：暗边 + 中间钢面 + 亮心高光（不是纯圆点）。 */
  function rivet(ctx, x, y, r, M, ang) {
    var a = (ang == null) ? -2.35 : ang;
    var box = { x: x - r, y: y - r, w: r * 2, h: r * 2 };
    M.fill(ctx, function (c) { c.beginPath(); c.arc(x, y, r, 0, TAU()); },
      M.pal[3], { box: box });
    M.fill(ctx, function (c) { c.beginPath(); c.arc(x, y, r * 0.74, 0, TAU()); },
      M.pal[0], { box: box });
    M.fill(ctx, function (c) {
      c.beginPath();
      c.arc(x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, r * 0.32, 0, TAU());
    }, M.pal[4], { box: box });
  }

  /** 钢面：先铺深钢再叠钢灰 → 出来是「中灰钢」，不是白亮铝。 */
  function steelFace(ctx, pathFn, M, box, alpha) {
    M.fill(ctx, pathFn, M.pal[3], { box: box });
    M.fill(ctx, pathFn, M.pal[0], { box: box, alpha: alpha == null ? 0.56 : alpha });
  }

  /** 拉丝：细横线，方向固定（金属面被拉过）。 */
  function brushed(ctx, x, y, w, h, M, n, seed, alpha) {
    for (var i = 0; i < n; i++) {
      var yy = y + h * ((i + 0.5) / n);
      var x0 = x + w * (hash(seed, i, 1) * 0.16);
      var x1 = x + w * (0.84 + hash(seed, i,  2) * 0.16);
      M.stroke(ctx, function (c) {
        c.beginPath(); c.moveTo(x0, yy); c.lineTo(x1, yy);
      }, M.pal[4], 0.9, { alpha: alpha });
    }
  }

  /** 锈斑：不规则小块（金属的脏）。压扁一点、压淡一点 —— 锈是渍，不是贴纸。 */
  function rust(ctx, x, y, r, M, seed, alpha) {
    var n = 7, pts = [], i;
    for (i = 0; i < n; i++) {
      var a = (i / n) * TAU();
      var rr = r * (0.5 + 0.7 * hash(seed, i, 5));
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.55]);
    }
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(pts[0][0], pts[0][1]);
      for (i = 1; i < n; i++) c.lineTo(pts[i][0], pts[i][1]);
      c.closePath();
    }, M.pal[1], { box: { x: x - r, y: y - r * 0.6, w: r * 2, h: r * 1.2 },
                   alpha: (alpha == null ? 0.4 : alpha) * 0.68 });
  }

  /** 六角头（螺栓）：硬边多边形。 */
  function hexPath(ctx, cx, cy, r, ang) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var a = ang + (i / 6) * TAU();
      var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  /** 链环：两头圆的跑道形（stadium）。 */
  function stadium(ctx, cx, cy, len, wid, ang) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(ang);
    roundRect(ctx, -len / 2, -wid / 2, len, wid, wid / 2);
    ctx.restore();
  }

  /** 齿轮：梯形齿（不是锯齿波），齿根是圆弧；hole > 0 时中间是真空的环。 */
  function gearPath(ctx, cx, cy, Rp, teeth, m, phase, hole) {
    var tip = Rp + m, root = Rp - 1.25 * m;
    var step = TAU() / teeth;
    var wr = step * 0.30, wt = step * 0.17;
    var i, a;
    ctx.beginPath();
    for (i = 0; i < teeth; i++) {
      a = phase + i * step;
      if (i === 0) ctx.moveTo(cx + Math.cos(a - wr) * root, cy + Math.sin(a - wr) * root);
      ctx.lineTo(cx + Math.cos(a - wt) * tip, cy + Math.sin(a - wt) * tip);
      ctx.lineTo(cx + Math.cos(a + wt) * tip, cy + Math.sin(a + wt) * tip);
      ctx.lineTo(cx + Math.cos(a + wr) * root, cy + Math.sin(a + wr) * root);
      ctx.arc(cx, cy, root, a + wr, a + step - wr, false);
    }
    if (hole > 0) {
      for (i = 0; i <= 48; i++) {
        a = -i / 48 * TAU();               // 反向绕 → 中心是真空的孔
        var hx = cx + Math.cos(a) * hole, hy = cy + Math.sin(a) * hole;
        if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    }
  }

  /** 刨花卷：阿基米德螺线（金属屑）。squash 压扁 → 像扁的卷曲铁皮。 */
  function spiral(ctx, cx, cy, r0, k, turns, ang, squash) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(ang);
    var N = 44, i, th, r, x, y;
    for (i = 0; i <= N; i++) {
      th = turns * TAU() * i / N;
      r = r0 + k * th;
      x = Math.cos(th) * r; y = Math.sin(th) * r * (squash || 0.92);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.restore();
  }

  /* ===================================================================
     1 铆钉牌：四角带铆钉的钢牌
     动法：一道高光带在板面上左右来回扫（p=0/1 时整条在板外 → 无缝）
     =================================================================== */
  FORM.rivetedPlate = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var pw = w * 0.82, ph = h * 0.70;
    var px = (w - pw) / 2, py = (h - ph) / 2;
    var seed = P.seed || 7;
    var box = { x: px, y: py, w: pw, h: ph };

    steelFace(ctx, function (c) { c.beginPath(); roundRect(c, px, py, pw, ph, 4); },
      M, box, 0.46);
    /* 上缘高光带 / 下缘暗面：硬边平涂，靠对比出厚度 */
    M.fill(ctx, function (c) { c.beginPath(); c.rect(px, py, pw, ph * 0.15); },
      M.pal[4], { alpha: 0.20, box: box });
    M.fill(ctx, function (c) { c.beginPath(); c.rect(px, py + ph * 0.80, pw, ph * 0.20); },
      M.pal[3], { alpha: 0.34, box: box });

    /* 拉丝 + 扫光，都裁在板内 */
    ctx.save();
    ctx.beginPath(); roundRect(ctx, px, py, pw, ph, 4); ctx.clip();
    brushed(ctx, px, py, pw, ph, M, 13, seed, 0.10);
    var sw = 0.5 - 0.5 * Math.cos(p * TAU());
    var bx = px - 30 + sw * (pw + 60);
    M.fill(ctx, function (c) { c.beginPath(); c.rect(bx, py, 24, ph); },
      M.pal[4], { alpha: 0.14, box: { x: bx, y: py, w: 24, h: ph } });
    ctx.restore();

    /* 凹进去的铭牌面（内框） */
    M.stroke(ctx, function (c) {
      c.beginPath(); roundRect(c, px + 18, py + 16, pw - 36, ph - 32, 2);
    }, M.pal[3], 1.6, { alpha: 0.8 });

    /* 铆钉：四角 */
    var rr = Math.min(pw, ph) * 0.058;
    var ix = px + rr * 2.3, iy = py + rr * 2.3;
    var pts = [[ix, iy], [px + pw - ix, iy], [ix, py + ph - iy], [px + pw - ix, py + ph - iy]];
    for (var i = 0; i < 4; i++) rivet(ctx, pts[i][0], pts[i][1], rr, M, -2.35);

    /* 锈：两处，都在板上 */
    rust(ctx, px + pw * 0.18, py + ph * 0.74, Math.min(pw, ph) * 0.075, M, seed + 3, 0.55);
    rust(ctx, px + pw * 0.86, py + ph * 0.28, Math.min(pw, ph) * 0.05, M, seed + 9, 0.4);

    /* 硬边描边 + 上缘亮线 */
    M.stroke(ctx, function (c) { c.beginPath(); roundRect(c, px, py, pw, ph, 4); },
      M.pal[3], 2.4, {});
    M.stroke(ctx, function (c) { c.beginPath(); roundRect(c, px + 1.2, py + 1.2, pw - 2.4, ph - 2.4, 3); },
      M.pal[4], 1, { alpha: 0.38 });
  };

  /* ===================================================================
     2 齿轮环：两个咬合转动的齿轮
     齿是真梯形齿；大轮 14 齿 / 小轮 7 齿，模数相同 → 转速比 1:2，反向转。
     动法：两轮反向咬合转（大轮 1 圈 / 小轮 2 圈，每周期都是整圈 → 无缝）
     =================================================================== */
  FORM.gearRing = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    /* 齿轮是圆的 → 半径按**盒高**取（不是 min(w,h)，
       横盒里按 min 取会被宽度以外的短边卡住，齿轮看起来很小）。
       Rp1 = 0.40h：大轮上下各留 0.10h 的余量，齿尖刚好铺满盒高。 */
    var S1 = Math.min(w, h);
    var Rp1 = h * 0.40, m = Rp1 / 7;
    var Rp2 = Rp1 * 0.5;
    var N1 = 14, N2 = 7;
    var D = Rp1 + Rp2;
    var phi = -0.40;                       // 连心线方向
    var c1x = w * 0.30, c1y = h * 0.52;
    var c2x = c1x + D * Math.cos(phi), c2y = c1y + D * Math.sin(phi);

    var a1 = phi + p * TAU();                                     // 大轮：+1 圈
    var a2 = phi + Math.PI - (TAU() / N2) / 2 - 2 * p * TAU();     // 小轮：-2 圈，相位让齿对齿槽

    function drawGear(cx, cy, Rp, teeth, mod, ang, hole, spokes) {
      var box = { x: cx - Rp, y: cy - Rp, w: Rp * 2, h: Rp * 2 };
      steelFace(ctx, function (c) { gearPath(c, cx, cy, Rp, teeth, mod, ang, hole); },
        M, box, 0.55);
      M.stroke(ctx, function (c) { gearPath(c, cx, cy, Rp, teeth, mod, ang, hole); },
        M.pal[3], 1.4, {});
      /* 轮辐：粗粗的几根，从轮毂撑到齿根环 */
      for (var s = 0; s < spokes; s++) {
        var sa = ang + s * TAU() / spokes;
        var r0 = Rp * 0.26, r1 = hole + Rp * 0.05;
        M.fill(ctx, function (c) {
          c.beginPath();
          c.moveTo(cx + Math.cos(sa - 0.34) * r0, cy + Math.sin(sa - 0.34) * r0);
          c.lineTo(cx + Math.cos(sa - 0.17) * r1, cy + Math.sin(sa - 0.17) * r1);
          c.lineTo(cx + Math.cos(sa + 0.17) * r1, cy + Math.sin(sa + 0.17) * r1);
          c.lineTo(cx + Math.cos(sa + 0.34) * r0, cy + Math.sin(sa + 0.34) * r0);
          c.closePath();
        }, M.pal[0], { box: { x: cx - r1, y: cy - r1, w: r1 * 2, h: r1 * 2 } });
        M.stroke(ctx, function (c) {
          c.beginPath();
          c.moveTo(cx + Math.cos(sa - 0.30) * r0, cy + Math.sin(sa - 0.30) * r0);
          c.lineTo(cx + Math.cos(sa - 0.16) * r1, cy + Math.sin(sa - 0.16) * r1);
          c.moveTo(cx + Math.cos(sa + 0.30) * r0, cy + Math.sin(sa + 0.30) * r0);
          c.lineTo(cx + Math.cos(sa + 0.16) * r1, cy + Math.sin(sa + 0.16) * r1);
        }, M.pal[3], 1.1, { alpha: 0.85 });
      }
      /* 轮毂 */
      M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, Rp * 0.32, 0, TAU()); },
        M.pal[0], { box: { x: cx - Rp * 0.32, y: cy - Rp * 0.32, w: Rp * 0.64, h: Rp * 0.64 } });
      M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, Rp * 0.32, 0, TAU()); },
        M.pal[3], 1.4, {});
      M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, Rp * 0.11, 0, TAU()); },
        M.pal[3], { box: { x: cx - Rp * 0.11, y: cy - Rp * 0.11, w: Rp * 0.22, h: Rp * 0.22 } });
      M.fill(ctx, function (c) { c.beginPath(); c.arc(cx - Rp * 0.08, cy - Rp * 0.09, Rp * 0.06, 0, TAU()); },
        M.pal[4], { box: { x: cx - Rp * 0.14, y: cy - Rp * 0.15, w: Rp * 0.12, h: Rp * 0.12 } });
    }

    drawGear(c2x, c2y, Rp2, N2, m, a2, Rp2 * 0.30, 0);
    drawGear(c1x, c1y, Rp1, N1, m, a1, Rp1 * 0.40, 5);
  };

  /* ===================================================================
     3 警示三角：黄黑三角里一个闪电
     动法：闪电高频闪（4 段周期）+ 整块三角微晃
     =================================================================== */
  FORM.warningTriangle = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var bh = h * 0.94, bw = bh * 1.14;
    if (bw > w * 0.95) { bw = w * 0.95; bh = bw / 1.14; }
    var cx = w * 0.5, cy = h * 0.53;
    var apx = cy - bh * 0.56, apy = cy + bh * 0.44;

    ctx.save();
    /* 动法：整块三角牌**左右晃 + 微转**（原来只有 ±2° 转角，
       而警示色闪烁是 4 次谐波、在 p=0.25/0.75 归零 ——
       那一刻闪没了、转角也最小，画面几乎不变）。
       位移比转角能刷出多得多的变动像素。 */
    var triW = 1 - Math.abs(((p * 2) % 2) - 1) * 2;   // 0→1→0 三角波
    var dx = Math.round(triW * 6) - 3;                // -3 ~ +3 px
    ctx.translate(cx + dx, cy);
    ctx.rotate(0.05 * Math.sin(p * TAU() * 2));
    ctx.translate(-cx, -cy);

    function tri(sc) {
      return function (c) {
        c.beginPath();
        c.moveTo(cx, apy - bh * (0.56 + 0.44) * sc);
        c.lineTo(cx + bw * 0.5 * sc, apy);
        c.lineTo(cx - bw * 0.5 * sc, apy);
        c.closePath();
      };
    }
    M.fill(ctx, tri(1), M.pal[3], { box: { x: cx - bw / 2, y: apy - bh, w: bw, h: bh } });
    M.fill(ctx, tri(0.80), M.pal[2], { box: { x: cx - bw / 2, y: apy - bh, w: bw, h: bh } });
    M.stroke(ctx, tri(0.80), M.pal[4], 1.2, { alpha: 0.3 });

    /* 闪电 */
    var bl = bh * 0.60, bx = cx - bl * 0.5, by = apy - bh * 0.84;
    var pts = [[0.58, 0.00], [0.28, 0.46], [0.47, 0.46], [0.33, 0.96],
               [0.72, 0.40], [0.53, 0.40]];
    var flick = 0.74 + 0.26 * Math.pow(Math.max(0, Math.sin(p * TAU() * 4)), 3);
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(bx + pts[0][0] * bl, by + pts[0][1] * bl);
      for (var i = 1; i < pts.length; i++) c.lineTo(bx + pts[i][0] * bl, by + pts[i][1] * bl);
      c.closePath();
    }, M.pal[3], { box: { x: bx, y: by, w: bl, h: bl }, alpha: flick });

    /* 磨损与锈：落在黄面上，不脏黑边 */
    rust(ctx, cx - bw * 0.26, apy - bh * 0.12, bh * 0.055, M, 41, 0.55);
    rust(ctx, cx + bw * 0.22, apy - bh * 0.18, bh * 0.04, M, 47, 0.4);
    ctx.restore();
  };

  /* ===================================================================
     4 钢印字：压印进钢板的编号
     压印 = 凹槽（暗）+ 一道亮唇；亮唇的方位随 p 绕圈 → 像光在板面上转
     动法：压印高光绕着字转一圈
     =================================================================== */
  FORM.stampedMark = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var pw = w * 0.80, ph = h * 0.64;
    var px = (w - pw) / 2, py = (h - ph) / 2;
    var seed = P.seed || 13;
    var box = { x: px, y: py, w: pw, h: ph };

    steelFace(ctx, function (c) { c.beginPath(); roundRect(c, px, py, pw, ph, 3); },
      M, box, 0.46);
    ctx.save();
    ctx.beginPath(); roundRect(ctx, px, py, pw, ph, 3); ctx.clip();
    brushed(ctx, px, py, pw, ph, M, 15, seed, 0.09);
    M.fill(ctx, function (c) { c.beginPath(); c.rect(px, py, pw, ph * 0.13); },
      M.pal[4], { alpha: 0.18, box: box });
    M.fill(ctx, function (c) { c.beginPath(); c.rect(px, py + ph * 0.84, pw, ph * 0.16); },
      M.pal[3], { alpha: 0.30, box: box });
    ctx.restore();

    /* 钢印编号：暗槽 + 一道亮唇（亮唇绕着字转 = 光在动） */
    var label = P.label || 'No.0834';
    var size = Math.min(pw * 0.29, ph * 0.42);
    var a = p * TAU();
    var ox = Math.cos(a) * 1.9, oy = Math.sin(a) * 1.9;
    M.text(ctx, label, w / 2 + ox, h / 2 + oy, size, M.pal[4], { alpha: 0.92 });
    M.text(ctx, label, w / 2, h / 2, size, M.pal[3], { alpha: 0.97 });

    rust(ctx, px + pw * 0.10, py + ph * 0.80, Math.min(pw, ph) * 0.07, M, seed + 5, 0.5);
    rust(ctx, px + pw * 0.90, py + ph * 0.24, Math.min(pw, ph) * 0.05, M, seed + 8, 0.4);
    M.stroke(ctx, function (c) { c.beginPath(); roundRect(c, px, py, pw, ph, 3); },
      M.pal[3], 2.2, {});
  };

  /* ===================================================================
     5 链条链环：两个交错的椭圆链环
     两环同轴、首尾交叠：A 从 B 底下穿过去 → 上面一段 A 压 B，下面一段 B 压 A
     动法：整条链轻摆
     =================================================================== */
  FORM.chainLinks = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var ang = -0.55;
    var len = Math.min(w * 0.56, h * 0.92);
    var wid = len * 0.30, th = wid * 0.30;
    var ux = Math.cos(ang), uy = Math.sin(ang);
    var cAx = w * 0.5 - ux * len * 0.26, cAy = h * 0.5 - uy * len * 0.26;
    var cBx = cAx + ux * len * 0.56, cBy = cAy + uy * len * 0.56;
    var angB = ang + 0.34;                   // 后一环略转开一点 → 像串起来的链
    var rock = 0.045 * Math.sin(p * TAU());

    function link(cx, cy, a) {
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(rock);
      M.stroke(ctx, function (c) { stadium(c, 0, 0, len, wid, a); }, M.pal[3], th + 3.4, {});
      M.stroke(ctx, function (c) { stadium(c, 0, 0, len, wid, a); }, M.pal[0], th, {});
      M.stroke(ctx, function (c) { stadium(c, -1.2, -1.8, len, wid, a); },
        M.pal[4], 1.4, { alpha: 0.6 });
      ctx.restore();
    }

    link(cAx, cAy, ang);
    /* 后一环压在先一环上：先落一层投影，再画环体 → 一眼看出前后 */
    ctx.save();
    ctx.translate(cBx + 2.5, cBy + 3.5);
    M.stroke(ctx, function (c) { stadium(c, 0, 0, len, wid, angB); },
      M.pal[3], th + 1.2, { alpha: 0.6 });
    ctx.restore();
    link(cBx, cBy, angB);
    /* 交错：先一环的尾端从后一环上面穿过去 */
    ctx.save();
    ctx.translate(cAx + ux * len * 0.40, cAy + uy * len * 0.40);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.rect(-len * 0.22, -wid, len * 0.44, wid * 2);
    ctx.clip();
    link(cAx, cAy, ang);
    ctx.restore();
  };

  /* ===================================================================
     6 螺栓板：四颗大螺栓压着一块钢板
     动法：四颗六角头同向棘轮旋转（每周期 2 圈）+ 板面被夹紧的呼吸
     =================================================================== */
  FORM.boltPlate = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var pw = w * 0.76, ph = h * 0.52;
    var px = (w - pw) / 2, py = h * 0.19;
    var th = h * 0.17;                       // 板的厚度
    var seed = P.seed || 21;
    var box = { x: px, y: py, w: pw, h: ph };
    var grip = 1 - 0.012 * (0.5 + 0.5 * Math.cos(p * TAU() * 2));

    ctx.save();
    ctx.translate(w / 2, py + ph);
    ctx.scale(1, grip);
    ctx.translate(-w / 2, -(py + ph));

    /* 板面 + 侧面厚度 */
    steelFace(ctx, function (c) { c.beginPath(); roundRect(c, px, py, pw, ph, 2); },
      M, box, 0.48);
    M.fill(ctx, function (c) { c.beginPath(); c.rect(px, py + ph, pw, th); },
      M.pal[3], { box: { x: px, y: py, w: pw, h: ph + th } });
    ctx.save();
    ctx.beginPath(); roundRect(ctx, px, py, pw, ph, 2); ctx.clip();
    brushed(ctx, px, py, pw, ph, M, 11, seed, 0.09);
    M.fill(ctx, function (c) { c.beginPath(); c.rect(px, py, pw, ph * 0.15); },
      M.pal[4], { alpha: 0.20, box: box });
    M.fill(ctx, function (c) { c.beginPath(); c.rect(px, py + ph * 0.82, pw, ph * 0.18); },
      M.pal[3], { alpha: 0.26, box: box });
    ctx.restore();
    M.stroke(ctx, function (c) { c.beginPath(); roundRect(c, px, py, pw, ph, 2); },
      M.pal[3], 2.2, {});
    M.stroke(ctx, function (c) { c.beginPath(); roundRect(c, px, py + ph, pw, th, 2); },
      M.pal[3], 1.4, { alpha: 0.7 });

    /* 四颗大螺栓 */
    var br = Math.min(pw, ph) * 0.125;
    var rot = p * TAU() * 2;
    var ins = br * 1.85;
    var bp = [[px + ins, py + ins], [px + pw - ins, py + ins],
              [px + ins, py + ph - ins], [px + pw - ins, py + ph - ins]];
    for (var i = 0; i < 4; i++) {
      var bx = bp[i][0], by = bp[i][1], ba = rot + i * 0.4;
      var wbox = { x: bx - br * 1.5, y: by - br * 1.5, w: br * 3, h: br * 3 };
      /* 垫圈 */
      M.fill(ctx, function (c) { c.beginPath(); c.arc(bx, by, br * 1.45, 0, TAU()); },
        M.pal[3], { box: wbox });
      M.fill(ctx, function (c) { c.beginPath(); c.arc(bx, by, br * 1.18, 0, TAU()); },
        M.pal[0], { box: wbox });
      /* 六角头 */
      M.fill(ctx, function (c) { hexPath(c, bx, by, br, ba); },
        M.pal[0], { box: wbox });
      M.stroke(ctx, function (c) { hexPath(c, bx, by, br, ba); }, M.pal[3], 1.5, {});
      /* 角上的高光标记：跟着六角头转，看得出在拧 */
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(bx + Math.cos(ba) * br * 0.26, by + Math.sin(ba) * br * 0.26);
        c.lineTo(bx + Math.cos(ba) * br * 0.84, by + Math.sin(ba) * br * 0.84);
      }, M.pal[4], 2.4, { alpha: 0.85 });
    }
    rust(ctx, px + pw * 0.54, py + ph * 0.68, Math.min(pw, ph) * 0.06, M, seed + 7, 0.45);
    ctx.restore();
  };

  /* ===================================================================
     7 扳手：一把开口扳手
     头 = 实心圆盘切出 U 形口（一头开口），另一头是闭口环，中间是收腰的把手
     动法：整把微微摆动 + U 口张合
     =================================================================== */
  FORM.wrenchIcon = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var s = Math.min(w, h);
    /* 构图要点：扳手是**斜跨对角**的（闭口环在左下、开口头在右上）。
       原来靠引擎的 rot=26° 整盒旋转来实现斜跨，
       但整盒旋转会把元素甩出盒角、bbox 也撑不满 ——
       改成画法内部自带 -26° 斜度，落点沿对角线铺开，着墨才填得满盒子。 */
    var Gx = w * 0.11, Gy = h * 0.84;          // 闭口环端
    var Hx = w * 0.89, Hy = h * 0.16;          // 开口头
    var ux = Hx - Gx, uy = Hy - Gy;
    var ul = Math.sqrt(ux * ux + uy * uy); ux /= ul; uy /= ul;
    var ua = Math.atan2(uy, ux);
    var nx = -uy, ny = ux;                    // 垂直方向
    var Ro = s * 0.30;                        // 头外半径
    var slotW = s * 0.115 * (1 + 0.14 * Math.sin(p * TAU()));  // U 口半宽（会张合）
    var root = Ro * 0.42;                     // U 口根
    var ringO = s * 0.180, ringI = s * 0.078;
    var hw = s * 0.128, tw = s * 0.082;       // 把手半宽（头端 / 环端）

    /* 把手：锥形四边形 */
    function handlePath(c, dx, dy) {
      c.beginPath();
      c.save();
      c.translate(dx || 0, dy || 0);
      var ex = Gx + ux * ringO * 0.6, ey = Gy + uy * ringO * 0.6;
      c.moveTo(ex + nx * tw, ey + ny * tw);
      c.lineTo(Hx + nx * hw, Hy + ny * hw);
      c.lineTo(Hx - nx * hw, Hy - ny * hw);
      c.lineTo(ex - nx * tw, ey - ny * tw);
      c.closePath();
      c.restore();
    }
    /* 头：实心圆盘 + U 形缺口（单条闭合轮廓，缺口是真切掉的） */
    function headPath(c, dx, dy) {
      c.beginPath();
      c.save();
      c.translate(dx || 0, dy || 0);
      var beta = Math.asin(Math.min(0.92, slotW / Ro));
      var i, a, x, y;
      /* 从 U 口上沿的圆周点出发 → 切进缺口 → 越过口底 → 切出 → 沿圆周绕回 */
      a = ua + beta;
      x = Hx + Math.cos(a) * Ro; y = Hy + Math.sin(a) * Ro;
      c.moveTo(x, y);
      c.lineTo(Hx + ux * root + nx * slotW, Hy + uy * root + ny * slotW);
      c.lineTo(Hx + ux * root - nx * slotW, Hy + uy * root - ny * slotW);
      a = ua - beta;
      x = Hx + Math.cos(a) * Ro; y = Hy + Math.sin(a) * Ro;
      c.lineTo(x, y);
      /* 沿圆周绕开缺口那一段（反方向走大弧） */
      for (i = 1; i <= 48; i++) {
        a = ua - beta - (i / 48) * (TAU() - 2 * beta);
        c.lineTo(Hx + Math.cos(a) * Ro, Hy + Math.sin(a) * Ro);
      }
      c.closePath();
      c.restore();
    }
    /* 闭口环：外圈 + 反向内圈 → 中间是真空的孔 */
    function ringPath(c, dx, dy) {
      c.beginPath();
      c.save();
      c.translate(dx || 0, dy || 0);
      var i, a, x, y;
      for (i = 0; i <= 36; i++) {
        a = i / 36 * TAU();
        x = Gx + Math.cos(a) * ringO; y = Gy + Math.sin(a) * ringO;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.closePath();
      for (i = 0; i <= 36; i++) {
        a = -i / 36 * TAU();
        x = Gx + Math.cos(a) * ringI; y = Gy + Math.sin(a) * ringI;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.closePath();
      c.restore();
    }

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(0.06 * Math.sin(p * TAU()));
    ctx.translate(-w / 2, -h / 2);

    /* 暗边 → 钢面 → 亮唇 */
    M.stroke(ctx, handlePath, M.pal[3], 5, {});
    M.stroke(ctx, headPath, M.pal[3], 5, {});
    M.stroke(ctx, ringPath, M.pal[3], 5, {});
    M.fill(ctx, handlePath, M.pal[0], { box: { x: Gx, y: Gy, w: Hx - Gx, h: Hy - Gy } });
    M.fill(ctx, headPath, M.pal[0], { box: { x: Hx - Ro, y: Hy - Ro, w: Ro * 2, h: Ro * 2 } });
    M.fill(ctx, ringPath, M.pal[0], { box: { x: Gx - ringO, y: Gy - ringO, w: ringO * 2, h: ringO * 2 } });
    M.stroke(ctx, function (c) { handlePath(c, -1.3, -1.9); }, M.pal[4], 1.3, { alpha: 0.55 });
    M.stroke(ctx, function (c) { headPath(c, -1.3, -1.9); }, M.pal[4], 1.3, { alpha: 0.55 });
    M.stroke(ctx, function (c) { ringPath(c, -1.3, -1.9); }, M.pal[4], 1.3, { alpha: 0.55 });
    ctx.restore();
  };

  /* ===================================================================
     8 铰链扣：一个开了口的搭扣
     左边是带铆钉的底板 + 合页销，扣带从合页翻起来，末端是扣眼，右边是扣柱
     动法：扣带绕合页开合（p=0/1 同为敞开 → 无缝）
     =================================================================== */
  FORM.hingeClip = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    /* 底板占左侧 1/3，扣带从合页翻起来搭到右侧的扣柱上。
       整体要撑满盒子 → 底板加宽、扣带加长、扣柱推到接近右缘。 */
    var baseX = w * 0.02, baseY = h * 0.14, baseW = w * 0.36, baseH = h * 0.68;
    var hx = baseX + baseW * 0.94, hy = h * 0.56;         // 合页轴
    var open = 0.5 * (1 + Math.cos(p * TAU()));           // 1 = 全开
    var ang = -0.95 * open;
    var eyeR = w * 0.080, eyeI = w * 0.040, strapW = w * 0.062, L = w * 0.52;

    /* 底板 */
    steelFace(ctx, function (c) { c.beginPath(); roundRect(c, baseX, baseY, baseW, baseH, 2); },
      M, { x: baseX, y: baseY, w: baseW, h: baseH }, 0.55);
    M.stroke(ctx, function (c) { c.beginPath(); roundRect(c, baseX, baseY, baseW, baseH, 2); },
      M.pal[3], 1.8, {});
    for (var b = 0; b < 2; b++) {
      rivet(ctx, baseX + baseW * 0.5, baseY + baseH * (0.20 + b * 0.60), baseW * 0.10, M, -2.35);
    }

    /* 扣柱：扣上时扣眼正好落在它头上 */
    var kx = hx + L, pr = w * 0.024;
    M.fill(ctx, function (c) { c.beginPath(); c.ellipse(kx, hy + h * 0.24, w * 0.05, h * 0.026, 0, 0, TAU()); },
      M.pal[3], { box: { x: kx - w * 0.06, y: hy + h * 0.20, w: w * 0.12, h: h * 0.09 } });
    M.fill(ctx, function (c) { c.beginPath(); roundRect(c, kx - pr, hy - h * 0.015, pr * 2, h * 0.27, pr); },
      M.pal[3], { box: { x: kx - pr * 1.4, y: hy - h * 0.03, w: pr * 2.8, h: h * 0.30 } });
    M.fill(ctx, function (c) { c.beginPath(); roundRect(c, kx - pr * 0.55, hy - h * 0.008, pr * 1.1, h * 0.26, pr * 0.55); },
      M.pal[0], { box: { x: kx - pr * 1.4, y: hy - h * 0.03, w: pr * 2.8, h: h * 0.30 } });

    /* 扣带：扁条 + 末端扣眼（眼是真孔） */
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(ang);
    function strapPath(c, dx, dy) {
      c.beginPath();
      c.save();
      c.translate(dx || 0, dy || 0);
      var ex = L - eyeR * 0.55;
      c.moveTo(0, -strapW / 2);
      c.lineTo(ex, -strapW / 2);
      c.lineTo(ex, strapW / 2);
      c.lineTo(0, strapW / 2);
      c.closePath();
      var i, a, x, y;
      for (i = 0; i <= 32; i++) {
        a = i / 32 * TAU();
        x = L + Math.cos(a) * eyeR; y = Math.sin(a) * eyeR;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.closePath();
      for (i = 0; i <= 32; i++) {
        a = -i / 32 * TAU();
        x = L + Math.cos(a) * eyeI; y = Math.sin(a) * eyeI;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.closePath();
      c.restore();
    }
    M.stroke(ctx, strapPath, M.pal[3], 3.4, {});
    M.fill(ctx, strapPath, M.pal[0], { box: { x: 0, y: -eyeR, w: L + eyeR, h: eyeR * 2 } });
    M.stroke(ctx, function (c) { strapPath(c, -1.2, -1.6); }, M.pal[4], 1.2, { alpha: 0.55 });
    ctx.restore();

    /* 合页销 */
    M.fill(ctx, function (c) { c.beginPath(); c.arc(hx, hy, w * 0.05, 0, TAU()); },
      M.pal[3], { box: { x: hx - w * 0.06, y: hy - w * 0.06, w: w * 0.12, h: w * 0.12 } });
    M.fill(ctx, function (c) { c.beginPath(); c.arc(hx - w * 0.008, hy - w * 0.01, w * 0.028, 0, TAU()); },
      M.pal[4], { box: { x: hx - w * 0.06, y: hy - w * 0.06, w: w * 0.12, h: w * 0.12 } });
  };

  /* ===================================================================
     9 金属屑：一堆卷曲的金属刨花
     动法：每片刨花各自绕自己的中心转（1/2/3 圈，整周期 → 无缝）
     =================================================================== */
  FORM.metalFilings = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var seed = P.seed || 29;
    var s = Math.min(w, h);
    var n = 6, i;
    for (i = 0; i < n; i++) {
      var t = (i + 0.5) / n;                          // 沿一条弧摊开 → 像一小堆
      var cx = w * (0.14 + 0.70 * t) + (hash(seed, i, 1) - 0.5) * w * 0.07;
      var cy = h * (0.34 + 0.34 * Math.sin(t * Math.PI)) + (hash(seed, i, 2) - 0.5) * h * 0.16;
      var r0 = s * (0.095 + 0.06 * hash(seed, i, 3));
      var turns = 1.15 + 0.25 * hash(seed, i, 4);
      var k = 0.8 * r0 / (turns * TAU());
      var a0 = hash(seed, i, 5) * TAU() + p * TAU() * (1 + (i % 3));
      M.stroke(ctx, function (c) { spiral(c, cx, cy, r0, k, turns, a0, 0.6); },
        M.pal[3], 6, {});
      M.stroke(ctx, function (c) { spiral(c, cx, cy, r0, k, turns, a0, 0.6); },
        M.pal[0], 4, {});
      M.stroke(ctx, function (c) { spiral(c, cx - 1.2, cy - 1.4, r0, k, turns, a0, 0.6); },
        M.pal[4], 1.3, { alpha: 0.75 });
    }
    /* 两条长卷的带状刨花 */
    for (i = 0; i < 2; i++) {
      var bx = w * (0.20 + 0.56 * hash(seed, i, 11));
      var by = h * (0.26 + 0.46 * hash(seed, i, 12));
      var ba = hash(seed, i, 13) * TAU() + p * TAU() * (2 - i);
      var amp = s * 0.11, len2 = s * 0.42;
      function ribbon(c, dx, dy) {
        c.beginPath();
        c.save();
        c.translate(bx + (dx || 0), by + (dy || 0));
        c.rotate(ba);
        c.moveTo(-len2 / 2, 0);
        c.quadraticCurveTo(-len2 / 4, -amp, 0, 0);
        c.quadraticCurveTo(len2 / 4, amp, len2 / 2, 0);
        c.restore();
      }
      M.stroke(ctx, ribbon, M.pal[3], 8, {});
      M.stroke(ctx, ribbon, M.pal[0], 5.4, {});
      M.stroke(ctx, function (c) { ribbon(c, -1.2, -1.4); }, M.pal[4], 1.5, { alpha: 0.75 });
    }
    /* 几片锋利的碎屑 */
    for (i = 0; i < 4; i++) {
      var px = w * (0.14 + 0.72 * hash(seed, i, 6));
      var py = h * (0.18 + 0.64 * hash(seed, i, 7));
      var sz = s * (0.035 + 0.03 * hash(seed, i, 8));
      var ang = hash(seed, i, 9) * TAU() + p * TAU();
      M.fill(ctx, function (c) {
        c.beginPath();
        c.save();
        c.translate(px, py); c.rotate(ang);
        c.moveTo(-sz, 0); c.lineTo(0, -sz * 0.42); c.lineTo(sz * 0.85, 0);
        c.lineTo(0, sz * 0.34);
        c.closePath();
        c.restore();
      }, M.pal[0], { box: { x: px - sz, y: py - sz, w: sz * 2, h: sz * 2 }, alpha: 0.95 });
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.save();
        c.translate(px, py); c.rotate(ang);
        c.moveTo(-sz, 0); c.lineTo(0, -sz * 0.42); c.lineTo(sz * 0.85, 0);
        c.closePath();
        c.restore();
      }, M.pal[4], 0.9, { alpha: 0.8 });
    }
  };

  /* ===================================================================
     10 油桶：带箍的圆油桶，桶身有锈
     动法：桶身缓慢转动（锈斑绕桶一周）+ 桶身轻晃
     =================================================================== */
  FORM.oilDrum = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    /* 这条改成 vbar 竖构图（96×150）——油桶在 460×64 的横条里必然缩成一小点。
       真油桶也是「高比宽大」，所以这里按竖构图给比例：
       桶宽不超过盒宽 84%，桶高 = 桶宽 × 1.55。 */
    var dw = Math.min(w * 0.84, h * 0.60);
    var dh = Math.min(h * 0.90, dw * 1.55);
    var ry = dw * 0.17;
    var cx = w * 0.5, yTop = (h - dh) / 2;
    var yTopc = yTop + ry, yBotc = yTop + dh - ry;
    var seed = P.seed || 37;

    ctx.save();
    ctx.translate(cx, yBotc + ry);
    ctx.rotate(0.022 * Math.sin(p * TAU()));
    ctx.translate(-cx, -(yBotc + ry));

    /* 地面投影 */
    M.fill(ctx, function (c) {
      c.beginPath(); c.ellipse(cx, yBotc + ry * 0.8, dw * 0.60, ry * 0.42, 0, 0, TAU());
    }, M.pal[3], { box: { x: cx - dw * 0.60, y: yBotc, w: dw * 1.2, h: ry * 1.3 }, alpha: 0.4 });

    /* 桶盖 */
    M.fill(ctx, function (c) {
      c.beginPath(); c.ellipse(cx, yTopc, dw / 2, ry, 0, 0, TAU());
    }, M.pal[0], { box: { x: cx - dw / 2, y: yTopc - ry, w: dw, h: ry * 2 } });
    /* 桶身（盖住桶盖前半） */
    steelFace(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - dw / 2, yTopc);
      c.lineTo(cx - dw / 2, yBotc);
      c.ellipse(cx, yBotc, dw / 2, ry, 0, Math.PI, 0, true);
      c.lineTo(cx + dw / 2, yTopc);
      c.ellipse(cx, yTopc, dw / 2, ry, 0, 0, Math.PI, false);
      c.closePath();
    }, M, { x: cx - dw / 2, y: yTopc, w: dw, h: yBotc - yTopc + ry }, 0.62);

    ctx.save();
    ctx.beginPath();
    ctx.rect(cx - dw / 2, yTopc, dw, yBotc - yTopc + ry);
    ctx.clip();
    /* 竖向拉丝 */
    for (var i = 0; i < 9; i++) {
      var vx = cx - dw / 2 + dw * ((i + 0.5) / 9);
      M.stroke(ctx, function (c) {
        c.beginPath(); c.moveTo(vx, yTopc); c.lineTo(vx, yBotc + ry);
      }, M.pal[4], 0.8, { alpha: 0.10 });
    }
    /* 桶箍：三道 */
    var hoopY = [0.20, 0.50, 0.80];
    for (i = 0; i < 3; i++) {
      var hy = yTopc + (yBotc - yTopc) * hoopY[i];
      M.fill(ctx, function (c) { c.beginPath(); c.rect(cx - dw / 2, hy - dh * 0.038, dw, dh * 0.076); },
        M.pal[3], { alpha: 0.85, box: { x: cx - dw / 2, y: hy, w: dw, h: dh * 0.08 } });
      M.stroke(ctx, function (c) { c.beginPath(); c.moveTo(cx - dw / 2, hy - dh * 0.032); c.lineTo(cx + dw / 2, hy - dh * 0.032); },
        M.pal[4], 1.3, { alpha: 0.5 });
    }
    /* 锈斑：随 p 绕桶一周（取模，p=0/1 同位置 → 无缝） */
    for (i = 0; i < 4; i++) {
      var base = hash(seed, i, 1) * dw;
      var rx = cx - dw / 2 + ((base + p * dw) % dw);
      var ry2 = yTopc + (yBotc - yTopc) * (0.16 + 0.66 * hash(seed, i, 2));
      var edge = Math.min((rx - (cx - dw / 2)) / (dw * 0.2), ((cx + dw / 2) - rx) / (dw * 0.2));
      if (edge <= 0) continue;
      rust(ctx, rx, ry2, dh * 0.16 * (0.7 + 0.6 * hash(seed, i, 3)), M, seed + i, 0.52 * edge);
    }
    ctx.restore();

    /* 桶盖圈 + 油口 */
    M.stroke(ctx, function (c) { c.beginPath(); c.ellipse(cx, yTopc, dw / 2 * 0.9, ry * 0.8, 0, 0, TAU()); },
      M.pal[4], 1.3, { alpha: 0.45 });
    M.fill(ctx, function (c) { c.beginPath(); c.ellipse(cx + dw * 0.18, yTopc - ry * 0.18, dw * 0.07, ry * 0.42, 0, 0, TAU()); },
      M.pal[3], { box: { x: cx, y: yTopc - ry, w: dw * 0.4, h: ry * 2 } });
    M.stroke(ctx, function (c) { c.beginPath(); c.ellipse(cx, yTopc, dw / 2, ry, 0, 0, TAU()); },
      M.pal[3], 1.6, {});
    /* 桶身竖边 */
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - dw / 2, yTopc); c.lineTo(cx - dw / 2, yBotc);
      c.moveTo(cx + dw / 2, yTopc); c.lineTo(cx + dw / 2, yBotc);
    }, M.pal[3], 1.6, { alpha: 0.8 });
    ctx.restore();
  };

})(window.Sticker);
