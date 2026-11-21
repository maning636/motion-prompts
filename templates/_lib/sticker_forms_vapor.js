/* 蒸汽波 · 10 个专属画法
   ------------------------------------------------------------------
   这一族的手感是**复古未来**：粉紫 / 青 / 黄绿三色，
   大量使用**切条**（落日和网格被横向切成一条条，这是蒸汽波的灵魂）、
   透视网格、铬金反光。材质的 M.text 自带铬金渐变，直接用。
   调色板：pal[0] 粉 / pal[1] 青 / pal[2] 黄绿 / pal[3] 深紫 / pal[4] 亮粉
   ------------------------------------------------------------------ */
(function (S) {
  var FORM = S.FORM;
  var hash = S.hash, TAU = S.TAU, polyPath = S.polyPath;
  var roundRect = S.roundRect, starPath = S.starPath;

  /* 1 落日：带切条的地平线落日
     动法（原来**完全没有专属动法** —— 整张图是死的，只靠引擎的呼吸）：
     1) 落日**缓缓下沉**再升起（三角波 + 取整，避开 sin 取整的死区）；
     2) 切条**逐条错开**地流动（每条的横条位置随时间微移）；
     3) 太阳上方的**辉光**一明一暗。 */
  FORM.vaporSun = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var cx = w / 2, cy = h * 0.46;
    var r = Math.min(w, h) * 0.36;
    /* 动法 1：下沉 0~6px（三角波，取整到 2 的倍数） */
    var triW = 1 - Math.abs(((p * 2) % 2) - 1) * 2;
    var sink = Math.round(triW * 3) * 2;
    cy += sink;
    /* 落日本体：上半亮粉，下半深紫 */
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); },
      M.pal[0], { alpha: 0.95 });
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - r, cy);
      c.arc(cx, cy, r, Math.PI, TAU());
      c.closePath();
    }, M.pal[3], { alpha: 0.55 });
    // 切条：下半部分被切成横条，越往下越细
    // 动法 2：每条按自己的相位左右微移（错开流动）
    for (var i = 0; i < 7; i++) {
      var t = i / 7;
      var yy = cy + t * r * 0.98;
      var hh = Math.max(2, r * (0.13 - t * 0.012));
      var dx = Math.round(Math.sin(p * TAU() * 2 + i * 0.9) * 2) * 2;
      M.fill(ctx, function (c) {
        c.beginPath();
        c.rect(cx - r + dx, yy, r * 2, hh);
      }, M.pal[0], { alpha: 0.95 });
    }
    // 地平线
    M.stroke(ctx, function (c) {
      c.beginPath(); c.moveTo(0, cy + r * 0.99); c.lineTo(w, cy + r * 0.99);
    }, M.pal[4], 2.2, { alpha: 0.85 });
    // 动法 3：辉光（太阳上方的亮晕）一明一暗
    var glow = 0.16 + 0.14 * (0.5 + 0.5 * Math.sin(p * TAU() * 2));
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r * 1.22, 0, TAU()); },
      M.pal[2], { alpha: glow });
  };

  /* 2 网格地平线：一片透视网格铺到天边
     动法（原来**完全没有专属动法** —— 网格是死的）：
     1) 横向线**从地平线往观者方向流动**（透视网格的经典动法）——
        每条线的 y 按「透视步进」随时间往回收，收完从地平线重新放出；
     2) 地平线余晖一明一暗。 */
  FORM.gridHorizon = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var hy = h * 0.36;
    /* 动法 1：网格流动。横线按透视间距从地平线往观者方向排，
       整体沿时间轴往回收 → 视觉上就是「网在往前跑」。
       每条线在自己的相位上取位置，保证循环无缝（周期是 1 圈）。 */
    var flow = (p * 1) % 1;
    // 纵向线：近处疏、地平线密
    for (var i = -6; i <= 6; i++) {
      var x = w / 2 + i * (w * 0.075);
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(w / 2 + i * 3, hy);
        c.lineTo(x * 1.9 - w * 0.45, h);
      }, M.pal[1], 1.3, { alpha: 0.6 });
    }
    // 横向线：间距按透视递增，整组沿时间往回收
    var y = hy, step = 3, idx = 0;
    while (y < h) {
      // 每条线按自己的序号取一个相位 → 回收时是逐条接力，不会整体跳
      var off = (flow + idx * 0.13) % 1;
      var yy = hy + off * (h - hy) * 1.6;
      if (yy < h) {
        M.stroke(ctx, function (c) {
          c.beginPath(); c.moveTo(0, yy); c.lineTo(w, yy);
        }, M.pal[1], 1.1, { alpha: 0.45 * (1 - off * 0.5) });
      }
      idx++;
      step *= 1.30;
      y += step;
    }
    // 地平线上的落日余晖（动法 2：一明一暗）
    var glow = 0.42 + 0.20 * (0.5 + 0.5 * Math.sin(p * TAU() * 2));
    M.fill(ctx, function (c) {
      c.beginPath();
      c.ellipse(w / 2, hy, w * 0.16, h * 0.07, 0, 0, TAU());
    }, M.pal[0], { alpha: glow });
  };

  /* 3 棕榈：一丛棕榈叶在风里摆 */
  FORM.palmTree = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var baseX = w * 0.5, baseY = h * 1.02;
    var sway = Math.sin(p * TAU()) * 0.09;
    // 树干
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(baseX, baseY);
      c.quadraticCurveTo(baseX + sway * 22, h * 0.5, baseX + sway * 46, h * 0.24);
    }, M.pal[3], 7, { alpha: 0.9 });
    // 叶片：6 片，从树顶放射，末端下垂
    var tx = baseX + sway * 46, ty = h * 0.24;
    for (var i = 0; i < 6; i++) {
      var a = -Math.PI / 2 + (i - 2.5) * 0.52;
      var len = Math.min(w, h) * (0.42 + hash(P.seed || 21, i, 1) * 0.16);
      var tipx = tx + Math.cos(a) * len, tipy = ty + Math.sin(a) * len + len * 0.34;
      var midx = tx + Math.cos(a) * len * 0.55, midy = ty + Math.sin(a) * len * 0.55;
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(tx, ty);
        c.quadraticCurveTo(midx, midy, tipx, tipy);
      }, i % 2 ? M.pal[1] : M.pal[2], 5, { alpha: 0.9 });
      // 叶脉小刺
      for (var k = 1; k <= 4; k++) {
        var u = k / 5;
        var px = tx + (tipx - tx) * u, py = ty + (tipy - ty) * u;
        M.stroke(ctx, function (c) {
          c.beginPath();
          c.moveTo(px, py);
          c.lineTo(px + Math.cos(a + 1.4) * 7, py + Math.sin(a + 1.4) * 7);
        }, i % 2 ? M.pal[1] : M.pal[2], 1.6, { alpha: 0.6 });
      }
    }
  };

  /* 4 铬金标题：金属反光的大字 */
  FORM.chromeTitle = function (ctx, B, p, P, M) {
    var s = P.label || 'VAPOR';
    var size = P.size || 26;
    var cx = B.w / 2, cy = B.h * 0.46;
    var slide = Math.sin(p * TAU()) * 2;
    /* 铬金的关键是**竖向反光**：上暗 → 中间一道亮 → 下暗，
       高光带随时间慢慢往下滑。用 CanvasGradient 当 fillStyle 传给 M.text
       （M.text 里是 ctx.fillStyle = c，渐变对象可以直接用）。 */
    var g = ctx.createLinearGradient(0, cy - size * 0.62, 0, cy + size * 0.62);
    var hi = (Math.sin(p * TAU()) * 0.5 + 0.5);
    g.addColorStop(0, S.hslA(M.pal[1], 0.95));
    g.addColorStop(Math.max(0.05, Math.min(0.95, 0.18 + hi * 0.55)), S.hslA(M.pal[3], 1));
    g.addColorStop(Math.max(0.1, Math.min(0.98, 0.42 + hi * 0.55)), S.hslA(M.pal[2], 0.98));
    g.addColorStop(1, S.hslA(M.pal[0], 0.92));
    M.text(ctx, s, cx + slide, cy, size, g, {});
    // 下面一层镜像的淡影（拉远，别跟正体重叠成一团）
    M.text(ctx, s, cx - slide, cy + size * 0.95, size * 0.5, M.pal[3],
      { alpha: 0.32 });
    // 上下两条装饰线
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - B.w * 0.36, cy - size * 0.82);
      c.lineTo(cx + B.w * 0.36, cy - size * 0.82);
      c.moveTo(cx - B.w * 0.30, cy + size * 1.30);
      c.lineTo(cx + B.w * 0.30, cy + size * 1.30);
    }, M.pal[4], 1.6, { alpha: 0.7 });
  };

  /* 5 星门：一道拱形门，里面是紫光 */
  FORM.starPortal = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h * 0.92;
    var w2 = Math.min(B.w, B.h) * 0.34, hh = Math.min(B.w, B.h) * 0.72;
    // 门内紫光
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - w2, cy);
      c.lineTo(cx - w2, cy - hh * 0.55);
      c.arc(cx, cy - hh * 0.55, w2, Math.PI, 0);
      c.lineTo(cx + w2, cy);
      c.closePath();
    }, M.pal[3], { alpha: 0.8 });
    // 门内的星
    for (var i = 0; i < 6; i++) {
      var px = cx + (hash(P.seed || 22, i, 1) - 0.5) * w2 * 1.4;
      var py = cy - hh * (0.15 + hash(P.seed || 22, i, 2) * 0.7);
      M.particle(ctx, px, py, 1.4 + hash(P.seed || 22, i, 3) * 1.8,
        M.pal[4], { alpha: 0.5 + 0.5 * Math.sin(p * TAU() * 2 + i) });
    }
    // 门框
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - w2, cy);
      c.lineTo(cx - w2, cy - hh * 0.55);
      c.arc(cx, cy - hh * 0.55, w2, Math.PI, 0);
      c.lineTo(cx + w2, cy);
    }, M.pal[2], 3.4, { alpha: 0.95 });
    // 底座
    M.fill(ctx, function (c) {
      c.beginPath();
      c.rect(cx - w2 * 1.2, cy, w2 * 2.4, 6);
    }, M.pal[1], { alpha: 0.85 });
  };

  /* 6 星球环：带环的星球，环在斜转 */
  FORM.planetRing = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    var r = Math.min(B.w, B.h) * 0.26;
    var tilt = -0.42, spin = p * TAU();
    // 星体
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); },
      M.pal[0], { alpha: 0.95 });
    // 表面条纹
    for (var i = 0; i < 3; i++) {
      var yy = cy - r * 0.5 + i * r * 0.5;
      M.fill(ctx, function (c) {
        c.beginPath();
        c.ellipse(cx, yy, r * 0.92, r * 0.14, 0, 0, TAU());
      }, M.pal[3], { alpha: 0.35 });
    }
    // 环（背半在前半之前，先画前半）
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(tilt); ctx.scale(1, 0.32);
    M.stroke(ctx, function (c) {
      c.beginPath(); c.arc(0, 0, r * 1.7, 0, TAU());
    }, M.pal[1], 7, { alpha: 0.9 });
    M.stroke(ctx, function (c) {
      c.beginPath(); c.arc(0, 0, r * 1.95, 0, TAU());
    }, M.pal[4], 3, { alpha: 0.7 });
    ctx.restore();
    // 星点
    for (var k = 0; k < 5; k++) {
      var a = hash(P.seed || 23, k, 1) * TAU() + spin * 0.2;
      var rr = r * (1.2 + hash(P.seed || 23, k, 2) * 1.1);
      M.particle(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.7, 1.6,
        M.pal[2], { alpha: 0.7 });
    }
  };

  /* 7 音乐盒：一个带小人的音乐盒，梳齿在动 */
  FORM.musicBox = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var cx = w / 2, baseY = h * 0.88;
    var bw = Math.min(w * 0.62, 108), bh = h * 0.30;
    // 盒身
    M.fill(ctx, function (c) { roundRect(c, cx - bw / 2, baseY - bh, bw, bh, 6); },
      M.pal[3], { alpha: 0.95 });
    M.stroke(ctx, function (c) {
      roundRect(c, cx - bw / 2, baseY - bh, bw, bh, 6);
    }, M.pal[4], 1.6, { alpha: 0.7 });
    // 梳齿：一排长短不同的齿，在动
    var n = 9;
    for (var i = 0; i < n; i++) {
      var u = i / (n - 1);
      var tx = cx - bw * 0.38 + bw * 0.76 * u;
      var len = bh * (0.28 + Math.abs(Math.sin(p * TAU() + i * 0.6)) * 0.42);
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(tx, baseY - bh);
        c.lineTo(tx, baseY - bh - len);
      }, M.pal[2], 2.2, { alpha: 0.95 });
    }
    // 盖子（打开的）
    ctx.save();
    ctx.translate(cx - bw / 2, baseY - bh);
    ctx.rotate(-0.5);
    M.fill(ctx, function (c) { roundRect(c, 0, -bh * 0.85, bw, bh * 0.85, 5); },
      M.pal[0], { alpha: 0.9 });
    ctx.restore();
    // 旋转的小人
    var ax = cx + bw * 0.22, ay = baseY - bh * 1.5;
    var spin = p * TAU();
    M.fill(ctx, function (c) {
      c.beginPath();
      c.ellipse(ax, ay, 7, 9, spin, 0, TAU());
    }, M.pal[4], { alpha: 0.95 });
  };

  /* 8 旋转唱片：一张唱片在转，唱针搭在上面 */
  FORM.vinylRecord = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h * 0.52;
    var r = Math.min(B.w, B.h) * 0.40;
    // 唱片
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); },
      M.pal[3], { alpha: 0.95 });
    // 唱片纹（旋转）
    for (var i = 1; i <= 5; i++) {
      var rr = r * (0.30 + i * 0.13);
      M.stroke(ctx, function (c) {
        c.beginPath(); c.arc(cx, cy, rr, 0, TAU());
      }, M.pal[1], 0.8, { alpha: 0.30 });
    }
    // 标签
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r * 0.27, 0, TAU()); },
      M.pal[0], { alpha: 0.95 });
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r * 0.06, 0, TAU()); },
      M.pal[3], { alpha: 0.9 });
    // 高光扫过（转动的反光）
    var a = p * TAU();
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(a);
    var g = ctx.createLinearGradient(-r, 0, r, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.22)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU()); ctx.fill();
    ctx.restore();
    // 唱针
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx + r * 0.92, cy - r * 0.86);
      c.lineTo(cx + r * 0.16, cy - r * 0.10);
    }, M.pal[4], 3, { alpha: 0.95 });
  };

  /* 9 楼梯井：一段往上折的阶梯 */
  FORM.stairwell = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var steps = 7;
    var sw = w * 0.80 / steps, sh = h * 0.16;
    for (var i = 0; i < steps; i++) {
      var x = w * 0.10 + i * sw;
      var y = h * 0.88 - i * sh;
      // 踏面
      M.fill(ctx, function (c) {
        c.beginPath();
        c.rect(x, y, sw, sh * 0.9);
      }, i % 2 ? M.pal[0] : M.pal[4], { alpha: 0.9 });
      // 踢面
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x, y - sh * 0.9);
      }, M.pal[3], 2, { alpha: 0.8 });
    }
    // 侧面的扶手
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(w * 0.10, h * 0.82);
      c.lineTo(w * 0.10 + w * 0.80, h * 0.82 - steps * sh);
    }, M.pal[1], 2.6, { alpha: 0.85 });
    // 尽头的一点光
    var lx = w * 0.10 + w * 0.80, ly = h * 0.82 - steps * sh;
    M.particle(ctx, lx, ly, 5 + 2 * Math.sin(p * TAU()), M.pal[2], { alpha: 0.85 });
  };

  /* 10 收据条：一条从机器里吐出来的长条 */
  FORM.receiptStrip = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    /* 收据条要**占满盒子**（原来 x=w*0.18 / tw=w*0.56，
       150×56 的盒子里只有 84 宽，整幅画面里缩成一小条）。 */
    var x = w * 0.08, tw = w * 0.84;
    /* 动法（原来 `out = (p*1.0)%1` 是**单调伸长** ——
       离首帧的差异随时间单调变化，最早那几个时刻差异最小）：
       1) 伸出长度改成**往复**（正弦，首尾相接 → 循环无缝）；
       2) 纸条**左右摆** 0~3px（打印机在抖）。 */
    var out = 0.5 + 0.5 * Math.sin(p * TAU());
    var len = h * (0.44 + out * 0.50);
    var sway = Math.round(3 * (0.5 + 0.5 * Math.sin(p * TAU() * 2 + 1)));
    x += sway - 1;
    var y = h * 0.06;
    // 纸
    M.fill(ctx, function (c) { roundRect(c, x, y, tw, len, 2); },
      M.pal[3], { alpha: 0.95 });
    // 打印的行
    var rows = Math.floor(len / 10);
    for (var i = 0; i < rows; i++) {
      var ry = y + 5 + i * 10;
      var lw = tw * (0.30 + hash(P.seed || 24, i, 1) * 0.52);
      M.fill(ctx, function (c) {
        c.beginPath();
        c.rect(x + 6, ry, lw, 3);
      }, M.pal[1], { alpha: 0.75 });
    }
    // 锯齿底边
    for (var k = 0; k < 9; k++) {
      M.fill(ctx, function (c) {
        c.beginPath();
        c.moveTo(x + k * tw / 9, y + len);
        c.lineTo(x + (k + 0.5) * tw / 9, y + len - 5);
        c.lineTo(x + (k + 1) * tw / 9, y + len);
        c.closePath();
      }, M.pal[3], { alpha: 0.95 });
    }
    // 打印机出口
    M.fill(ctx, function (c) { roundRect(c, x - 8, y - 9, tw + 16, 11, 3); },
      M.pal[1], { alpha: 0.95 });
  };
})(window.Sticker);
