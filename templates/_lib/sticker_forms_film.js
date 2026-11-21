/* 胶片复古 · 10 个专属画法
   ------------------------------------------------------------------
   这一族的手感是**做旧**：褪色、颗粒、划痕、漏光、暖褐色调。
   材质的 post 每帧加颗粒和划痕，M.text 是打字机字体（自带一点重影）。
   调色板：pal[0] 暖褐 / pal[1] 褪青 / pal[2] 褪蓝 / pal[3] 米白 / pal[4] 近黑
   ------------------------------------------------------------------ */
(function (S) {
  var FORM = S.FORM;
  var hash = S.hash, TAU = S.TAU, polyPath = S.polyPath;
  var roundRect = S.roundRect, blobPath = S.blobPath, starPath = S.starPath;

  /* 1 胶片框：带片孔的一格画幅 */
  FORM.filmFrame = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var x = w * 0.13, y = h * 0.14, fw = w * 0.74, fh = h * 0.72;
    // 画幅
    M.fill(ctx, function (c) { c.beginPath(); c.rect(x, y, fw, fh); },
      M.pal[4], { alpha: 0.9 });
    // 上下片孔带
    for (var side = 0; side < 2; side++) {
      var by = side ? y + fh - 9 : y - 9;
      M.fill(ctx, function (c) { c.beginPath(); c.rect(x - 4, by, fw + 8, 9); },
        M.pal[3], { alpha: 0.85 });
      for (var i = 0; i < 5; i++) {
        var px = x + 4 + (fw - 8) * (i / 4);
        M.fill(ctx, function (c) {
          c.beginPath();
          c.rect(px, by + 2, (fw - 8) / 6, 5);
        }, M.pal[4], { alpha: 0.9 });
      }
    }
    // 画幅里的一小块影像（暖调渐层）
    M.fill(ctx, function (c) {
      c.beginPath();
      c.rect(x + 3, y + 3, fw - 6, fh - 6);
    }, M.pal[0], { alpha: 0.45 });
    // 地平线
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(x + 3, y + fh * 0.62);
      c.lineTo(x + fw - 3, y + fh * 0.62);
    }, M.pal[1], 2, { alpha: 0.7 });
  };

  /* 2 日期戳：打在角上的橙色日期 */
  FORM.dateStamp = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var s = P.label || '1974';
    var size = P.size || 17;
    var cx = w * 0.52, cy = h * 0.46;
    var tilt = -0.18 + Math.sin(p * TAU()) * 0.03;
    /* 戳要**占满盒子**（原来按字号算：size*3 宽，在 120 的盒子里只有 45 宽） */
    var tw = w * 0.88, th = h * 0.34;
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(tilt); ctx.translate(-cx, -cy);
    // 橙色圆角底
    M.fill(ctx, function (c) { roundRect(c, cx - tw / 2, cy - th / 2, tw, th, 5); },
      M.pal[0], { alpha: 0.9 });
    // 日期
    M.text(ctx, s, cx, cy, size, M.pal[4], { alpha: 0.95 });
    // 上下两道横线
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx - tw * 0.42, cy - th * 0.34);
      c.lineTo(cx + tw * 0.42, cy - th * 0.34);
      c.moveTo(cx - tw * 0.42, cy + th * 0.34);
      c.lineTo(cx + tw * 0.42, cy + th * 0.34);
    }, M.pal[4], 1.6, { alpha: 0.8 });
    ctx.restore();
  };

  /* 3 漏光斑：一团从边角漏进来的暖光 */
  FORM.lightLeak = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    // 光从左下角漏进来（位置随时间慢慢挪）
    var lx = w * (0.12 + 0.08 * Math.sin(p * TAU()));
    var ly = h * (0.86 - 0.06 * Math.cos(p * TAU()));
    var g = ctx.createRadialGradient(lx, ly, 0, lx, ly, w * 0.55);
    g.addColorStop(0, S.hslA(M.pal[0], 0.85));
    g.addColorStop(0.35, S.hslA(M.pal[0], 0.30));
    g.addColorStop(1, S.hslA(M.pal[0], 0));
    ctx.save();
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    // 几道横向的色带
    for (var i = 0; i < 3; i++) {
      var yy = ly - 20 + i * 16;
      var gg = ctx.createLinearGradient(0, yy, w * 0.7, yy);
      gg.addColorStop(0, S.hslA(M.pal[2], 0.42));
      gg.addColorStop(1, S.hslA(M.pal[2], 0));
      ctx.save();
      ctx.fillStyle = gg;
      ctx.fillRect(0, yy, w * 0.7, 9);
      ctx.restore();
    }
  };

  /* 4 划痕：几道竖着的划痕在闪 */
  FORM.filmScratch = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h, seed = P.seed || 31;
    for (var i = 0; i < 5; i++) {
      // 每道划痕的位置由 seed 定，亮度随时间闪
      var x = w * (0.12 + hash(seed, i, 1) * 0.76);
      var flash = 0.15 + 0.85 * Math.pow(Math.max(0, Math.sin(p * TAU() * (1 + i % 3) + i * 1.7)), 4);
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.moveTo(x, -4);
        c.lineTo(x + (hash(seed, i, 2) - 0.5) * 10, h + 4);
      }, M.pal[3], 1 + hash(seed, i, 3) * 1.6, { alpha: 0.20 + 0.75 * flash });
    }
    // 几粒灰尘
    for (var k = 0; k < 4; k++) {
      var dx = hash(seed, k, 4) * w, dy = hash(seed, k, 5) * h;
      M.fill(ctx, function (c) { c.beginPath(); c.arc(dx, dy, 1 + hash(seed, k, 6) * 1.8, 0, TAU()); },
        M.pal[4], { alpha: 0.5 });
    }
  };

  /* 5 拍立得：一张白边方形相纸，图像在褪色 */
  FORM.polaroid = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var pw = Math.min(w * 0.72, 116), ph = Math.min(h * 0.86, 130);
    var x = (w - pw) / 2, y = (h - ph) / 2;
    var tilt = Math.sin(p * TAU()) * 0.035;
    ctx.save();
    ctx.translate(w / 2, h / 2); ctx.rotate(tilt); ctx.translate(-w / 2, -h / 2);
    // 相纸
    M.fill(ctx, function (c) { c.beginPath(); c.rect(x, y, pw, ph); },
      M.pal[3], { alpha: 0.97 });
    // 影像区
    var ix = x + pw * 0.08, iy = y + ph * 0.07, iw = pw * 0.84, ih = ph * 0.66;
    M.fill(ctx, function (c) { c.beginPath(); c.rect(ix, iy, iw, ih); },
      M.pal[0], { alpha: 0.6 });
    // 影像里的地平线和太阳
    M.fill(ctx, function (c) {
      c.beginPath();
      c.arc(ix + iw * 0.68, iy + ih * 0.34, iw * 0.13, 0, TAU());
    }, M.pal[2], { alpha: 0.75 });
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(ix, iy + ih * 0.72);
      c.lineTo(ix + iw, iy + ih * 0.72);
    }, M.pal[1], 2, { alpha: 0.7 });
    // 褪色：越靠上越淡
    M.fill(ctx, function (c) {
      c.beginPath();
      c.rect(ix, iy, iw, ih * 0.55);
    }, M.pal[3], { alpha: 0.28 + 0.18 * Math.sin(p * TAU()) });
    ctx.restore();
  };

  /* 6 胶卷盘：一盘卷起来的胶片 */
  FORM.filmReel = function (ctx, B, p, P, M) {
    var cx = B.w / 2, cy = B.h / 2;
    var r = Math.min(B.w, B.h) * 0.36;
    var spin = p * TAU() * 0.5;
    // 盘体
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); },
      M.pal[4], { alpha: 0.95 });
    M.stroke(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r, 0, TAU()); },
      M.pal[0], 2.4, { alpha: 0.8 });
    // 三个窗口（转）
    for (var i = 0; i < 3; i++) {
      var a = spin + (i / 3) * TAU();
      M.fill(ctx, function (c) {
        c.beginPath();
        c.arc(cx + Math.cos(a) * r * 0.52, cy + Math.sin(a) * r * 0.52,
              r * 0.26, 0, TAU());
      }, M.pal[4], { alpha: 0.95 });
      M.stroke(ctx, function (c) {
        c.beginPath();
        c.arc(cx + Math.cos(a) * r * 0.52, cy + Math.sin(a) * r * 0.52,
              r * 0.26, 0, TAU());
      }, M.pal[0], 2, { alpha: 0.8 });
    }
    // 中心轴
    M.fill(ctx, function (c) { c.beginPath(); c.arc(cx, cy, r * 0.15, 0, TAU()); },
      M.pal[0], { alpha: 0.9 });
    // 甩出来的一截胶片
    M.stroke(ctx, function (c) {
      c.beginPath();
      c.moveTo(cx + r * 0.9, cy + r * 0.4);
      c.quadraticCurveTo(cx + r * 1.4, cy + r * 0.9, cx + r * 1.1, cy + r * 1.5);
    }, M.pal[3], 5, { alpha: 0.9 });
  };

  /* 7 打字标签：打字机打出来的一行字 */
  FORM.typedLabel = function (ctx, B, p, P, M) {
    var s = P.label || 'ROLL 12';
    var size = P.size || 19;
    var w = B.w, h = B.h;
    /* 打字机效果：**前 28% 打完，之后保持整行**。
       原来写成 floor(p * (s.length + 3)) —— 整条循环打完要 1.0，
       静帧正好截在 p=0.36，只剩 3 个字（"SCENE 04" 渲成 "SCE"）。
       这类「随时间变化的内容」必须让大部分时间是完整状态。 */
    var k = Math.min(1, p / 0.28);
    var shown = Math.max(1, Math.round(k * s.length));
    var txt = s.slice(0, shown);
    // 纸
    M.fill(ctx, function (c) { roundRect(c, w * 0.06, h * 0.22, w * 0.88, h * 0.56, 3); },
      M.pal[3], { alpha: 0.92 });
    // 打字
    M.text(ctx, txt, w * 0.10, h * 0.5, size, M.pal[4], { align: 'left' });
    // 光标（位置要按**实际字宽**算，原来多乘了一个 0.62，光标停在字中间）
    if (shown <= s.length) {
      var cw = size * 0.6;
      M.fill(ctx, function (c) {
        c.beginPath();
        c.rect(w * 0.10 + txt.length * cw, h * 0.5 - size * 0.5, 2.4, size);
      }, M.pal[4], { alpha: 0.85 });
    }
    // 压纸的夹子
    M.fill(ctx, function (c) { roundRect(c, w * 0.40, h * 0.16, w * 0.20, 9, 3); },
      M.pal[0], { alpha: 0.9 });
  };

  /* 8 显影液：一盘显影液，液面在晃 */
  FORM.developerTray = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var x = w * 0.10, y = h * 0.30, tw = w * 0.80, th = h * 0.44;
    // 盘
    M.fill(ctx, function (c) { roundRect(c, x, y, tw, th, 5); },
      M.pal[3], { alpha: 0.95 });
    M.stroke(ctx, function (c) { roundRect(c, x, y, tw, th, 5); },
      M.pal[0], 2.4, { alpha: 0.85 });
    // 液面（晃）
    var ly = y + th * 0.30;
    var ph = p * TAU();
    M.fill(ctx, function (c) {
      c.beginPath();
      c.moveTo(x + 4, ly + th * 0.30);
      for (var i = 0; i <= 24; i++) {
        var u = i / 24;
        c.lineTo(x + 4 + (tw - 8) * u,
                 ly + Math.sin(u * 6 + ph) * 3.2 + th * 0.30);
      }
      c.lineTo(x + tw - 4, y + th - 4);
      c.lineTo(x + 4, y + th - 4);
      c.closePath();
    }, M.pal[1], { alpha: 0.7 });
    // 液面上的一道反光
    M.stroke(ctx, function (c) {
      c.beginPath();
      for (var i = 0; i <= 24; i++) {
        var u = i / 24;
        var px = x + 4 + (tw - 8) * u, py = ly + Math.sin(u * 6 + ph) * 3.2 + th * 0.30;
        if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
      }
    }, M.pal[3], 1.6, { alpha: 0.8 });
    // 泡
    for (var k = 0; k < 3; k++) {
      var bx = x + tw * (0.2 + k * 0.3), by = ly + th * 0.22;
      var br = 2 + 2 * Math.abs(Math.sin(ph + k));
      M.particle(ctx, bx, by, br, M.pal[3], { alpha: 0.6 });
    }
  };

  /* 9 场记板：举起来的场记板，啪一声合上 */
  FORM.clapboard = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var cx = w / 2, cy = h * 0.52;
    /* 板子要撑满盒子（原来 bw=min(w*0.78,124) → 200 宽的盒子里只占 124，
       渲出来是个小方块），并且给下盖留出合上时的空间。 */
    var bw = Math.min(w * 0.88, 168), bh = h * 0.50;
    // 上盖（合上的时候往下压）
    var close = (0.5 + 0.5 * Math.sin(p * TAU() * 2)) * 0.16;
    ctx.save();
    ctx.translate(cx, cy - bh / 2);
    ctx.rotate(-0.06 - close);
    M.fill(ctx, function (c) { roundRect(c, -bw / 2, -bh * 0.34, bw, bh * 0.34, 3); },
      M.pal[4], { alpha: 0.97 });
    // 上盖的斜条
    for (var i = 0; i < 5; i++) {
      M.fill(ctx, function (c) {
        c.beginPath();
        c.moveTo(-bw / 2 + i * bw / 5, -bh * 0.34);
        c.lineTo(-bw / 2 + i * bw / 5 + bw / 10, -bh * 0.34);
        c.lineTo(-bw / 2 + i * bw / 5 + bw / 10 - 7, 0);
        c.lineTo(-bw / 2 + i * bw / 5 - 7, 0);
        c.closePath();
      }, M.pal[4], { alpha: 0.95 });
    }
    ctx.restore();
    // 主板
    M.fill(ctx, function (c) { roundRect(c, cx - bw / 2, cy, bw, bh * 0.78, 3); },
      M.pal[0], { alpha: 0.95 });
    // 主板上的白条
    M.fill(ctx, function (c) {
      c.beginPath();
      c.rect(cx - bw / 2, cy, bw, bh * 0.24);
    }, M.pal[4], { alpha: 0.95 });
    // 场次/镜次：两个都要短，左右分开，别挤在一起
    M.text(ctx, P.label || 'SC 04', cx - bw * 0.22, cy + bh * 0.50, 13, M.pal[4], {});
    M.text(ctx, 'ROLL 12', cx + bw * 0.26, cy + bh * 0.50, 11, M.pal[3], { alpha: 0.8 });
  };

  /* 10 影棚编号：印着编号的一小条 */
  FORM.studioTag = function (ctx, B, p, P, M) {
    var w = B.w, h = B.h;
    var s = P.label || 'STUDIO 12B';
    var size = P.size || 14;
    /* 牌子：原来盒子是 460×64 的横条，tw = min(w*0.46, 220) → 只占 212 宽，
       渲出来是一条横贯整屏的窄带。盒子改成 220×70（一个小编号牌），
       tw 系数提到 0.72 → 牌子 158×39，在盒子里居中。 */
    var tw = Math.min(w * 0.72, 220), th = h * 0.56;
    var x = (w - tw) / 2, y = (h - th) / 2;
    // 牌子
    M.fill(ctx, function (c) { roundRect(c, x, y, tw, th, 4); },
      M.pal[0], { alpha: 0.92 });
    M.stroke(ctx, function (c) { roundRect(c, x, y, tw, th, 4); },
      M.pal[3], 1.4, { alpha: 0.75 });
    // 编号
    M.text(ctx, s, x + tw / 2, y + th * 0.42, size, M.pal[4], { alpha: 0.95 });
    // 下面一条细的色条
    M.fill(ctx, function (c) {
      c.beginPath();
      c.rect(x + 8, y + th * 0.68, tw - 16, 3);
    }, M.pal[1], { alpha: 0.8 });
    // 两颗铆钉
    for (var k = 0; k < 2; k++) {
      M.particle(ctx, x + 9 + k * (tw - 18), y + th * 0.84, 2.2, M.pal[3], { alpha: 0.8 });
    }
  };
})(window.Sticker);
