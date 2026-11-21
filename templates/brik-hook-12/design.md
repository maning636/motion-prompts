# 凸点倒数跳字块视觉规范

## 方向

480×360 ink 倒数块砸落，块内 200px mono 数字 3→2→1 按写死的 0.55s 窗硬跳，每跳一次块下 3 联凸点硬切亮一枚；倒数完钩子句横条与行动块先后砸落。（短视频引流 / 开场钩子，5.5s）。需要用倒数把开场节奏压成读秒、数字在一个块里硬跳时。

本条属于积木风族：3px 纯黑描边 + 无模糊硬阴影 + 4px 直角 + 凸点 stud，块宽只走 120/240/480/720 四档（≥1440 的 240 整数倍通栏带另行放行）。与 BLOCKBRUT 的真正区分是五项——锁 8px 格点、阴影按功能分两档（不是按件大小分四档）、有凸点、入场以垂直轴为主、底永远是桌面。

## Palette

- Background: `#FFF6E5`（暖纸桌面）
- Foreground: `#0F0F0F`（描边 / 正文 / 桌沿铭牌底）
- Accent: `#FFD429`（强调色变量；凸点亮起色 / 斜纹带 / 页脚计数色）
- 色板八色（照抄，不新增）: `#0F0F0F` `#FFF6E5` `#FF5FA2` `#FFD429` `#3D7BFF` `#2FD07A` `#FFFFFF` `#6B6B6B`
- 块面轮转序恒为 yellow → pink → blue → green，一屏彩色块 ≤4 且不重色，第一个落位的块恒 yellow
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`
- 倒数块与钩子句横条恒 ink 底；配色包驱动唯一的彩色件——行动块

## Typography

- 中文标题 / 正文：`Noto Sans SC`，字重 900 / 700，40–48–200 px，letter-spacing **0**（中文不收紧）
- 数字 / 编号 / 英文缩写 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .10–.14em（中文数字说明仍用 sans）
- 微标签 / 眉标：24 px，`letter-spacing:.14em`；≤26px 的次级信息才可用 `#6B6B6B`
- 页面实测字号跨度：24–200px（最大 200px 是主数字或主大字）

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：桌沿铭牌 56px（ink 底，贴桌面之外）→ 主区 → 斜纹带 20px（bottom 64）→ 页脚 64px
- `.cd`：left 720px，top 180px，width 480px，height 360px
- `.hookbar`：left 240px，top 700px，width 1440px，height 120px
- `.ctabox`：left 600px，top 868px，width 720px，height 120px
- `.studbar`：left 780px，top 588px，width 360px，height 60px
- 块宽只用 120/240/480/720（**960 / 1008 / 1080 这类中间的数一律违规**，只有 ≥1440 的 240 整数倍通栏带才放行）；块高只用 120/240/360/480
- 相邻块以 -3px 负边距，或 `border-left-width:0` / `border-top-width:0` / `border-bottom-width:0`，合成单线缝
- **顶出块（式 4）的落定 bottom 要再留 120px 余量**：起跳帧比落定位置低 120px，`落定 bottom + 120 ≤ 1080` 才不越框

## 动画

- 时长 5.5s；落定红线 **3.2**（hook 族：比 kb / ec 早 1 秒，末段留长定格给平台追加文案位）
- 式 1 砸落：480×360 ink 倒数块自上沿砸落（承重件 10px 影），块内 200px mono 数字 3→2→1 按**写死的 `RUN = 0.55` 窗**硬跳
- **跳字用 `tl.call` 在定点写 textContent**（落定期签名 seek 是 `t.time(ts,false)`，事件会触发，窗口内四帧必然一致）；**正常与降级两分支的数字跳都走 `tl.call`**，不许在降级分支直接写 DOM
- 每跳一次：块下 3 联凸点硬切亮一枚 + 倒数块压影 2 帧（`set` 压影再 `steps(2)` 弹回）
- 倒数完钩子句横条（1440×120）与行动块（720×120）先后砸落，motionEnd ≈2.6s
- 落位时刻：0 / 1.95 / 2.3（`slam()` 的第二个参数，逐块错峰 0.10–0.30s）
- 数字跳变：`tl.call` 定点写 textContent + 写死的 0.55s 展示窗口（`RUN = 0.55`），两分支一致，禁止 `TARGET/RATE`
- 凸点：式 8，`fill` 在 `#FFFFFF` 与 Accent 之间硬切，单枚间隔 ≥0.12s，不做连续补间
- 降级分支：撤掉全部搬移与压影与白闪，只给终态 + 一段 8px 微位移淡入（≤0.60s）后定格

## Avoid

- 块宽只用 **120 / 240 / 480 / 720**，块高只用 **120 / 240 / 360 / 480**；间隙只许 24 / 32 / 48 / 120 / 240，不许 20–60px 的随机间隙（那是奶油风的「散落卡片」）。
- 描边恒 `3px` 纯黑 `#0F0F0F`，**全文件唯一线宽**；相邻块用 `margin -3px`（或 `margin-left:-3px`）把两条描边合成一条单线缝，不许上下各留 3px 的双线缝。
- 圆角只用 `4px`（方块）与 `9999px`（pill）两档，没有第三种；禁止 `border-radius:50%`（凸点必须走 SVG circle）。
- 阴影只有两档：普通块恒 `8px 8px 0`，承重/底座件 `10px 10px 0`，深底上改 `8px 8px 0 #FFFFFF`。**X 恒等于 Y、blur 恒 0、永不写第 4/5/6 个值**。
- **flex 行里的每一个文字都要显式 `min-width:0`**：flex item 的 `min-width` 初值是 `auto`，不写就永不收缩，标签一长就把 240 的块撑成 250（破模数），`B.fit()` 也抓不到（它拿元素 scrollWidth 跟**父元素** clientWidth 比）。
- **版式只用 flex + 显式 width**，不要用「grid auto 尺寸 + 负外边距」——那会把 480 的块撑成 483、240 撑成 243。
- **GSAP 选择器必须带 `#`**：裸 id 数组会被当成标签选择器，`querySelectorAll("row1")` 命中 0 个，补间静默不存在，只有 motion-qc 的 SMOKE_STATIC 抓得到。取元素一律 `querySelector`。
- **降级短路那一行必须逐字节固定**：`var reduce = window.matchMedia\n    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;`。写成 `true && window.matchMedia(...)` 不会短路（`&&` 返回最后一个操作数），降级分支根本没进过。
- 零 overshoot：禁 `back.*` / `elastic.*` / `bounce.*` / `slowMo` / `sine.inOut` / `sine.out`；入场只走 `power4.out` / `power3.out` ≤0.26s；禁 `power1.*` / `power2.*` 做入场。
- **入场只走单轴**：`x` 与 `y` 不同时位移（斜向只属于 `.btn:active` 的 3/3 按压反馈）；`scale` 恒 1、零 `rotate` / `skew`。
- 不用 opacity 淡入当主入场手段；不用超过 0.08s 的 opacity 补间。阴影只在档位间 `set` / `steps` 跳，不做连续数值补间。
- `box-shadow` 补间只许在档位间跳（`set` + `steps(2)`），不许把偏移做连续缩放。
- 唯一的非平涂是 45° `repeating-linear-gradient` 斜纹带（周期 10+10=20px）与 10px 点阵网点；其余一律平涂实色，禁 `filter:blur` / `backdrop-filter` / 半透明色块。
- 变量类型只用 `string` / `color` / `number` / `enum`，**禁用 `select`**（hyperframes 0.8.55 的变量解析器不认）；一条最多 3 个 enum。
- 落定红线：motionEnd ≤ **0.76 × 总时长**（量产安全区 0.70）。kb / ec 5.5s → ≤4.18s；lt 5s → ≤3.8s；wall 6s → ≤4.56s。
- `B.fitAll()` 必须在 `B.tl()` 之前，`B.tl()` 全文件恰好一次；`B.vars()` 空参调用，不写手抄兜底对象。
- **hook 族的语域是短视频引流**：三秒内必须说清一个钩子，末段留长定格给平台追加文案位。**不要把 ent 的「信息铺满」或 dq 的「口径说明」搬进来** —— 本族只留一句钩子、一个反转、一个行动。
- **`slot` 恒 `hook`**（不是 `card`），`partTags` 恒 `开场钩子`，`pack` 恒 `短视频引流`。画幅仍是 `1920×1080`，竖屏由下游裁切，不改模板画幅。
- **时长仍是 5.5s，不是 3s** —— 三秒钩子靠落位节奏压出来（motionEnd ≤ 3.2s），不靠短时长。
- **全族零 overshoot**：钩子的压迫感来自「砸得死」不是「弹得甜」。禁 `back.*` / `elastic.*` / `bounce.*`。
- **白闪只用 `tl.set()` 单帧硬切**（`boxShadow` 换成 `#FFFFFF`，下一帧立刻回 ink），不做 tween、不叠 opacity 淡入淡出。
- **`B.fit()` 拿元素的「父级 clientWidth」当可用宽，父级带 padding 时会高估可用宽、收口收不住**。后果是长句仍然 `nowrap` 溢出，被出框探针判 clip（本批 ent-10 首版就踩了：`.panel` 上挂 `padding:0 48px`，13 个 48px 汉字 = 624px 挤在 618px 可用宽里）。**修法：把 padding 挪到多一层的 `.in` 上，让 `data-fit` 元素的直接父级是零 padding 的盒子。**
- **共用位移量必须由位置最高的那个元素反推**（`fromCeil('#i1')` 之类），逐块各算各的会让下面几块起点跑到画布上沿之外 —— 只有出框探针抓得到。
- **`foot` / `base` 这类页脚变量要么在 body 里真的放 `<span id="foot">`，要么从 `VARS` 和 `TEXTVARS` 里一起删掉**，漏删任一边 selfcheck 第 10 条就红。注意容器 id 与变量 id 别撞名（本批 ent-15 的容器改成 `#sealTop`，变量才叫 `base`）。
- **`style_check.py` 读 `describe.json`、`describe.py` 读预览副本**。顺序固定：generate → `sync_brik.py` → `describe.py` → `fmt_describe.py` → `style_check.py`。**凸点是唯一只能被 `style_check.py` 抓到的门**（selfcheck / motion-qc / 出框探针三道全绿也不管凸点），所以每批收尾必须单跑它、看「凸点」那一列。
- **`brik-hook` 是全族第一个 `slot: hook` 的子族**（库内 56 条在用该 slot，站点侧已支持）。入库时 `slot` 必须从 `meta.json` 原样取成 `hook`，不要被 register 脚本按 `pack` 覆盖掉。
- **`#stage` 上的 `overflow:hidden` 是允许的，被禁的是文字 span 上的 `overflow:hidden`** ——给 nowrap 文字 span 加 `overflow:hidden` 又把 `line-height` 压紧，行盒比盒子高 4px 就被判 clip。照 `brik-ec-09` 的 `.x` 写：`flex:0 1 auto; min-width:0; line-height:1.2; white-space:nowrap`。
- **落定红线的反算法**：式 4 顶出（`y:+120`）的起跳帧比落定低 120px，所以承重块要按 `落定 bottom + 120 ≤ 1080` 反算位置，不是只看落定帧。本批 12 条全部按这条算过。
- **倒数跳字若在降级分支里直接 `el.textContent='1'`**，正常分支 seek 采样时 `tl.call` 可能未触发，两分支签名会差在数字上。**两个分支的数字跳都走 `tl.call`**（selfcheck 18 的 seek 是 `t.time(ts, false)`，事件会触发；且所有 call 都在落定期起点之前）。
- **hook-07 整列上滚时旧句会掠过卡位上方、新句滚动前露在卡位下方**：新句滚动起始拍前 `opacity:0` 硬切藏着；旧句滚完立即 `opacity:0` 硬切收掉。都不切 display。
- **hook-06 两块 720×360 对撞，位移量若共用同一个数**，一侧起跳点会越过画布沿：左块 `leftOf('#oldBlk')`、右块 `rightOf('#newBlk')` 各自现算。
- **三连问问句写成 13 字以上**，720 格（hook-11）会顶破模数：问句 ≤12 字写进 label，44px 在 720 格的实际上是 13 字，留一字余量。
- **240×120 词块（hook-03）塞进 5 字以上**，44px 会撑破块：`titleA/B/C` 各 ≤4 字写进 label（4 字 × 44 + padding 44 = 220 ≤ 240）。
- **容器 id 与变量 id 别撞名**：行动块容器叫 `ctaBox`、文字 span 才叫 `cta`；给容器 `set()` 会把文字 span 整个冲掉。

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（栏目标签，不是钩子） | `倒数三秒` |
| `title` | string | 钩子句（≤12 字） | `这条视频别划走` |
| `sub` | string | 副句（10–20 字） | `三秒之后，答案落地` |
| `cta` | string | 行动块（4–10 字） | `评论区扣 1` |
| `accent` | color | 强调色（凸点亮起色 / 眉标 / 斜纹带 / 页脚计数） | `#FFD429` |
| `brickColor` | enum | 配色包（块面轮转顺序） → yellow=暖黄主调 / pink=桃粉主调 / green=薄荷主调 / blue=靛蓝主调 / mixed=四色轮转 | `mixed` |
| `studMode` | enum | 凸点（不显示 / 整排同时亮 / 逐枚硬切） → none=不显示 / top=整排同时亮 / scan=逐枚硬切 | `scan` |
| `duration` | number | 总时长（秒，5–6） | `5.5` |
| `exportMode` | enum | Format → mp4=MP4 / webm=WebM / transparent=透明底 | `mp4` |

## 配套

- 本地预览：`http://127.0.0.1:4313/brik-demo.html?tpl=brik-hook-12`（打开即自动播放、控制条可暂停拖进度）
- 真源：`<id>/index.html` 的 `data-composition-variables`；catalog 的 `schema` 由它逐项生成，不手抄
- 同族样板：`brik-hook-01`（反常识砸限位）/ `brik-hook-02`（误区抽换反转）/ `brik-ent-10`（水平对撞）/ `brik-ent-17`（数字顶出横列）
- 跨族样板：`brik-dq-01`（steps(22) 数字跳）/ `brik-ec-09`（六格凸点清单）/ `brik-ec-06`（递进条分段宽现算）
- 视觉抽检：把缩略图缩到 200px 宽，看有没有一排带黑边的圆点（stud）——有 stud 的那一张才是积木风
