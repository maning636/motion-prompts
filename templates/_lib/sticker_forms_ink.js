/* ============================================================================
   禅意水墨 · 10 个专属画法（v2）
   ----------------------------------------------------------------------------
   这一族的手感是**留白**，但「留白」不是「画得小」——
   元素要撑满元素盒，撑满的**方式**是墨的浓淡，不是把盒子铺满。

   四条手感规矩（这一族真正的差异都在这儿）：
     1. **墨分五色**：同一条素材里要同时看得见焦 / 浓 / 重 / 淡 / 清。
        做法是同一条笔触叠 2~4 层不同 alpha（淡墨垫底洇开 → 主笔 → 焦墨提锋），
        不是所有笔画都用同一个 alpha 的黑。
     2. **枯笔飞白**：笔画内部要断，要露出丝状的白茬。
        做法是**不画白**——把一根笔拆成许多根「丝」，丝与丝之间留真的空隙，
        再让整片丝在某些区段集体缺席（渴笔的白茬）。
     3. **洇墨**：淡墨的边缘要化开。M.stroke 底下自带一层模糊的宽墨，
        用它当「洇」；实心的形则用宽线宽的淡描边垫一层。洇要**克制**——
        洇过头就成了灰雾，不是墨。
     4. **留白**：空的地方必须干净。不铺底纹，不加装饰点。

   调色板：pal[0] 墨黑 / pal[1] 朱砂 / pal[2] 宣纸 / pal[3] 亮白 / pal[4] 灰白
   ============================================================================ */
(function (S) {
  'use strict';
  var FORM = S.FORM;
  var hash = S.hash, TAU = S.TAU, polyPath = S.polyPath, blobPath = S.blobPath;

  /* ------------------------------------------------------------------
     本族小工具
     ------------------------------------------------------------------ */

  /* 墨分五色：焦 / 浓 / 重 / 淡 / 清。
     材质层的 fill 会再乘 0.82，所以这里的数值是「想要的相对浓度」。 */
  var TONE = {
    jiao: 1.00,   // 焦墨：起笔、提锋、点睛
    nong: 0.80,   // 浓墨：主笔
    zhong: 0.56,  // 重墨：第二层
    dan: 0.30,    // 淡墨：远景、洇
    qing: 0.15    // 清墨：最轻的一层
  };

  /* 笔触多边形：给中轴点列 + 每个点的半宽 → 闭合多边形。
     比 lineWidth 有粗细变化真实：兰叶、竹叶、枯笔的丝、皴短线都靠它。 */
  function brushPts(pts, wids) {
    var n = pts.length, l = [], r = [], i, a, b, dx, dy, m, nx, ny;
    for (i = 0; i < n; i++) {
      a = pts[i > 0 ? i - 1 : 0];
      b = pts[i < n - 1 ? i + 1 : n - 1];
      dx = b[0] - a[0]; dy = b[1] - a[1];
      m = Math.sqrt(dx * dx + dy * dy);
      if (m < 1e-6) { m = 1; dx = 1; dy = 0; }
      nx = -dy / m; ny = dx / m;
      l.push([pts[i][0] + nx * wids[i], pts[i][1] + ny * wids[i]]);
      r.push([pts[i][0] - nx * wids[i], pts[i][1] - ny * wids[i]]);
    }
    return l.concat(r.reverse());
  }

  /* 二次贝塞尔采样成点列 */
  function quadPts(x0, y0, cx, cy, x1, y1, n) {
    var out = [], i, t, u;
    for (i = 0; i <= n; i++) {
      t = i / n; u = 1 - t;
      out.push([u * u * x0 + 2 * u * t * cx + t * t * x1,
                u * u * y0 + 2 * u * t * cy + t * t * y1]);
    }
    return out;
  }

  /* 圆环（挖洞）：外圈顺时针 + 内圈逆时针 → nonzero 规则下中间是空的。
     ⚠ 本环境 ctx.fillRule='evenodd' 不生效，M.fill 也不给传规则的入口，
     只能靠**绕向相反**挖洞。内圈前面必须 moveTo，否则会拖出一条连线。 */
  function ringPath(c, cx, cy, rOut, rIn) {
    c.beginPath();
    c.arc(cx, cy, rOut, 0, TAU(), false);
    c.moveTo(cx + rIn, cy);
    c.arc(cx, cy, rIn, 0, TAU(), true);
  }

  /* 手绘感的圆环（挖洞）：外沿和内沿都带轻微起伏，框的粗细不匀。
     外圈顺时针、内圈逆时针 → 中间真的空。 */
  function wobbleRing(c, cx, cy, R, t, n, seed) {
    var i, th, ro, ri, pts = [];
    for (i = 0; i <= n; i++) {
      th = (i / n) * TAU();
      ro = R * (1 + 0.014 * Math.sin(th * 3 + 0.7) + 0.008 * Math.sin(th * 5 - 1.2));
      ri = ro - t * (0.84 + 0.30 * (0.5 + 0.5 * Math.sin(th * 4 + 2.1)));
      pts.push([cx + Math.cos(th) * ro, cy + Math.sin(th) * ro,
                cx + Math.cos(th) * ri, cy + Math.sin(th) * ri]);
    }
    c.beginPath();
    for (i = 0; i <= n; i++) {
      if (i === 0) c.moveTo(pts[i][0], pts[i][1]); else c.lineTo(pts[i][0], pts[i][1]);
    }
    c.closePath();
    c.moveTo(pts[n][2], pts[n][3]);
    for (i = n; i >= 0; i--) c.lineTo(pts[i][2], pts[i][3]);
    c.closePath();
  }

  /* 矩形环（挖洞）：外框顺时针 + 内框逆时针 */
  function rectRing(c, x, y, w, h, t) {
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + w, y); c.lineTo(x + w, y + h); c.lineTo(x, y + h);
    c.closePath();
    var xi = x + t, yi = y + t, wi = w - 2 * t, hi = h - 2 * t;
    c.moveTo(xi, yi);
    c.lineTo(xi, yi + hi); c.lineTo(xi + wi, yi + hi); c.lineTo(xi + wi, yi);
    c.closePath();
  }

  /* 墨线不会笔直：矩形环的内外沿都带轻微抖动（墨的手感，不是锯齿） */
  function roughRectRing(c, x, y, w, h, t, seed) {
    var per = [], i, s, u, bx, by, nx, ny, jo, ji, N = 9;
    for (s = 0; s < 4; s++) {
      for (i = 0; i < N; i++) {
        u = i / N;
        if (s === 0) { bx = x + w * u; by = y; nx = 0; ny = 1; }
        else if (s === 1) { bx = x + w; by = y + h * u; nx = -1; ny = 0; }
        else if (s === 2) { bx = x + w * (1 - u); by = y + h; nx = 0; ny = -1; }
        else { bx = x; by = y + h * (1 - u); nx = 1; ny = 0; }
        jo = (hash(seed, s, i) - 0.5) * 2.0;            // 外沿抖动
        ji = (hash(seed, s, i + 50) - 0.5) * 1.7;        // 内沿抖动
        per.push([bx + nx * jo, by + ny * jo,
                  bx + nx * (ji - t), by + ny * (ji - t)]);
      }
    }
    c.beginPath();
    for (i = 0; i < per.length; i++) {
      if (i === 0) c.moveTo(per[i][0], per[i][1]); else c.lineTo(per[i][0], per[i][1]);
    }
    c.closePath();
    c.moveTo(per[per.length - 1][2], per[per.length - 1][3]);
    for (i = per.length - 1; i >= 0; i--) c.lineTo(per[i][2], per[i][3]);
    c.closePath();
  }

  /* 框周取点：u=0..1 绕矩形一圈。
     返回 [外点x, 外点y, 切线x, 切线y, 内法线x, 内法线y] */
  function framePoint(x, y, w, h, t, u) {
    var per = 2 * (w + h), s = u * per, px, py, tx, ty, nx, ny;
    if (s < w) { px = x + s; py = y; tx = 1; ty = 0; nx = 0; ny = 1; }
    else if ((s -= w) < h) { px = x + w; py = y + s; tx = 0; ty = 1; nx = -1; ny = 0; }
    else if ((s -= h) < w) { px = x + w - s; py = y + h; tx = -1; ty = 0; nx = 0; ny = -1; }
    else { s -= w; px = x; py = y + h - s; tx = 0; ty = -1; nx = 1; ny = 0; }
    return [px, py, tx, ty, nx, ny];
  }

  /* 框上的一段：外沿 + 内沿夹成的带子（u0..u1 是框周参数） */
  function bandSeg(c, x, y, w, h, t, u0, u1) {
    var N = 14, i, u, po, pts = [];
    for (i = 0; i <= N; i++) {
      u = u0 + (u1 - u0) * (i / N);
      po = framePoint(x, y, w, h, t, u);
      pts.push([po[0], po[1], po[0] + po[4] * t, po[1] + po[5] * t]);
    }
    c.beginPath();
    for (i = 0; i < pts.length; i++) {
      if (i === 0) c.moveTo(pts[i][0], pts[i][1]); else c.lineTo(pts[i][0], pts[i][1]);
    }
    for (i = pts.length - 1; i >= 0; i--) c.lineTo(pts[i][2], pts[i][3]);
    c.closePath();
  }

  /* 实心多边形（一次 fill） */
  function fillPts(ctx, pts, M, color, alpha) {
    M.fill(ctx, function (c) { polyPath(c, pts); c.closePath(); },
      color || M.pal[0], { alpha: alpha });
  }

  /* 洇墨：沿一条路径垫一层模糊的宽淡墨（M.stroke 底下自带洇墨层） */
  function wash(ctx, pathFn, M, lw, alpha, color) {
    M.stroke(ctx, pathFn, color || M.pal[0], lw, { alpha: alpha });
  }

  /* ====================================================================
     1 一笔兰 —— 一笔写成的兰叶，笔锋收得很细
     三片兰叶从同一丛根上起笔：一片向左拱出去再甩回来（兰叶的经典弧），
     一片几乎竖直，一片低低掠过。叶尖上是三点兰蕊。
     风过时叶子极轻地摆一下。
     ==================================================================== */
  FORM.orchidStroke = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, i, j;
    var A = p * TAU();

    var leaves = [
      /* 长锋：向左拱出去，笔势再甩向右 */
      { x0: 0.20, y0: 0.99, cx: 0.13, cy: 0.42, x1: 0.78, y1: 0.10, hw: 6.4, ph: 0.0, a: 1.00 },
      /* 短锋：几乎竖直的一撇 */
      { x0: 0.24, y0: 0.99, cx: 0.31, cy: 0.44, x1: 0.43, y1: 0.05, hw: 4.7, ph: 2.1, a: 0.78 },
      /* 远锋：低低掠出去的一片，最淡 */
      { x0: 0.19, y0: 0.99, cx: 0.62, cy: 0.78, x1: 0.97, y1: 0.52, hw: 4.4, ph: 4.2, a: 0.62 }
    ];

    for (i = 0; i < leaves.length; i++) {
      var L = leaves[i];
      var rx = L.x0 * w, ry = L.y0 * h;
      var ang = 0.045 * Math.sin(A + L.ph);            // 叶随风轻摆
      var ca = Math.cos(ang), sa = Math.sin(ang);
      var pts = quadPts(rx, ry, L.cx * w, L.cy * h, L.x1 * w, L.y1 * h, 28);
      for (j = 0; j < pts.length; j++) {                // 绕根微转
        var dx = pts[j][0] - rx, dy = pts[j][1] - ry;
        pts[j][0] = rx + dx * ca - dy * sa;
        pts[j][1] = ry + dx * sa + dy * ca;
      }
      /* 笔锋：中段最粗，末端收成一根细尖 */
      var wids = [];
      for (j = 0; j < pts.length; j++) {
        var u = j / (pts.length - 1);
        wids.push(L.hw * Math.sin(Math.pow(u, 0.72) * Math.PI));
      }
      var poly = brushPts(pts, wids);

      /* 淡墨垫底：洇开的边缘（要轻，不然就成了灰雾） */
      wash(ctx, function (c) { polyPath(c, poly); c.closePath(); }, M, 6, 0.055);
      /* 主笔 */
      fillPts(ctx, poly, M, M.pal[0], L.a);
      /* 焦墨中锋：提出来的那一根骨线 */
      M.stroke(ctx, function (c) { polyPath(c, pts); },
        M.pal[0], 1.1, { alpha: 0.18 + L.a * 0.34 });
    }

    /* 兰蕊：叶尖上三点浓墨 */
    var dots = [[0.745, 0.175, 2.0], [0.795, 0.125, 1.7], [0.835, 0.195, 1.4]];
    for (i = 0; i < dots.length; i++) {
      M.particle(ctx, dots[i][0] * w, dots[i][1] * h, dots[i][2], M.pal[0],
        { alpha: 0.78 + 0.16 * Math.sin(A + i * 1.4) });
    }
  };

  /* ====================================================================
     2 远山淡墨 —— 三道远山的淡墨轮廓
     远的一层最小最淡，近的一层最大最浓；山与山之间留着白，那是雾。
     山形用「有峰有谷」的真山头（取最大值，不是高斯相加），
     皴笔一律挂在山脊上，不乱撒。
     ==================================================================== */
  FORM.distantMountains = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1802;
    var A = p * TAU();

    /* 山脊：几个山头叠出来（取最大值 → 有峰有谷，不是一片土馒头） */
    function ridge(u, sd, n) {
      var y = 0, i, c, hq, wd, e, v, pw;
      for (i = 0; i < n; i++) {
        c = 0.08 + hash(sd, i, 1) * 0.84;
        hq = 0.46 + hash(sd, i, 2) * 0.54;
        wd = 0.060 + hash(sd, i, 3) * 0.100;
        pw = 1.05 + hash(sd, i, 4) * 0.95;      // 有的山头陡，有的圆
        e = Math.abs(u - c) / wd;
        if (e < 1) {
          v = Math.pow(1 - e, pw);
          if (v * hq > y) y = v * hq;
        }
      }
      return y;
    }

    var layers = [
      { base: 0.58, amp: 0.44, a: TONE.qing, wash: 0.075, sd: seed + 1, n: 3, lw: 1.7, depth: 0.09, ph: 0.4 },
      { base: 0.80, amp: 0.40, a: TONE.dan, wash: 0.095, sd: seed + 2, n: 3, lw: 2.2, depth: 0.10, ph: 2.3 },
      { base: 1.02, amp: 0.36, a: TONE.zhong, wash: 0.120, sd: seed + 3, n: 2, lw: 2.8, depth: 0.11, ph: 4.1 }
    ];

    for (var L = 0; L < layers.length; L++) {
      var ly = layers[L];
      var breathe = 1 + 0.10 * Math.sin(A - L * 0.9);
      var N = 64, line = [], i, u;
      for (i = 0; i <= N; i++) {
        u = i / N;
        line.push([w * (0.005 + u * 0.99), h * (ly.base - ly.amp * ridge(u, ly.sd, ly.n))]);
      }
      /* 山体：压在山脊下面一帯，下沿是另一条山形的轮廓（化进雾里，
         千万不能是正弦 —— 那会排成一排锯齿，像装饰花纹） */
      var body = line.slice();
      for (i = line.length - 1; i >= 0; i--) {
        var uu = i / N;
        body.push([line[i][0],
                   line[i][1] + h * ly.depth * (0.35 + 1.05 * ridge(uu, ly.sd + 500, ly.n))]);
      }
      fillPts(ctx, body, M, M.pal[0], ly.wash);
      /* 轮廓线 */
      M.stroke(ctx, function (c) { polyPath(c, line); },
        M.pal[0], ly.lw, { alpha: ly.a * breathe });

      /* 皴：挂在山脊上的短笔，顺着坡面往下（远山少皴，近山多皴） */
      var cn = 2 + L * 3;
      for (i = 0; i < cn; i++) {
        var u2 = 0.05 + hash(ly.sd, i, 11) * 0.90;
        var yy = h * (ly.base - ly.amp * ridge(u2, ly.sd, ly.n));
        var xx = w * (0.005 + u2 * 0.99);
        /* 坡的走向：皴笔顺着坡面，不是直上直下 */
        var dy = h * (ly.base - ly.amp * ridge(u2 + 0.02, ly.sd, ly.n))
               - h * (ly.base - ly.amp * ridge(u2 - 0.02, ly.sd, ly.n));
        var dx = w * 0.04;
        var sl = -dy / (2 * dx);
        var len = h * (0.015 + hash(ly.sd, i, 12) * 0.038);
        M.stroke(ctx, function (c) {
          c.beginPath();
          c.moveTo(xx, yy + 1);
          c.lineTo(xx + len * sl * 0.8, yy + len);
        }, M.pal[0], 0.8 + hash(ly.sd, i, 14) * 0.9,
          { alpha: (0.06 + hash(ly.sd, i, 15) * 0.14) * (0.6 + L * 0.4) });
      }
    }
  };

  /* ====================================================================
     3 枯笔飞白 —— 横着的一道枯笔，中间断开
     一根枯笔 = 许多根「丝」。丝与丝之间是**真的空**（不画白），
     整片丝在两处集体缺席＝飞白的白茬；正中整条断开＝断笔。
     笔锋越往右越枯：丝越来越少、越来越淡。
     ==================================================================== */
  FORM.dryBrushStreak = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1803;
    var A = p * TAU();

    var maxHalf = h * 0.235;                // 笔的半厚
    function axisY(u) {
      return h * 0.47 - Math.sin(u * Math.PI) * h * 0.055
        + Math.sin(u * 2.4 + A) * h * 0.012;
    }
    function axisX(u) { return w * (0.035 + u * 0.93); }
    function half(u) { return maxHalf * (0.95 - 0.22 * u); }

    var brkS = 0.455, brkE = 0.510;         // 断口（窄断口，两边仍是一道笔）

    /* 洇：断口两边各垫一条宽淡墨（要轻，重了就成了灰雾） */
    for (var seg = 0; seg < 2; seg++) {
      var u0 = seg === 0 ? 0.02 : brkE, u1 = seg === 0 ? brkS : 0.985;
      M.stroke(ctx, function (c) {
        var q, uu, k = 20;
        for (q = 0; q <= k; q++) {
          uu = u0 + (u1 - u0) * (q / k);
          if (q === 0) c.moveTo(axisX(uu), axisY(uu));
          else c.lineTo(axisX(uu), axisY(uu));
        }
      }, M.pal[0], h * 0.16, { alpha: 0.012 });
    }

    var NH = 28;                            // 丝的数量
    for (var i = 0; i < NH; i++) {
      var oy = (i / (NH - 1) - 0.5) * 2;    // 丝在笔幅里的位置 -1..1
      var hw0 = 0.42 + hash(seed, i, 21) * 0.80;   // 单根丝的粗细
      var drift = 0.012 * Math.sin(A + i * 0.7);    // 丝缕在纸上极缓地蹭
      var bs = brkS + (hash(seed, i, 3) - 0.5) * 0.045;
      var be = brkE + (hash(seed, i, 4) - 0.5) * 0.045;

      /* 这根丝在哪些区段还留着 */
      var alive = [], u = 0.012 + hash(seed, i, 1) * 0.03, kk = 0;
      while (u < 0.988 && kk < 60) {
        var len = 0.10 + hash(seed, i, 30 + kk) * 0.24;
        var e = Math.min(0.988, u + len);
        alive.push([u, e]);
        u = e + 0.006 + hash(seed, i, 60 + kk) * 0.028 + drift * 0.5;
        kk++;
      }

      for (var a = 0; a < alive.length; a++) {
        var s = alive[a][0], ee = alive[a][1];
        var pieces = [];
        if (s < bs) pieces.push([s, Math.min(ee, bs)]);
        if (ee > be) pieces.push([Math.max(s, be), ee]);
        for (var b = 0; b < pieces.length; b++) {
          var ps = pieces[b][0], pe = pieces[b][1];
          if (pe - ps < 0.012) continue;
          var mid = (ps + pe) / 2;
          /* 飞白区：整段丝的集体缺席 —— 这就是露出来的白茬 */
          var survive = 1;
          if (mid > 0.150 && mid < 0.340) survive = hash(seed, i, 7) > 0.42;
          else if (mid > 0.630 && mid < 0.810) survive = hash(seed, i, 8) > 0.52;
          /* 越往右笔越枯：右端只有少数几丝还活着 */
          if (mid > 0.86) survive = hash(seed, i, 15) > 0.66;
          if (!survive) continue;
          /* 画这一小段丝 */
          var pts = [], wids = [], q2, k2 = 8;
          for (q2 = 0; q2 <= k2; q2++) {
            var uu = ps + (pe - ps) * (q2 / k2);
            pts.push([axisX(uu), axisY(uu) + oy * half(uu)]);
            var tp = Math.min(1, Math.sin(Math.PI * (q2 / k2)) * 1.7 + 0.12);
            wids.push(hw0 * tp);
          }
          /* 靠边的丝更干（笔锋边缘吃不到墨） */
          var edge = 1 - 0.40 * Math.abs(oy);
          var al = (0.32 + hash(seed, i, 9) * 0.56) * edge * (1 - 0.28 * mid);
          var poly = brushPts(pts, wids);
          fillPts(ctx, poly, M, M.pal[0], al);
          /* 两根焦墨：笔心最浓的两丝 */
          if (i === 6 || i === 17) {
            M.stroke(ctx, function (c) { polyPath(c, pts); },
              M.pal[0], 1.2, { alpha: TONE.jiao * 0.85 });
          }
        }
      }
    }

    /* 墨点：枯笔甩出来的几滴（贴着笔迹，不乱飞） */
    for (var m = 0; m < 10; m++) {
      var mu = 0.05 + hash(seed, m, 31) * 0.90;
      var mx = w * (0.035 + mu * 0.93);
      var my = axisY(mu) + (hash(seed, m, 32) - 0.5) * h * 0.30;
      M.particle(ctx, mx, my, 0.7 + hash(seed, m, 33) * 1.4, M.pal[0],
        { alpha: 0.16 + hash(seed, m, 34) * 0.32 });
    }
  };

  /* ====================================================================
     4 朱砂印 —— 一方朱红篆印，边缘有缺口
     白文印：印面朱红，字与边线是留出来的纸白。
     印泥不匀（深浅斑 + 空点的麻点），边缘啃掉几口，蘸印时还会呼吸。
     ==================================================================== */
  FORM.vermilionSeal = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1804;
    var A = p * TAU();

    var side = Math.min(w, h) * 0.80;
    var x = (w - side) / 2, y = (h - side) / 2;
    var cx = x + side / 2, cy = y + side / 2;

    /* 印面轮廓：四边都啃掉几口（缺口是往里凹的） */
    var per = [], s, i, u, bx, by, nx, ny, chip;
    for (s = 0; s < 4; s++) {
      for (i = 0; i < 10; i++) {
        u = i / 10;
        if (s === 0) { bx = x + side * u; by = y; nx = 0; ny = 1; }
        else if (s === 1) { bx = x + side; by = y + side * u; nx = -1; ny = 0; }
        else if (s === 2) { bx = x + side * (1 - u); by = y + side; nx = 0; ny = -1; }
        else { bx = x; by = y + side * (1 - u); nx = 1; ny = 0; }
        chip = 0;
        var hv = hash(seed, s * 10 + i, 1);
        if (hv > 0.70) chip = (hv - 0.70) / 0.30 * side * 0.12;
        per.push([bx + nx * chip, by + ny * chip]);
      }
    }
    var sealPath = function (c) { polyPath(c, per); c.closePath(); };

    /* 洇：朱砂在纸上洇开的一圈（轻） */
    wash(ctx, sealPath, M, 6, 0.05, M.pal[1]);

    /* 印面 */
    var press = 0.82 + 0.12 * Math.sin(A);
    fillPts(ctx, per, M, M.pal[1], press);

    /* 印泥不匀：深斑 + 空点的麻点 */
    for (var k = 0; k < 5; k++) {
      var px = cx + (hash(seed, k, 5) - 0.5) * side * 0.60;
      var py = cy + (hash(seed, k, 6) - 0.5) * side * 0.60;
      M.fill(ctx, function (c) {
        blobPath(c, px, py, side * (0.07 + hash(seed, k, 7) * 0.09), 7, seed + k, 0.42, 1);
      }, M.pal[1], { alpha: 0.26 + 0.10 * Math.sin(A + k) });
    }
    for (var n = 0; n < 6; n++) {
      var qx = x + side * (0.10 + hash(seed, n, 8) * 0.80);
      var qy = y + side * (0.10 + hash(seed, n, 9) * 0.80);
      M.fill(ctx, function (c) {
        c.beginPath();
        c.arc(qx, qy, 0.8 + hash(seed, n, 10) * 1.5, 0, TAU());
      }, M.pal[2], { alpha: 0.40 });
    }

    /* 白文的边线（留出来的纸白） */
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.rect(x + side * 0.085, y + side * 0.085, side * 0.83, side * 0.83);
    }, M.pal[2], 2.0, { alpha: 0.78 });

    /* 印文：字是刻掉的，露纸白 */
    var label = P.label || '印';
    var nCh = label.length;
    var charA = 0.88 + 0.08 * Math.sin(A + 0.6);
    if (nCh === 1) {
      M.text(ctx, label.charAt(0), cx, cy + side * 0.01, side * 0.46, M.pal[2],
        { alpha: charA });
    } else {
      /* 两字以上：右起竖排，印面按字数分列 */
      var cols = nCh > 2 ? 2 : 1;
      var perCol = Math.ceil(nCh / cols);
      var fs = side * (cols > 1 ? 0.34 : 0.40);
      for (i = 0; i < nCh; i++) {
        var cc = Math.floor(i / perCol), rr = i % perCol;
        var colX = cols === 1 ? cx : cx + side * (0.22 - cc * 0.44);
        var rowY = cy + (rr - (perCol - 1) / 2) * fs * 1.08;
        M.text(ctx, label.charAt(i), colX, rowY, fs, M.pal[2], { alpha: charA });
      }
    }
  };

  /* ====================================================================
     5 竹枝 —— 一根带节的竹枝，竹叶在抖
     竹竿斜贯画面，三个节；每节上长出一组「个」字竹叶。
     叶是窄长的柳叶形，略带一点弧，不弯成钩。
     叶尖各自以不同的相位轻颤，是这一条唯一在动的地方。
     ==================================================================== */
  FORM.bambooBranch = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1805;
    var A = p * TAU();

    var x0 = w * 0.06, y0 = h * 0.92;
    var x1 = w * 0.94, y1 = h * 0.30;
    var cxp = w * 0.40, cyp = h * 0.70;
    var sway = Math.sin(A) * 1.3;

    function culm(u) {
      var t = u, uu = 1 - t;
      return [uu * uu * x0 + 2 * uu * t * cxp + t * t * x1 + sway * t,
              uu * uu * y0 + 2 * uu * t * cyp + t * t * y1];
    }

    /* 竹竿：中段略粗，边缘带一点干墨的毛。

       竹皮的干笔白茬必须是**真的空**，让底色透过来 ——
       原来用纸色 M.pal[2] 实色画这几道竖纹，叠到深色视频上
       就是一条米色亮痕，非常扎眼。
       做法：竹竿**分段画**，段与段之间留出细缝（缝就是飞白）。 */
    var segs = [[0.00, 0.10], [0.12, 0.40], [0.42, 0.69], [0.71, 1.00]];
    var i, j;
    for (var si = 0; si < segs.length; si++) {
      var s0 = segs[si][0], s1 = segs[si][1];
      var spts = [], swids = [], q2;
      for (q2 = 0; q2 <= 12; q2++) {
        var uu = s0 + (s1 - s0) * (q2 / 12);
        var cc = culm(uu);
        spts.push(cc);
        swids.push(4.6 + 1.4 * Math.sin(uu * Math.PI * 0.9) - uu * 1.0);
      }
      var spoly = brushPts(spts, swids);
      wash(ctx, function (c) { polyPath(c, spoly); c.closePath(); }, M, 6, 0.05);
      fillPts(ctx, spoly, M, M.pal[0], TONE.nong);
    }

    /* 竹节：节处一道短横，比竿身浓 */
    var nodes = [0.25, 0.58, 0.87];
    for (i = 0; i < nodes.length; i++) {
      var np = culm(nodes[i]);
      var p1 = culm(Math.max(0, nodes[i] - 0.02));
      var p2 = culm(Math.min(1, nodes[i] + 0.02));
      var tx = p2[0] - p1[0], ty = p2[1] - p1[1];
      var m = Math.sqrt(tx * tx + ty * ty) || 1;
      var nx = -ty / m, ny = tx / m;
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(np[0] - nx * 8.5, np[1] - ny * 8.5);
        c.lineTo(np[0] + nx * 8.5, np[1] + ny * 8.5);
      }, M.pal[0], 2.6, { alpha: TONE.jiao });
    }

    /* 竹叶：每一组三到四片，「个」字形（窄长，不弯成钩） */
    var groups = [
      { u: 0.25, leaves: [[-1.95, 52, 3.0, 0.14], [-1.45, 58, 3.3, 0.09], [-1.02, 54, 3.0, 0.11], [0.72, 44, 2.6, -0.10]] },
      { u: 0.58, leaves: [[-0.98, 56, 3.1, 0.12], [-0.52, 60, 3.4, 0.07], [-0.08, 54, 2.9, 0.10]] },
      { u: 0.87, leaves: [[-0.92, 46, 2.8, 0.11], [-0.46, 50, 3.1, 0.06], [0.02, 42, 2.6, 0.09]] }
    ];

    for (var gi = 0; gi < groups.length; gi++) {
      var G = groups[gi];
      var gp = culm(G.u);
      for (var li = 0; li < G.leaves.length; li++) {
        var L = G.leaves[li];
        /* 叶尖在抖：每片叶自己的相位 */
        var ang = L[0] + 0.10 * Math.sin(A + gi * 1.3 + li * 1.9);
        var len = L[1] * (1 + 0.03 * Math.sin(A * 2 + li * 0.8));
        var wid = L[2], bend = L[3];
        var pts = [], wids = [], n = 18, t2;
        for (j = 0; j <= n; j++) {
          t2 = j / n;
          var dd = len * t2;
          var aa = ang + bend * t2 * t2;
          pts.push([gp[0] + Math.cos(aa) * dd, gp[1] + Math.sin(aa) * dd]);
          /* 竹叶：根部窄（接在竹枝上），中段略宽，笔锋收成尖 */
          wids.push(wid * (0.30 + 0.85 * Math.sin(Math.pow(t2, 0.80) * Math.PI))
            * (1 - Math.pow(t2, 6)));
        }
        var poly = brushPts(pts, wids);
        var leafA = 0.58 + hash(seed, gi, li) * 0.38;
        /* 淡墨垫底 */
        wash(ctx, function (c) { polyPath(c, poly); c.closePath(); }, M, 4, 0.05);
        fillPts(ctx, poly, M, M.pal[0], leafA);
        /* 叶脉：只给最浓的一片提一脉焦墨 */
        if (li === 1) {
          M.stroke(ctx, function (c) { polyPath(c, pts); },
            M.pal[0], 0.9, { alpha: 0.55 });
        }
      }
    }
  };

  /* ====================================================================
     6 圆窗月 —— 一个圆窗，窗里一轮月
     窗框是挖了洞的圆环（外圈顺时针 + 内圈逆时针），中间真的透。
     框是手画的：粗细不匀、边缘有起伏，不是一个规规矩矩的圆。
     洞里是小小的一幅淡墨：月、远山、一缕云。云在窗里慢慢横过月面。
     ==================================================================== */
  FORM.moonWindow = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1806;
    var A = p * TAU();

    var cx = w * 0.5, cy = h * 0.5;
    var R = Math.min(w, h) * 0.47;
    var t = R * 0.125;                // 窗框厚度

    /* ---- 窗里的景（先画，窗框压在上面）---- */
    /* 天：极淡的一层灰 */
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, R * 0.80, 0, TAU()); },
      M.pal[4], { alpha: 0.06 + 0.02 * Math.sin(A) });

    /* 月：一轮淡月，带一圈晕 */
    var mx = cx - R * 0.17, my = cy - R * 0.34, mr = R * 0.25;
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(mx, my, mr, 0, TAU()); },
      M.pal[4], 8, { alpha: 0.11 + 0.04 * Math.sin(A) });
    M.fill(ctx, function (c) {
      blobPath(c, mx, my, mr, 9, seed + 2, 0.05, 1);
    }, M.pal[3], { alpha: 0.82 });
    /* 月边的一线淡墨：让月不是一块死白的圆饼 */
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.arc(mx, my, mr, 0.55, 2.6);
    }, M.pal[0], 1.1, { alpha: 0.22 });

    /* 远山：两折淡墨，藏在窗底 */
    var r1 = [], r2 = [], i, u;
    for (i = 0; i <= 14; i++) {
      u = i / 14;
      r1.push([cx + R * (-0.58 + u * 0.94), cy + R * (0.36 - 0.26 * Math.sin(u * Math.PI * 0.9))]);
      r2.push([cx + R * (-0.60 + u * 1.12), cy + R * (0.58 - 0.30 * Math.sin(u * Math.PI * 1.15 + 0.5))]);
    }
    /* 山脚的一片淡墨，把山根压住 */
    var foot = r2.slice();
    for (i = r2.length - 1; i >= 0; i--) foot.push([r2[i][0], cy + R * 0.80]);
    fillPts(ctx, foot, M, M.pal[0], 0.13);
    M.stroke(ctx, function (c) { polyPath(c, r1); },
      M.pal[0], 1.7, { alpha: 0.28 });
    M.stroke(ctx, function (c) { polyPath(c, r2); },
      M.pal[0], 2.3, { alpha: 0.46 });
    /* 山上的皴 */
    for (i = 0; i < 10; i++) {
      var bx = cx + R * (-0.52 + hash(seed, i, 3) * 1.04);
      var by = cy + R * (0.40 + hash(seed, i, 4) * 0.16);
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(bx, by);
        c.lineTo(bx + (hash(seed, i, 7) - 0.5) * 3, by + 4 + hash(seed, i, 5) * 5);
      }, M.pal[0], 0.9, { alpha: 0.14 + hash(seed, i, 6) * 0.22 });
    }

    /* 云：一缕淡墨，慢慢横过月面 */
    var cl = [], cu;
    for (i = 0; i <= 18; i++) {
      cu = i / 18;
      cl.push([cx + R * (-0.60 + cu * 1.20),
               cy + R * (-0.08 + 0.05 * Math.sin(cu * 6.0 + A))]);
    }
    M.stroke(ctx, function (c) { polyPath(c, cl); },
      M.pal[0], 2.4, { alpha: 0.15 + 0.05 * Math.sin(A + 1.2) });

    /* ---- 窗框（压在上面）---- */
    /* 洇：窗框洇进纸里的一圈（轻） */
    M.stroke(ctx, function (c) { wobbleRing(c, cx, cy, R, t, 72, seed); },
      M.pal[0], 7, { alpha: 0.055 + 0.025 * Math.sin(A + 0.4) });
    /* 框：外圈顺时针 + 内圈逆时针 → 中间真的挖空 */
    M.fill(ctx, function (c) { wobbleRing(c, cx, cy, R, t, 72, seed); },
      M.pal[0], { alpha: 0.60 + 0.12 * Math.sin(A) });

    /* 框上焦墨的一段：同一圈框，浓淡不匀。
       ⚠ 这里外弧和内弧必须**连成一条闭合曲线**（用 lineTo 收口），
       用 moveTo 会把弧拆成两个子路径 → 填出来是一块饼形，直杠杠地切过窗里。 */
    M.fill(ctx, function (c) {
      var N = 26, i, th, ro, ri, pts = [];
      for (i = 0; i <= N; i++) {
        th = -0.9 + (i / N) * 2.1;
        ro = R * (1 + 0.014 * Math.sin(th * 3 + 0.7) + 0.008 * Math.sin(th * 5 - 1.2));
        ri = ro - t * (0.84 + 0.30 * (0.5 + 0.5 * Math.sin(th * 4 + 2.1)));
        pts.push([cx + Math.cos(th) * ro, cy + Math.sin(th) * ro,
                  cx + Math.cos(th) * ri, cy + Math.sin(th) * ri]);
      }
      c.beginPath();
      for (i = 0; i <= N; i++) {
        if (i === 0) c.moveTo(pts[i][0], pts[i][1]); else c.lineTo(pts[i][0], pts[i][1]);
      }
      c.lineTo(pts[N][2], pts[N][3]);              // 半径方向收口
      for (i = N; i >= 0; i--) c.lineTo(pts[i][2], pts[i][3]);
      c.closePath();
    }, M.pal[0], { alpha: 0.85 });

    /* 框上的皴：短短的干墨，让窗框有手写的毛边 */
    for (var k = 0; k < 30; k++) {
      var a = (k / 30) * TAU() + hash(seed, k, 3) * 0.2;
      var rr = R - t * 0.45 + (hash(seed, k, 4) - 0.5) * t * 0.8;
      var len = 0.09 + hash(seed, k, 5) * 0.18;
      var ax = cx + Math.cos(a) * rr, ay = cy + Math.sin(a) * rr;
      var bx2 = cx + Math.cos(a + len) * (rr + 1.2), by2 = cy + Math.sin(a + len) * (rr + 1.2);
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(ax, ay); c.lineTo(bx2, by2);
      }, M.pal[0], 0.8 + hash(seed, k, 6) * 1.0,
        { alpha: 0.16 + hash(seed, k, 7) * 0.34 });
    }
  };

  /* ====================================================================
     7 流水横皴 —— 横着的水纹，一道道
     三道长长的水纹轮廓线横贯画面，线与线之间是短促的横皴——
     皴笔**顺着水纹走**，所以看起来是水在流，不是一堆横线。
     水纹整体在缓慢地起伏。
     ==================================================================== */
  FORM.waterRipple = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1807;
    var A = p * TAU();

    /* 三道水纹的轮廓：y 随 u 起伏，形状在时间里缓缓推过 */
    function waveY(base, u, ph, amp) {
      return base + Math.sin(u * 2.4 * TAU() - A + ph) * amp
        + Math.sin(u * 5.3 * TAU() + A * 0.5 + ph) * amp * 0.30;
    }
    var lines = [
      { base: h * 0.19, ph: 0.0, a: 0.55, hw: 1.1 },
      { base: h * 0.50, ph: 2.0, a: 0.40, hw: 0.9 },
      { base: h * 0.81, ph: 4.1, a: 0.28, hw: 0.8 }
    ];

    for (var L = 0; L < lines.length; L++) {
      var ln = lines[L];
      var pts = [], wids = [], i, u;
      for (i = 0; i <= 44; i++) {
        u = i / 44;
        pts.push([w * (0.02 + u * 0.96), waveY(ln.base, u, ln.ph, h * 0.045)]);
        wids.push(ln.hw * (0.35 + 0.65 * Math.sin(u * Math.PI)));
      }
      var poly = brushPts(pts, wids);
      fillPts(ctx, poly, M, M.pal[0], ln.a);
    }

    /* 横皴：一道道几乎平直的短笔，横着排。
       这是「横皴」二字的字面意思 —— 平行于水面的短横笔，
       密处成带、疏处留白，水就从这些笔里流过去了。 */
    for (var b = 0; b < 4; b++) {
      var by = h * (0.12 + b * 0.245);
      var cn = 9 + (b % 2) * 3;
      for (var j = 0; j < cn; j++) {
        var su = hash(seed, b, j);
        var slen = 0.09 + hash(seed, b + 9, j) * 0.22;
        var sx = w * (-0.02 + su * 0.94);
        if (sx + w * slen > w * 0.99) slen = (w * 0.99 - sx) / w;
        if (slen < 0.05) continue;
        /* 这一排整体随水起伏 */
        var off = (hash(seed, b + 9, j + 20) - 0.5) * h * 0.055;
        var sp = [], sw = [], k, u2;
        for (k = 0; k <= 8; k++) {
          u2 = k / 8;
          sp.push([sx + w * slen * u2,
                   by + off + Math.sin(u2 * Math.PI) * (1.2 + hash(seed, b + 9, j + 40) * 2.2)
                     + Math.sin(A + b * 1.7 + u2 * 2.0) * h * 0.006]);
          sw.push((0.40 + hash(seed, b + 9, j + 60) * 0.55)
            * Math.min(1, Math.sin(u2 * Math.PI) * 1.9 + 0.1));
        }
        var poly2 = brushPts(sp, sw);
        fillPts(ctx, poly2, M, M.pal[0], (0.20 + hash(seed, b + 9, j + 80) * 0.52));
      }
    }

    /* 皴点：几粒浓墨点在水纹之间 */
    for (var d = 0; d < 9; d++) {
      var dx = w * (0.05 + hash(seed, d, 71) * 0.90);
      var dy = h * (0.07 + hash(seed, d, 72) * 0.86);
      M.particle(ctx, dx, dy, 0.7 + hash(seed, d, 73) * 1.3, M.pal[0],
        { alpha: 0.14 + hash(seed, d, 74) * 0.28 });
    }
  };

  /* ====================================================================
     8 留白框 —— 四周留白、中间什么都没有的框
     框线要粗、要实、四角完整（不是虚线），框内**真的什么都没有**。
     浓淡靠三层套框做出来（外沿淡 → 主笔浓 → 笔心积墨最浓），
     框上有一处「湿墨」在缓慢游走。全部用 fill，不用描边 ——
     描边自带洇墨，会渗进框里，框内就不干净了。
     ==================================================================== */
  FORM.blankFrame = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1808;
    var A = p * TAU();

    var fx = w * 0.035, fy = h * 0.045;
    var fw = w - fx * 2, fh = h - fy * 2;

    /* 洇：框外洇开的一圈淡墨（只描外框，不碰框内） */
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.rect(fx, fy, fw, fh);
    }, M.pal[0], 12, { alpha: 0.055 + 0.025 * Math.sin(A) });

    /* 三层套框：外沿淡、主笔浓、笔心积墨 —— 浓淡过渡全在框的厚度里 */
    M.fill(ctx, function (c) { roughRectRing(c, fx, fy, fw, fh, 13, seed); },
      M.pal[0], { alpha: 0.17 + 0.05 * Math.sin(A) });
    M.fill(ctx, function (c) { roughRectRing(c, fx, fy, fw, fh, 8.5, seed); },
      M.pal[0], { alpha: 0.95 });
    M.fill(ctx, function (c) { roughRectRing(c, fx, fy, fw, fh, 4.5, seed + 7); },
      M.pal[0], { alpha: 0.55 + 0.08 * Math.sin(A + 1.1) });

    /* 湿墨：框上有一处颜色更沉，正在缓慢地绕着框走 */
    var wet = 0.5 + 0.45 * Math.sin(A);
    var w0 = wet - 0.05, w1 = wet + 0.05;
    if (w0 < 0) { w0 += 1; }
    if (w1 > 1) { w1 -= 1; }
    if (w0 < w1) {
      M.fill(ctx, function (c) { bandSeg(c, fx, fy, fw, fh, 4.5, w0, w1); },
        M.pal[0], { alpha: 0.34 });
    } else {
      M.fill(ctx, function (c) { bandSeg(c, fx, fy, fw, fh, 4.5, w0, 1); },
        M.pal[0], { alpha: 0.34 });
      M.fill(ctx, function (c) { bandSeg(c, fx, fy, fw, fh, 4.5, 0, w1); },
        M.pal[0], { alpha: 0.34 });
    }

    /* 框外的几根散锋：笔沿外沿甩出去的一点点毛 */
    for (var k = 0; k < 9; k++) {
      var u2 = hash(seed, k, 2);
      var pp = framePoint(fx, fy, fw, fh, 0, u2);
      var out = 2.5 + hash(seed, k, 3) * 4.5;
      var nx = -pp[4], ny = -pp[5];       // 外法线
      var pts = [], wids = [], j, t2;
      for (j = 0; j <= 6; j++) {
        t2 = j / 6;
        pts.push([pp[0] + nx * out * t2 + pp[2] * (t2 - 0.5) * 2.5,
                  pp[1] + ny * out * t2 + pp[3] * (t2 - 0.5) * 2.5]);
        wids.push(1.1 * Math.sin(Math.PI * t2) + 0.12);
      }
      var poly = brushPts(pts, wids);
      fillPts(ctx, poly, M, M.pal[0], 0.22 + hash(seed, k, 4) * 0.30);
    }
  };

  /* ====================================================================
     9 墨滴入水 —— 一滴墨在水中散开的同心圈
     一滴墨落下：中间是墨核，外面是同时扩散的圈，再外面是游丝。
     圈不是规规矩矩的圆（真墨的圈是抖的）；游丝是会飘的，不是直的头发。
     每一圈都是「从无到有、从有到无」的循环，所以看不到接缝。
     ==================================================================== */
  FORM.inkDropSpread = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 1809;
    var A = p * TAU();
    var cx = w * 0.5, cy = h * 0.5;

    /* 墨核周围的一团淡晕（水先被染了） */
    M.fill(ctx, function (c) {
      blobPath(c, cx, cy, Math.min(w, h) * 0.30, 9, seed, 0.30, 0.92);
    }, M.pal[0], { alpha: 0.07 + 0.02 * Math.sin(A) });

    /* 三道同时扩散的圈（圈是抖的，但还认得出是圈） */
    for (var i = 0; i < 3; i++) {
      var u = (p + i / 3) % 1;
      var rr = Math.min(w, h) * (0.10 + u * 0.36);
      var al = 0.68 * Math.pow(Math.sin(Math.PI * u), 1.3);
      if (al < 0.01) continue;
      var ring = [], N = 56, k, th;
      for (k = 0; k <= N; k++) {
        th = (k / N) * TAU();
        var m = 1 + 0.022 * Math.sin(th * 3 + i * 1.7) + 0.013 * Math.sin(th * 5 - i);
        ring.push([cx + Math.cos(th) * rr * m, cy + Math.sin(th) * rr * m * 0.96]);
      }
      M.stroke(ctx, function (c) { polyPath(c, ring); },
        M.pal[0], 1.0 + (1 - u) * 1.4, { alpha: al });
    }

    /* 游丝：墨在水里拉出的细丝，越远越淡、越飘（不是直的头发） */
    for (var q = 0; q < 7; q++) {
      var a0 = (q / 7) * TAU() + hash(seed, q, 1) * 0.8;
      var len = Math.min(w, h) * (0.34 + hash(seed, q, 2) * 0.52);
      var sway = 0.78 * Math.sin(A + q * 0.9);
      var pts = [], wids = [], j, n = 16, t;
      for (j = 0; j <= n; j++) {
        t = j / n;
        var aa = a0 + sway * t * t;
        var d = len * t * (1 + 0.20 * Math.sin(t * 5.0 + q * 1.3));
        pts.push([cx + Math.cos(aa) * d, cy + Math.sin(aa) * d * 0.86]);
        wids.push(0.62 * Math.sin(Math.pow(t, 0.60) * Math.PI) + 0.06);
      }
      var poly = brushPts(pts, wids);
      fillPts(ctx, poly, M, M.pal[0], 0.20 + hash(seed, q, 3) * 0.18);
    }

    /* 墨核 */
    M.fill(ctx, function (c) {
      blobPath(c, cx, cy, Math.min(w, h) * 0.115, 8, seed + 3, 0.34, 0.95);
    }, M.pal[0], { alpha: 0.88 + 0.08 * Math.sin(A * 2) });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.arc(cx, cy, Math.min(w, h) * 0.115, 0, TAU());
    }, M.pal[0], 9, { alpha: 0.17 });
  };

  /* ====================================================================
     10 题跋 —— 竖排的一行小字
     「墨写山河」四字逐字往下排，字要**大到能一眼看清**；
     右边一道淡墨界栏，右下落一方小朱印。
     墨还没干透，字口的浓淡一直在极缓慢地变。
     ==================================================================== */
  FORM.inscription = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var A = p * TAU();

    var s = P.label || '墨写山河';
    var n = s.length;
    var colX = w * 0.31;
    var top = h * 0.075;
    var pitch = Math.min(h * 0.90 / Math.max(1, n), 38);
    var size = Math.min(pitch * 0.92, 34);

    /* 界栏：极淡的一道竖线 */
    var gx = w * 0.525;
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(gx, h * 0.045);
      c.lineTo(gx, h * 0.955);
    }, M.pal[0], 1.3, { alpha: 0.22 + 0.07 * Math.sin(A) });

    /* 逐字往下 */
    for (var i = 0; i < n; i++) {
      var y = top + pitch * (i + 0.5);
      if (y > h * 0.93) break;
      M.text(ctx, s.charAt(i), colX, y, size, M.pal[0],
        { alpha: 0.80 + 0.15 * Math.sin(A + i * 0.9) });
    }

    /* 落款小朱印 */
    var ss = Math.min(w * 0.28, 22);
    var sx = w * 0.72 - ss * 0.5, sy = h * 0.88 - ss * 0.5;
    var per = [], sidx, u, bx, by, nx, ny, chip;
    for (sidx = 0; sidx < 4; sidx++) {
      for (var j = 0; j < 4; j++) {
        u = j / 4;
        if (sidx === 0) { bx = sx + ss * u; by = sy; nx = 0; ny = 1; }
        else if (sidx === 1) { bx = sx + ss; by = sy + ss * u; nx = -1; ny = 0; }
        else if (sidx === 2) { bx = sx + ss * (1 - u); by = sy + ss; nx = 0; ny = -1; }
        else { bx = sx; by = sy + ss * (1 - u); nx = 1; ny = 0; }
        chip = 0;
        var hv = hash(1810, sidx * 4 + j, 1);
        if (hv > 0.80) chip = (hv - 0.80) / 0.20 * ss * 0.20;
        per.push([bx + nx * chip, by + ny * chip]);
      }
    }
    M.stroke(ctx, function (c) { polyPath(c, per); c.closePath(); },
      M.pal[1], 4, { alpha: 0.11 });
    fillPts(ctx, per, M, M.pal[1], 0.84 + 0.10 * Math.sin(A + 1.4));
  };
})(window.Sticker);
