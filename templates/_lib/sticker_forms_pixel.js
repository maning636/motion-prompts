/* ============================================================================
   像素游戏 · 10 个专属画法
   ----------------------------------------------------------------------------
   这一族的规矩和别的族不一样，得先说清楚三件事：

   1) **一个「像素」= 4 个本地像素**。
      引擎把整张画布缩到 1/4 再用最近邻放大（sticker.js 里的 pixelated 分支），
      所以本地坐标只要落在 **4 的倍数** 上，一个像素就正好是一个离屏像素 ——
      放大后是硬的方块。凡是不在 4 的倍数上的坐标，缩小 4 倍后就是半像素，
      放大回来会带一圈插值的糊边，像素感当场消失。
      因此本文件里所有矩形都是 4 的倍数，**不用任何曲线**。

   2) **抵消引擎的「呼吸 + 漂移」**（见 crisp()）。
      引擎给所有族都套了 ±2.8% 的缩放和 ±2px 的位置漂移。对矢量族无所谓，
      对像素族是灾难：缩放会让每一个像素块都落到半像素上。
      crisp() 把这两项抵消掉，只保留规格里的旋转（那是构图的一部分）。

   3) **限色板**：M.pal[0] 近黑（描边/暗部）、M.pal[1] 红、M.pal[2] 金黄、
      M.pal[3] 蓝、M.pal[4] 米白。
      像素画只用这 5 色 + 明暗排布，不做渐变；深浅靠「黑边 + 本色 + 亮面」堆。

   4) **摆放（ox/oy）和盒子尺寸是一对**：
      盒子尺寸在规格书 `_tools/sticker_design.py` 的 comp 里，
      这里的 ox/oy 是**盒子局部坐标**（盒子左上角为原点），
      让精灵在盒子里居中 —— 精灵本身多高多大是定好的，只挪位置。
      挪的量必须**是 4 的倍数**，否则像素落到半格上，放大后就是糊边。

   5) **像素族不旋转**：旋转发生在 1/4 离屏画布上，
      像素块一转就变成斜的、带锯齿的，不再是「锐的方块」。
      所以像素族的 comp 一律 rot=0（剑和卷轴原来带的 ±8°/14° 已归零）。

   10 条各自是**不同的东西**（小屋/树/剑/药水/卷轴/灯塔/金币/篝火/骷髅/旗帜），
   形状、构图、动法三者都不重复。
   ========================================================================== */
(function (S) {
  'use strict';

  var FORM = S.FORM;
  var hash = S.hash, TAU = S.TAU, tri = S.tri, bell = S.bell;

  /* 一个「像素」= 4 个本地像素（见文件头 1)） */
  var PX = 4;

  /* ---------------------------------------------------------------- 基础件 */

  /** 像素族专用：只保留规格里的旋转。

      引擎现在**对像素族直接关掉呼吸缩放与位置漂移**
      （`spec.pixelated` → breathe=1 / drift=0，见 sticker.js 的 render()），
      因为任何非整数缩放都会让像素块落到半像素上，最近邻放大后全是糊边。

      所以这里**不需要再反向抵消一次** ——
      原来这里写的是 `scale(1/b)` + 反向平移，
      引擎改过之后那套公式反而会变成双倍缩放（而且 1/b 本身也不是整数）。 */
  /* 像素族专用：**只保留一个不变量**。
     引擎的 render() 已经做过 `g.rotate(ROT)`（ROT = spec.rot），
     这里如果再 `ctx.rotate(P.rot)` 就是**转两遍** ——
     规格写 14° 实际转了 28°（踩过）。
     而且旋转发生在 1/4 离屏画布上：实测同一把剑，
     rot=0 时离屏格 182 全硬 / 79 半格，rot=14 时 41 全硬 / **244 半格**
     —— 像素块一转就不再是方块了。
     所以像素族的 comp 一律 rot=0，这里也不做任何额外旋转。 */
  function crisp(ctx, B, p, P) {
    /* 保留这个函数是为了让调用点统一；当前不施加任何变换。 */
  }

  /** 往某个颜色桶里塞一个矩形。b 必须是**颜色桶**（b[颜色号]），不是整个桶组。 */
  function put(b, x, y, w, h) { b.push(x, y, w, h); }

  function newBuckets() { return [[], [], [], [], []]; }

  /** 填一个颜色桶。 */
  function paintOne(ctx, M, bucket, ci, alpha) {
    if (!bucket || !bucket.length) return;
    M.fill(ctx, function (c) {
      c.beginPath();
      for (var i = 0; i < bucket.length; i += 4) {
        c.rect(bucket[i], bucket[i + 1], bucket[i + 2], bucket[i + 3]);
      }
    }, M.pal[ci], { alpha: alpha == null ? 1 : alpha });
  }

  /**
   * 按颜色分桶填一整组。
   * 注意：桶是**按颜色号顺序**画的，所以有前后遮挡关系时
   * 要用 paintOne 自己控制顺序（先铺底色，再压细节）。
   */
  function paint(ctx, M, buckets, alpha) {
    for (var ci = 0; ci < buckets.length; ci++) {
      paintOne(ctx, M, buckets[ci], ci, alpha);
    }
  }

  /**
   * 字符网格 → 像素块。
   * rows 里每个字符 = 一个像素：'0'黑 '1'红 '2'金 '3'蓝 '4'米白，'.'透明。
   * opts.shift(row, col) 返回该格要横向偏移的**像素数**（用于风吹/摆动）。
   */
  function sprite(ctx, M, rows, ox, oy, opts) {
    opts = opts || {};
    var shift = opts.shift || null;
    var b = newBuckets();
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      for (var j = 0; j < row.length; j++) {
        var ch = row.charAt(j);
        if (ch === '.' || ch === ' ') continue;
        var ci = ch.charCodeAt(0) - 48;
        if (ci < 0 || ci > 4) continue;
        var sx = ox + (j + (shift ? shift(i, j) : 0)) * PX;
        var sy = oy + i * PX;
        put(b[ci], sx, sy, PX, PX);
      }
    }
    paint(ctx, M, b, opts.alpha);
  }

  /* ---------------------------------------------------------------- 动效工具 */

  /** 多频正弦 → **整格**位移。
   *
   *  为什么不能只用一根 sin
   *  ----------------------
   *  sin 取整之后一周期里只有几档，某些相位会落回**同一档**：
   *  实测像素树用单根 sin 摇摆时，t=1.8 那一帧变动像素只有 0.07%，
   *  画面看起来就是「每隔一会儿停一拍」—— 这就是死区。
   *  把 3 根**整数圈**频率（K=1/2/3）叠起来再取整，相位就被打散，
   *  每一拍都落在不同的格上，整幅每一帧都在动。
   *
   *  ⚠️ K 必须是整数：p=0 与 p=1 要逐像素相同，否则循环接缝会跳一下。
   */
  function wave(p, c1, c2, c3) {
    return Math.round(c1 * Math.sin(p * TAU())
                    + c2 * Math.sin(p * TAU() * 2)
                    + c3 * Math.sin(p * TAU() * 3));
  }

  /** 呼吸系数：同样用多频正弦叠出来的 0..1（系数已按峰值归一化，
      所以 breathe(p) 恒在 0..1，不会溢出）。
      拿它给一大片区域叠半透明的光 —— 面积够大（一两百格），
      一明一暗就是几百个像素在变，是这一族「不停」的主力。 */
  function breathe(p, c1, c2, c3) {
    var v = c1 * Math.sin(p * TAU())
          + c2 * Math.sin(p * TAU() * 2)
          + c3 * Math.sin(p * TAU() * 3);
    if (v < -1) v = -1; else if (v > 1) v = 1;
    return 0.5 + 0.5 * v;
  }

  /** 从字符网格里挑出一片区域的所有格子，收进一个矩形数组
      （x, y, w, h 四个一组）。
      用来在精灵上面叠一层半透明的光（整片屋顶 / 整把剑身）。
      ci != null → 只要这个颜色；skip != null → 不要这个颜色。 */
  function grab(rows, ox, oy, out, r0, r1, ci, skip) {
    for (var i = 0; i < rows.length; i++) {
      if (r0 != null && i < r0) continue;
      if (r1 != null && i > r1) continue;
      var row = rows[i];
      for (var j = 0; j < row.length; j++) {
        var ch = row.charAt(j);
        if (ch === '.' || ch === ' ') continue;
        var c = ch.charCodeAt(0) - 48;
        if (c < 0 || c > 4) continue;
        if (ci != null && c !== ci) continue;
        if (skip != null && c === skip) continue;
        out.push(ox + j * PX, oy + i * PX, PX, PX);
      }
    }
  }

  /** 往画布上叠一层半透明的色块（同一组矩形、一个颜色）。 */
  function tint(ctx, M, rects, ci, alpha) {
    if (!rects.length || alpha <= 0.002) return;
    M.fill(ctx, function (c) {
      c.beginPath();
      for (var i = 0; i < rects.length; i += 4) {
        c.rect(rects[i], rects[i + 1], rects[i + 2], rects[i + 3]);
      }
    }, M.pal[ci], { alpha: alpha });
  }

  /* ============================================================== 1 像素小屋
     一间带烟囱的小屋：红屋顶 + 米白墙 + 黑门 + 蓝窗，烟囱在冒烟。
     动法（四层，缺一不可）：
       1) 整间屋子上下浮 + 左右轻晃（多频正弦取整，每拍都换格）；
       2) 烟囱口五团烟错开升起、变大变淡；
       3) 屋顶和墙面被暖光镀了一层（金色半透明，呼吸式明暗）；
       4) 窗户里的灯一亮一暗。 */
  var HOUSE = [
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '....0000................',
    '....011110..............',
    '....011110..............',
    '....011110..............',
    '....011110..............',
    '....0111101111..........',
    '....011111111111........',
    '......111111111111......',
    '....1111111111111111....',
    '..11111111111111111111..',
    '111111111111111111111111',
    '...000000000000000000...',
    '...044444444444444440...',
    '...044444444440000440...',
    '...044444444440334440...',
    '...044400000440334440...',
    '...044400000440334440...',
    '...044400004444444440...',
    '...044400000444444440...',
    '...000000000000000000...'
  ];

  FORM.pixelHouse = function (ctx, B, p, P, M) {
    crisp(ctx, B, p, P);
    /* 动法 1：整间屋子**上下浮 + 左右轻晃**。
       位移是 4px 的整数倍 —— 落到半格上的像素，最近邻放大后
       整栋房子的边都是糊的。
       3 根**整数圈**频率叠起来取整（见 wave）：单根三角波在某些相位
       仍然会落回同一格（那几帧几乎不动），多频叠加后每拍都换格。 */
    var dy = wave(p, -1.085, -0.292, 0.581);
    var dx = wave(p, 0.53, 0.583, 0.556);
    var ox = 4 + dx * PX, oy = 4 + dy * PX;
    sprite(ctx, M, HOUSE, ox, oy, {});
    /* 烟囱口在网格第 6 行、第 6~7 列之间：烟从这里往上飘 */
    var chimneyX = ox + 6 * PX, chimneyY = oy + 6 * PX;
    for (var i = 0; i < 6; i++) {
      var u = (p + i * 0.1667) % 1;                     // 各自错开六分之一圈
      var sx = Math.round(Math.sin(u * TAU() + i * 1.7) * 1.5) * PX;
      var sy = Math.round(u * 8) * PX;
      var a = 1 - u;
      var b = newBuckets();
      /* 烟团随高度变大（越往上越散）。
         ⚠️ 边长和偏移都必须是 4 的倍数：原来 sw=12 时 sw/2 = 6
         落在半格上，最近邻放大后那几团烟的边是糊的。 */
      var sw = (u < 0.5 ? PX * 2 : PX * 4);
      put(b[4], chimneyX + sx - sw / 2, chimneyY - sy - sw, sw, sw);
      paint(ctx, M, b, a * 0.85);
    }
    /* 动法 2：屋顶 + 墙面被暖光镀了一层（金色半透明，明暗呼吸）。
       这一片两百多格，一明一暗就是几百个像素在变 ——
       光靠烟那点面积，片子里看着还是像一张静态图（实测 min 0.84%）。 */
    var lit = [];
    grab(HOUSE, ox, oy, lit, 6, 17, 1);      // 红屋顶
    grab(HOUSE, ox, oy, lit, 19, 25, 4);     // 米白墙
    tint(ctx, M, lit, 2, 0.34 * breathe(p, 0.3828, 0.6224, 0.1507));
    /* 动法 3：门缝里透出的暖光一闪一闪（每圈 3 次）。
       ⚠️ 灭的时候**不能 return** —— 早先的写法一遇到「灭」就直接 return，
       把后面的层一起跳过了，那几帧画面整个停住。 */
    if (Math.floor(p * 3) % 3 !== 0) {
      var g = newBuckets();
      put(g[2], ox + 7 * PX, oy + 19 * PX, PX * 2, PX * 2);
      paint(ctx, M, g, 0.9);
    }
  };

  /* ============================================================== 2 像素树
     三层树冠的树：蓝色树冠 + 米白高光 + 黑色树干，底层树冠挂着红果子。
     动法：整棵树随风左右摆（±2 格），底层果子周期性脱落、落地淡出。 */
  var TREE = [
    '....................',
    '....................',
    '.........33.........',
    '........3333........',
    '.......433333.......',
    '......33333333......',
    '.......333333.......',
    '......00000000......',
    '........3333........',
    '.......433333.......',
    '......33333333......',
    '.....3333333333.....',
    '......33333333......',
    '.....0000000000.....',
    '.......333333.......',
    '......43333333......',
    '.....3313333333.....',
    '....333333333333....',
    '.....3333331333.....',
    '....000000000000....',
    '.........00.........',
    '.........00.........',
    '.........00.........',
    '.........00.........'
  ];

  FORM.pixelTree = function (ctx, B, p, P, M) {
    crisp(ctx, B, p, P);
    var ox = -8, oy = -8;
    /* 动法 1：整棵树随风左右摆。
       ⚠️ 用**三角波**而不是 sin 取整：sin 取整在两个整格之间会卡住 → 死区。
       幅度 0~3 格（往返），每格停留时间相同，不会出现「停住不动」的帧。 */
    var triW = 1 - Math.abs(((p * 2) % 2) - 1) * 2;   // 0→1→0 三角波
    var sway = Math.round(triW * 3);
    sprite(ctx, M, TREE, ox, oy, { shift: function () { return sway; } });
    /* 动法 2：底层果子掉下来：从树冠第 17 行落到地面，第 6 行归零（接住那两颗） */
    var u = p % 1;
    var gy = 17 + Math.round(u * 6);
    var a = u > 0.82 ? (1 - u) / 0.18 : 1;
    var b = newBuckets();
    put(b[1], ox + (13 + sway) * PX, oy + gy * PX, PX, PX);
    paint(ctx, M, b, a);
    /* 动法 3：几片叶子打着旋往下飘（每片有自己的相位） */
    for (var k = 0; k < 3; k++) {
      var uu = (p + k * 0.33) % 1;
      var lx = ox + (4 + k * 6 + sway) * PX;
      var ly = oy + (2 + Math.round(uu * 16)) * PX;
      var al = Math.sin(Math.PI * uu) * 0.85;
      var lb = newBuckets();
      put(lb[2], lx, ly, PX, PX);
      paint(ctx, M, lb, al);
    }
  };

  /* ============================================================== 3 像素剑
     一把插在石头上的剑：米白钢刃 + 金护手 + 红柄，剑尖埋在蓝色石堆里。
     动法：一道高光沿剑身往下跑，剑身两侧的火花一闪一闪。 */
  var SWORD = [
    '........................',
    '...........0000.........',
    '..........02222.........',
    '..........02222.........',
    '..........011110........',
    '..........011110........',
    '..........011110........',
    '......0222222222220.....',
    '..........000000........',
    '..........04430.........',
    '..........04430.........',
    '..........04430.........',
    '..........04430.........',
    '..........04430.........',
    '..........04430.........',
    '..........04430.........',
    '..........04430.........',
    '..........04430.........',
    '..........04430.........',
    '...........4............',
    '.......0000000000.......',
    '.....34333333333343.....',
    '....3333333333333333....',
    '...333333333333333333...',
    '..33333333333333333333..',
    '..34333333333333333343..',
    '...333333333333333333...',
    '....0000000000000000....'
  ];

  FORM.pixelSword = function (ctx, B, p, P, M) {
    crisp(ctx, B, p, P);
    var ox = -4, oy = 0;
    /* 动法 1：整把剑**上下浮** 0~3 格（三角波 + 取整，不能用 sin 取整 ——
       sin 取整会在两个整格之间卡住 → 死区，实测 t=1.8 那帧只动 0.07%）。
       剑是插在石头上的，浮起来就是「剑气上涌」的感觉。
       ⚠️ 变量名别叫 `tri` —— 文件头已经 `var tri = S.tri`（模块级导入的三角函数），
       局部同名会把那个遮蔽掉。 */
    var triW = 1 - Math.abs(((p * 2) % 2) - 1) * 2;   // 0→1→0 三角波
    var lift = Math.round(triW * 3);
    oy = -lift * PX;

    /* 动法 2：剑身**左右微摆** 0~1 格（配合上下浮，划出小弧线） */
    var sway = Math.round((1 - triW) * 1);
    ox += sway * PX;

    sprite(ctx, M, SWORD, ox, oy, {});
    /* 高光沿剑身往下跑 */
    var u = (p * 2) % 1;
    var row = 9 + Math.floor(u * 10);
    var b = newBuckets();
    put(b[4], ox + 13 * PX, oy + row * PX, PX, PX);
    paint(ctx, M, b, 1);
    /* 剑身两侧的火花：只在四分之一的时间里亮 */
    var s = (p * 2 + 0.5) % 1;
    if (s < 0.22) {
      var c = newBuckets();
      put(c[4], ox + 9 * PX, oy + (row - 1) * PX, PX, PX);
      put(c[4], ox + 15 * PX, oy + (row + 1) * PX, PX, PX);
      paint(ctx, M, c, 0.9);
    }
    /* 拖尾残影：剑尖上方几格逐渐淡出的蓝影（上浮的余韵） */
    var t2 = newBuckets();
    for (var k = 0; k < 4; k++) {
      var al = (1 - k / 4) * 0.5;
      if (al <= 0.02) break;
      var yy = oy - (k + 1) * PX;
      var cc = newBuckets();
      put(cc[3], ox + 11 * PX, yy, PX, PX);
      put(cc[3], ox + 12 * PX, yy, PX, PX);
      paint(ctx, M, cc, al);
    }
  };

  /* ============================================================== 4 像素药水
     圆肚瓶 + 金软木塞，蓝色玻璃里装着红色药水。
     动法：每一列的液面各自摆动（一条斜着晃的液面线），瓶里冒气泡。 */
  var FLASK_HW = [1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 6, 5, 4, 3, 2, 2, 1, 1]; // 第 8~25 行的半宽

  FORM.pixelPotion = function (ctx, B, p, P, M) {
    crisp(ctx, B, p, P);
    var ox = -8, oy = 4, GW = 20, GH = 26;
    var TOP = 8;
    /* 动法 1：整瓶**上下浮 + 左右晃**。
       3 根**整数圈**频率叠起来取整（见 wave）——
       单根三角波在某些相位仍然会落回同一格，那几帧瓶子几乎不动
       （实测 min 1.01%）。多频叠加后每一拍都落在不同的格上。 */
    var dy = wave(p, -0.573, -0.376, -0.864);
    var dx = wave(p, 0.332, 0.898, 0.552);
    ox += dx * PX;
    oy += dy * PX;
    var b = newBuckets();
    var i, r, c, hw, lo, hi, y;
    var lit = [];                                   // 要镀暖光的格子（液体 + 玻璃）

    /* 软木塞 */
    put(b[0], ox + 8 * PX, oy, 4 * PX, PX);
    put(b[2], ox + 8 * PX, oy + PX, 4 * PX, 3 * PX);
    /* 瓶颈：玻璃壁 + 高光 */
    for (r = 4; r < TOP; r++) {
      y = oy + r * PX;
      put(b[3], ox + 8 * PX, y, PX, PX);
      put(b[3], ox + 11 * PX, y, PX, PX);
      put(b[4], ox + 9 * PX, y, PX, PX);
      lit.push(ox + 8 * PX, y, PX, PX, ox + 11 * PX, y, PX, PX);
    }

    /* 瓶身：每行的左右壁 + 里面的液体 */
    var bottom = [];
    for (r = 0; r < GH - TOP; r++) {
      hw = FLASK_HW[r];
      lo = 10 - hw; hi = 9 + hw;                        // 内壁之间的列范围
      y = oy + (TOP + r) * PX;
      put(b[3], ox + (lo - 1) * PX, y, PX, PX);
      put(b[3], ox + (hi + 1) * PX, y, PX, PX);
      lit.push(ox + (lo - 1) * PX, y, PX, PX, ox + (hi + 1) * PX, y, PX, PX);
      for (c = lo; c <= hi; c++) bottom[c] = TOP + r;
    }
    /* 液面：每一列独立地晃 */
    for (c = 4; c <= 15; c++) {
      if (bottom[c] == null) continue;
      var surf = 16 + Math.round(1.8 * Math.sin(p * TAU() + c * 0.55));
      if (surf < TOP + 2) surf = TOP + 2;
      if (surf > bottom[c]) surf = bottom[c];
      for (r = surf; r <= bottom[c]; r++) {
        put(r === surf ? b[4] : b[1], ox + c * PX, oy + r * PX, PX, PX);
        lit.push(ox + c * PX, oy + r * PX, PX, PX);
      }
    }
    /* 玻璃反光 */
    put(b[4], ox + 4 * PX, oy + 11 * PX, PX, 3 * PX);
    lit.push(ox + 4 * PX, oy + 11 * PX, PX, 3 * PX);
    paint(ctx, M, b, 1);

    /* 动法 2：药液和玻璃壁被暖光镀了一层（金色半透明，明暗呼吸）。
       液体一百多格，一明一暗就是上百个像素在变 ——
       这是「每帧都在动」的主力，光靠液面那点变化不够。 */
    tint(ctx, M, lit, 2, 0.32 * breathe(p, 0.4581, 0.4185, 0.3387));

    /* 气泡往上冒 */
    for (i = 0; i < 3; i++) {
      var u = (p * 2 + i / 3) % 1;
      var cc = 6 + i * 4;
      if (bottom[cc] == null) continue;
      var br = bottom[cc] - Math.round(u * 5);
      if (br < 17) continue;
      var cB = newBuckets();
      put(cB[4], ox + cc * PX, oy + br * PX, PX, PX);
      paint(ctx, M, cB, 0.85 * (1 - u));
    }
  };

  /* ============================================================== 5 像素卷轴
     半卷开的羊皮卷：左边一卷卷好的纸筒，右边摊开一片，上面有三行字。
     动法：纸面一收一放（卷轴在慢慢卷起来又摊开），末端一片纸屑在飘。 */
  FORM.pixelScroll = function (ctx, B, p, P, M) {
    crisp(ctx, B, p, P);
    var sheet = [], rim = [], gold = [], det = [];
    var rollX = 16, rollTop = 12;
    /* 动法 1：整张卷轴**上下浮 + 左右挪**。
       3 根**整数圈**频率叠起来取整（见 wave）——
       单根三角波在某些相位仍然落回同一格（实测 min 0.72%）。 */
    var dy = wave(p, -1.049, -0.474, 0.092);
    var dx = wave(p, 0.289, 0.44, 1.654);
    rollX += dx * PX;
    rollTop += dy * PX;

    /* 纸面：长度在收放之间来回
       sy / 纸屑的 y 都挂在 rollTop 底下 —— 之前是写死的 38 / 22，
       挪 rollTop 时纸面不动，整张卷轴就散了。
       ⚠️ 收放也用多频正弦取整：单根三角波在某些相位会落回同一档，
       那几帧纸面既不收也不放，只剩左边卷筒那点高光在动。 */
    var len = 92 + 4 * wave(p, 1.4, 1.1, 0.7);
    /* ⚠️ 所有坐标都必须是 4 的倍数：原来 sx = rollX + 10 = 26、
       字的横条宽 14/10/12/18、sy + 6 / + 18 / + 30 —— 都在半格上，
       最近邻放大后纸边和字全是糊的。这里全部对齐到像素格。 */
    var sx = rollX + 12, sy = rollTop + 16, sh = 44;
    put(sheet, sx, sy, len, sh);

    /* 摊开那端的卷边 */
    var ex = sx + len;
    put(rim, ex, sy - 4, 3 * PX, sh + 8);
    put(gold, ex + PX, sy, PX, sh);

    /* 纸上三行字（断成几段，像字不像横条）+ 下沿暗边 */
    put(det, sx + 8, sy + 8, 16, PX);
    put(det, sx + 28, sy + 8, 12, PX);
    put(det, sx + 44, sy + 8, 12, PX);
    put(det, sx + 8, sy + 20, 20, PX);
    put(det, sx + 32, sy + 20, 12, PX);
    put(det, sx + 48, sy + 20, 16, PX);
    put(det, sx + 8, sy + 32, 12, PX);
    put(det, sx + 24, sy + 32, 20, PX);
    put(rim, sx, sy + sh - PX, len, PX);

    /* 左边那卷纸筒：上下窄中间粗的椭圆 + 中间的卷芯
       ⚠️ 卷筒的 y 挂在 rollTop 上（不是 sy）——
       纸面浮动时卷筒跟着一起动，整张卷轴才是「一个东西」。 */
    var rollY = rollTop;
    var rr;
    for (rr = 0; rr < 18; rr++) {
      var t = rr / 17;
      var hw = Math.round(1 + 2 * Math.sin(Math.PI * t));
      var yy = rollY + rr * 4;
      put(rim, rollX - hw * 4, yy, hw * 8, 4);
      put(gold, rollX - hw * 4 + 4, yy, hw * 8 - 8, 4);
    }
    put(det, rollX - 4, rollY + 28, 8, 40);        // 卷芯
    put(sheet, rollX - 8, rollY + 36, 4, 24);      // 卷口高光

    paintOne(ctx, M, sheet, 4, 1);                   // 纸面
    paintOne(ctx, M, rim, 0, 1);                     // 卷筒外圈 + 暗边
    paintOne(ctx, M, gold, 2, 1);                    // 纸筒内芯 + 卷边
    paintOne(ctx, M, det, 0, 1);                     // 字 + 卷芯线

    /* 动法 2：整张羊皮纸被暖光镀了一层（金色半透明，明暗呼吸）。
       纸面两百多格，一明一暗就是几百个像素在变 ——
       原来只有卷筒上那圈高光在动，实测 min 0.72%，整张纸像贴图。 */
    tint(ctx, M, sheet, 2, 0.34 * breathe(p, 0.2837, 0.4118, 0.4641));

    /* 动法 3：卷筒的**高光带在转**（卷纸的动作暗示）——
       纸面收放的两端会有「停住」的帧（收放到底/到头），
       卷筒的转动是另一个方向的动，两者错开 → 不会同时停。
       ⚠️ 高光带要在整圈里**匀速绕行**，不能也用三角波（三角波两端速度为 0，
       反而会造出新的死区）。
       ⚠️ 位置必须是 4 的倍数：原来 rollY + 2 / rollX - 10 都在半格上。 */
    var spin = (p * 2) % 1;
    var sp = newBuckets();
    /* 高光带：一条 20px 宽、4px 高的横带，沿卷筒上下匀速绕行 */
    var spY = rollY + 4 + Math.round(spin * 9) * 4;
    put(sp[4], rollX - 12, spY, 20, 4);
    put(sp[4], rollX - 8, spY + 4, 12, 4);
    paintOne(ctx, M, sp, 4, 0.8);
    /* 高光拖尾：后面几格逐渐淡出（转动的残影） */
    for (var st = 1; st <= 3; st++) {
      var stY = spY - st * 4;
      if (stY < rollY || stY > rollY + 40) continue;
      var sb = newBuckets();
      put(sb[4], rollX - 8, stY, 16, 4);
      paintOne(ctx, M, sb, 4, 0.28 / st);
    }

    /* 飘落的纸屑 */
    var u = p % 1;
    var f = newBuckets();
    put(f[4], ex - 3 * PX + Math.round(Math.sin(u * TAU() * 2) * 2) * PX,
        rollTop - 4 + Math.round(Math.sin(u * TAU() * 2 + 1) * 2) * PX, PX, PX);
    paint(ctx, M, f, 0.9 * (1 - u));
  };

  /* ============================================================== 6 像素灯塔
     红白条纹的灯塔立在蓝海上，金色塔顶，灯室在转着扫光。
     动法：光束按 16 个方向一步步转（8-bit 的粗步进），灯室跟着一明一暗。 */
  var LIGHTHOUSE = [
    '..............',
    '..............',
    '.....2222.....',
    '....222222....',
    '...22222222...',
    '...00000000...',
    '...04444440...',
    '...00000000...',
    '....111111....',
    '....111111....',
    '....111111....',
    '...44444444...',
    '...44444444...',
    '...44444444...',
    '..1111111111..',
    '..1111111111..',
    '..1111111111..',
    '..4444444444..',
    '..4444444444..',
    '.111111111111.',
    '.111111111111.',
    '.111111111111.',
    '33333333333333',
    '33333333333333'
  ];

  FORM.pixelLighthouse = function (ctx, B, p, P, M) {
    crisp(ctx, B, p, P);
    var ox = 12, oy = 8;
    var bx = ox + 7 * PX, by = oy + 6 * PX;          // 灯室中心 (40, 32)
    var step = Math.floor(p * 16) % 16;
    var ang = step / 16 * TAU();

    /* 光束：从灯室往外扫的扇形，16 分之一步进（粗步进才有 8-bit 的顿挫感） */
    var cs = Math.cos(ang), sn = Math.sin(ang);
    var levels = [[], [], [], []];                     // 四档亮度
    for (var k = 1; k <= 9; k++) {
      var spread = Math.round(k / 3);                  // 越远越散
      for (var j = -spread; j <= spread; j++) {
        var gx = Math.round(cs * k - sn * j);
        var gy = Math.round(sn * k + cs * j);
        var li = k <= 3 ? 0 : (k <= 6 ? 1 : 2);
        if (j !== 0) li = Math.min(3, li + 1);
        put(levels[li], bx + gx * PX, by + gy * PX, PX, PX);
      }
    }
    paintOne(ctx, M, levels[0], 4, 1);
    paintOne(ctx, M, levels[1], 4, 1);
    paintOne(ctx, M, levels[2], 4, 0.85);
    paintOne(ctx, M, levels[3], 4, 0.6);
    /* 塔 */
    sprite(ctx, M, LIGHTHOUSE, ox, oy, {});
    /* 灯室的光一明一暗 */
    var g = newBuckets();
    put(g[4], ox + 5 * PX, oy + 6 * PX, 3 * PX, PX);
    paint(ctx, M, g, 0.4 + 0.6 * bell(p));
  };

  /* ============================================================== 7 金币堆
     几枚金币叠成一小堆：底下三枚、中间两枚、顶上一枚在转。
     动法：最上面那枚金币转起来（宽窄来回变），还往上轻轻一弹。 */
  /* 一枚金币：上窄下宽的椭圆 + 上下两道暗边，低分辨率下才像「币」而不是「砖」 */
  function coin(b, x, y, wCells) {
    var w = wCells * PX;
    if (wCells >= 5) {
      put(b[0], x + 2 * PX, y, w - 4 * PX, PX);
      put(b[2], x + PX, y + PX, w - 2 * PX, PX);
      put(b[2], x, y + 2 * PX, w, 2 * PX);
      put(b[2], x + PX, y + 4 * PX, w - 2 * PX, PX);
      put(b[0], x + 2 * PX, y + 5 * PX, w - 4 * PX, PX);
    } else {
      put(b[2], x, y + PX, w, 3 * PX);
    }
  }

  FORM.pixelCoins = function (ctx, B, p, P, M) {
    crisp(ctx, B, p, P);
    var b = newBuckets();
    var x0 = 4, y0 = 44;
    /* 动法 1：整堆金币**上下浮** 0~2 格（三角波 + 取整，不能用 sin 取整 ——
       sin 取整会卡在两个整格之间 → 死区）。
       原来只有顶币在转，底下 5 枚完全不动，实测变动峰值 0.47%。 */
    var triW = 1 - Math.abs(((p * 2) % 2) - 1) * 2;   // 0→1→0 三角波
    var bobAll = Math.round(triW * 2);
    y0 -= bobAll * PX;
    /* 异相位的**横向晃** 0~1 格：上下浮到顶/底的那一帧不会完全静止 */
    var triW2 = 1 - Math.abs(((p * 2 + 0.25) % 2) - 1) * 2;
    x0 += Math.round(triW2 * 1) * PX;
    /* 底下三枚 */
    coin(b, x0, y0, 8);
    coin(b, x0 + 32, y0, 8);
    coin(b, x0 + 64, y0, 8);
    /* 中间两枚 */
    coin(b, x0 + 16, y0 - 16, 8);
    coin(b, x0 + 48, y0 - 16, 8);
    /* 最上面一枚在转 */
    var spin = Math.abs(Math.cos(p * TAU()));
    var wCells = Math.max(2, Math.round(8 * spin));
    var bob = Math.round(2 * Math.abs(Math.sin(p * TAU())));
    var tx = x0 + 32 - wCells * PX / 2;
    coin(b, tx, y0 - 32 - bob * PX, wCells);
    paint(ctx, M, b, 1);

    /* 顶币上闪一下的高光 */
    var s = (p * 3) % 1;
    if (s < 0.18 && wCells >= 5) {
      var g = newBuckets();
      put(g[4], tx + 2 * PX, y0 - 32 - bob * PX + 2 * PX, PX, PX);
      paint(ctx, M, g, 1);
    }
    /* 动法 2：几枚金币轮流**闪出米白高光**（每枚有自己的相位） */
    for (var k = 0; k < 5; k++) {
      var sk = (p * 2 + k * 0.2) % 1;
      if (sk >= 0.12) continue;
      var g2 = newBuckets();
      var cx2 = x0 + (k < 3 ? k * 32 : 16 + (k - 3) * 32);
      var cy2 = y0 - (k < 3 ? 0 : 16);
      put(g2[4], cx2 + 4 * PX, cy2 + 2 * PX, PX, PX);
      paint(ctx, M, g2, 0.95);
    }
  };

  /* ============================================================== 8 像素篝火
     三根交叉的柴（金黄木头 + 米白断面），上面一团跳动的火苗。
     动法：每一列的火苗高度各自跳舞，火星往上飘。 */
  FORM.pixelCampfire = function (ctx, B, p, P, M) {
    crisp(ctx, B, p, P);
    /* 整幅挪进新盒子：柴和火苗的坐标全是写死的绝对值，
       用一次平移整体搬，比改十来个常量安全。-36/-8 都是 4 的倍数，
       像素网格不破。save/restore 是必须的 ——
       不还原的话这次平移会漏给后面画的帧。 */
    ctx.save();
    ctx.translate(-36, -8);
    var b = newBuckets();
    var x, y, i;

    /* 动法 1：整堆柴火**上下浮** 0~2 格（三角波 + 取整）。
       原来柴完全不动，只有火苗在变 —— 实测变动峰值 1.47%，
       静帧看是好的，片子里像一堆静止的木头。 */
    var triW = 1 - Math.abs(((p * 2) % 2) - 1) * 2;   // 0→1→0 三角波
    var lift = Math.round(triW * 2) * 4;
    ctx.translate(0, -lift);

    /* 交叉的柴：两根对角交叉成 X，第三根横在前面
       台阶高度按 4px 量化 —— 不量化的话 12×12 的柴块落在半格上，
       放大后边缘是糊的（实测半格像素 79 → 244，形状没变只是更「方」）。 */
    for (x = 44; x <= 144; x += 4) {
      y = 104 - 4 * Math.round((x - 44) / 20);
      put(b[2], x, y, 12, 12);
      y = 104 - 4 * Math.round((144 - x) / 20);
      put(b[2], x, y, 12, 12);
    }
    put(b[2], 68, 100, 56, 12);
    /* 柴的断面 */
    put(b[4], 40, 100, 8, 8);
    put(b[4], 140, 100, 8, 8);
    paint(ctx, M, b, 1);

    /* 动法 2：火光在木头上**流转**（红色半透明，明暗呼吸）。
       柴有两百多格，一明一暗就是几百个像素在变 ——
       光靠火苗那点面积，片子里像一堆静止的木头（实测 min 1.47%）。 */
    tint(ctx, M, b[2].concat(b[4]), 1, 0.34 * breathe(p, 0.4485, 0.4475, 0.3129));

    /* 火苗：每一列的高度各自晃。
       ⚠️ 高度里叠了**两个整数圈**频率（K=2 和 K=3）：
       单靠 K=2 的话，某些相位整排火苗的高度完全一样，
       那几帧画面就只剩下柴在动，看着像定格。 */
    var f = newBuckets();
    var core = newBuckets();
    for (i = 0; i <= 18; i++) {
      var cx = 96 + (i - 9) * 4;
      var prof = 1 - Math.abs(i - 9) / 9;
      var h = Math.round((4 + 9 * prof) *
        (0.62 + 0.30 * Math.sin(p * TAU() * 2 + i * 0.62)
               + 0.16 * Math.sin(p * TAU() * 3 + i * 1.31)));
      if (h < 1) continue;
      var top = 84 - h * 4;
      for (var yy = top; yy < 84; yy += 4) {
        var mid = Math.abs(i - 9) <= 3;
        var nearCore = mid && yy > 84 - h * 4 * 0.40;
        put(nearCore ? core[4] : (mid ? core[2] : f[1]), cx, yy, 4, 4);
      }
    }
    paint(ctx, M, f, 1);
    paint(ctx, M, core, 1);

    /* 火星 */
    for (i = 0; i < 6; i++) {
      var u = (p * 2 + i / 6) % 1;
      var ex = 96 + Math.round(2 * Math.sin(u * TAU() * 1.5 + i)) * 4;
      var ey = 30 - Math.round(u * 6) * 4;
      var e = newBuckets();
      put(e[1], ex, ey, 4, 4);
      paint(ctx, M, e, 0.9 * (1 - u));
    }
    ctx.restore();
  };

  /* ============================================================== 9 像素骷髅
     一个头骨：圆圆的头盖骨、两个大眼窝、一个鼻洞、下面一排牙。
     动法（两处，缺一不可）：
     1) **下颌开合**：下颌是独立的 7 行网格，整块往下掉 0~2 格 ——
        像素动画的经典手法，动作幅度大、一眼就看出在动；
     2) 眼窝里的红光左右眼轮着闪（+ 骨粉从颅顶飘散）。
        原来只有第 2 条 —— 眼窝红光只占 1 个小方块，
        实测逐帧变动峰值只有 1.9%，静帧看是好的，片子里几乎不动。 */
  var SKULL_TOP = [
    '....................',
    '........0000........',
    '.....0444444440.....',
    '....0444444444440...',
    '....0444444444440...',
    '....0444444444440...',
    '....0444444444440...',
    '....0444444444440...',
    '....040044440040....',
    '....040044440040....',
    '....040044440040....',
    '....0444444444440...',
    '....044440044440....',
    '....044440444440....',
    '.....04444444440....'
  ];
  var SKULL_JAW = [
    '.....0404040404.....',
    '.....0404040404.....',
    '......04040440......',
    '......04040440......',
    '.......040440.......',
    '.......000000.......',
    '....................'
  ];

  FORM.pixelSkull = function (ctx, B, p, P, M) {
    crisp(ctx, B, p, P);
    var ox = -12, oy = 0;
    /* 动法 1：整颗头**上下浮**。
       ⚠️ 位移必须是 4 的倍数（像素网格不能破），
       所以用「三角波 + 取整」而不是直接 sin*3 ——
       直接 sin 取整会在两个整格之间**卡住**（死区），
       实测 t=1.8 那帧变动像素只有 0.07%，画面几乎不动。
       三角波在一个周期里走完 0→3→0 格，每格停留时间相同，不会卡。 */
    var triW = 1 - Math.abs(((p * 2) % 2) - 1) * 2;   // 0→1→0 的三角波
    var lift = Math.round(triW * 3);
    oy = -lift * PX;
    /* 动法 2：下颌额外往下掉 0~2 格（与抬头反向，像在点头） */
    var drop = Math.round((1 - triW) * 2);
    sprite(ctx, M, SKULL_TOP, ox, oy, {});
    sprite(ctx, M, SKULL_JAW, ox, oy + (SKULL_TOP.length + drop) * PX, {});

    /* 眼窝里的红光：左右眼轮流闪（灭一下再亮） */
    /* ⚠️ 这里**不能 return** —— 早先的写法一遇到「灭」就直接 return，
       把后面的骨粉层也一起跳过了，导致灭的那几帧画面完全静止。 */
    if (Math.floor(p * 8) % 4 < 2) {
      var t = (p * 2) % 2;
      var g = newBuckets();
      if (t < 1) put(g[1], ox + 6 * PX, oy + 8 * PX, PX, 2 * PX);
      else put(g[1], ox + 13 * PX, oy + 8 * PX, PX, 2 * PX);
      paint(ctx, M, g, 0.95);
    }

    /* 骨粉：从颅顶飘散的小方块，循环回原位（无缝） */
    var d = newBuckets();
    for (var i = 0; i < 4; i++) {
      var u = (p + i * 0.25) % 1;
      var dx2 = ox + (hash(19, i, 3) - 0.5) * 9 * PX;
      var dy2 = oy - u * 6 * PX;
      put(d[4], dx2, dy2, PX, PX);
    }
    paint(ctx, M, d, 0.5);
  };

  /* ============================================================== 10 像素旗帜
     一根杆子挑着一面被风吹起的红旗，旗面中间一颗米白五角星。
     动法：波浪从杆子往旗尾传（每一列各自上下错开），星星跟着一起起伏。

     ⚠️ 原来是**横着的横幅**：盒子 460×64，旗面从 x=12 铺到 x=456，
     渲染出来是一条**横贯整个画面**的红带 —— 叠到视频上就是一条横幅，
     跟「可嵌入的小挂件」定位完全不符（马哥一眼就能看出不对）。
     现在改成**竖旗**：杆子插到盒子底部，旗面往右展开，盒子 120×160。 */
  /* 五角星：原来这张字符网格画出来是**十字**（'..4..','..4..','44444',...），
     跟「五角星」完全不像。换成尖朝上的标准五角星。 */
  var EMBLEM = ['.444.', '44444', '.4.4.', '..4..', '..4..'];

  FORM.pixelBanner = function (ctx, B, p, P, M) {
    crisp(ctx, B, p, P);
    var cloth = newBuckets();
    var edge = newBuckets();
    var star = newBuckets();
    var top = 0, bot = 52, last = 26;
    var c, x, k, o, y0, y1, ec, er;

    /* 旗面：逐列画，波浪越到旗尾越大。
       ⚠️ 旗面改小（120×150 的盒子）之后动态像素只剩 0.78% → 死区。
       加强三处：①波浪振幅 2→3 格；②下缘摆幅是上缘的 1.6 倍（旗下方更松）；
       ③旗尾做**燕尾**，多出一截随波摆的布 —— 动态面积直接翻倍。
       所有偏移必须是 4 的倍数（像素不能落半格），所以 1.6 倍要先取整再用。 */
    var o2;
    for (c = 2; c <= last; c++) {
      x = 8 + (c - 2) * PX;
      k = (c - 2) / (last - 2);
      o = Math.round(3 * Math.sin((c - 2) * 0.18 - p * TAU()) * k);
      o2 = Math.round(o * 1.3);
      y0 = top + o * PX; y1 = bot + o2 * PX;
      put(cloth[1], x, y0 + PX, PX, y1 - y0 - PX);
      put(edge[0], x, y0, PX, PX);
      put(edge[0], x, y1 - PX, PX, PX);
      /* 燕尾：最后几列在旗面下方多挂一截布，越靠旗尾越长（最多 3 格）。
         原来按 (1 + o2*0.5) 算，最长能到 6 格 → 拖成一条瀑布，不像燕尾。 */
      if (c > last - 4) {
        var tail = Math.round((c - (last - 4)) * 0.7);
        put(cloth[1], x, y1, PX, tail * PX);
        put(edge[0], x, y1 + tail * PX - PX, PX, PX);
      }
      /* 五角星跟着旗面一起起伏 */
      ec = c - 9;
      if (ec >= 0 && ec < 5) {
        for (er = 0; er < 5; er++) {
          if (EMBLEM[er].charAt(ec) === '4') {
            put(star[4], x, top + (4 + er) * PX + o * PX, PX, PX);
          }
        }
      }
    }
    paintOne(ctx, M, cloth[1], 1, 1);     // 旗面
    paintOne(ctx, M, edge[0], 0, 1);     // 上下暗边（压在旗面上）
    paintOne(ctx, M, star[4], 4, 1);     // 星

    /* 杆子（竖直，从旗面根部一直插到盒子底） */
    var pole = newBuckets();
    put(pole[0], 0, 52, 4, 98);
    put(pole[4], 4, 52, 4, 98);
    put(pole[4], 0, 44, 8, 8);            // 顶上的球头
    put(pole[0], 0, 52, 8, 4);
    paint(ctx, M, pole, 1);
  };

})(window.Sticker);
