# 大数字主块三副块视觉规范

## 方向

一块 720×360 承重主块自下 120px 顶起，块内 160px mono 巨数字用 steps(22) 硬跳；顶面 3 联凸点逐枚硬切，主块下方三块 240×120 副块零间隙并排顶出。（数据汇报 / 图表数据，5.5s）。一个数要当主结论、另三个数做脚注时。

本条属于积木风族：3px 纯黑描边 + 无模糊硬阴影 + 4px 直角 + 凸点 stud，块宽只走 120/240/480/720 四档。与 BLOCKBRUT 的真正区分是五项——锁 8px 格点、阴影按功能分两档（不是按件大小分四档）、有凸点、入场以垂直轴为主、底永远是桌面。

## Palette

- Background: `#FFF6E5`（暖纸桌面）
- Foreground: `#0F0F0F`（描边 / 正文 / 桌沿铭牌底）
- Accent: `#FFD429`（强调色变量；凸点亮起色 / 斜纹带 / 页脚计数色）
- 色板八色（照抄，不新增）: `#0F0F0F` `#FFF6E5` `#FF5FA2` `#FFD429` `#3D7BFF` `#2FD07A` `#FFFFFF` `#6B6B6B`
- 块面轮转序恒为 yellow → pink → blue → green，一屏彩色块 ≤4 且不重色，第一个落位的块恒 yellow
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

## Typography

- 中文标题 / 正文：`Noto Sans SC`，字重 900 / 700，52–160 px，letter-spacing **0**（中文不收紧）
- 数字 / 编号 / 英文缩写 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .10–.14em（中文数字说明仍用 sans）
- 微标签 / 眉标：24 px，`letter-spacing:.14em`；≤26px 的次级信息才可用 `#6B6B6B`
- 页面实测字号跨度：24–160px（最大 160px 是主数字/主价格）

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：桌沿铭牌 56px（ink 底，贴桌面之外）→ 主区 → 斜纹带 20px（bottom 64）→ 页脚 64px
- `.main`：left 600px，top 340px，width 720px，height 360px
- `.subs`：left 600px，top 697px，width 720px，height 120px
- `.studs`：left 900px，top 280px，width 360px，height 60px
- `.head`：left 240px，top 120px，width 1440px
- 块宽只用 120/240/480/720，块高只用 120/240/360/480；相邻块以 -3px 负边距合成单线缝

## 动画

- 时长 5.5s；落定红线 0.76 × 5.5 = **4.18**（当前实现远早于此，末段只留定格）
- 式 4 顶出：720×360 承重主块自下 +120px 顶起，承重件 10px 影
- 主块内 160px mono 巨数字用 `steps(22)` 硬跳，展示窗口写死 `RUN = 1.1`
- 式 2 堆叠：三块 240×120 副块零间隙并排顶出，共用同一段 +120px 位移、逐块错峰
- 式 8 凸点：主块顶面 3 联凸点逐枚硬切
- 落位时刻：0（`slam()` 的第二个参数，逐块错峰 0.12–0.42s）
- 凸点：式 8，`fill` 在 `#FFFFFF` 与 Accent 之间硬切，单枚间隔 ≥0.12s，不做连续补间
- 降级分支：撤掉全部搬移与压影，只给终态 + 一段 8px 微位移淡入（≤0.60s）后定格

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
- **展示窗口写死 1.1s**（`RUN = 1.1`），变量只决定显示的数值。禁止 `RUN = TARGET / RATE`——数值填大就把时间轴撑爆撞 SMOKE_TOO_LONG。
- onUpdate 里只写 textContent，**绝不做 DOM 测量**（getBoundingClientRect / getComputedStyle）。
- 回调类终态必须用前进式 seek 验收（`totalTime(0,true)` 再 `totalTime(t,false)`）；直接 `seek(t)` 默认 suppressEvents=true，会看到计数器停在初始值——那是截图假象不是 bug。
- 不做坐标轴、不做 1px 刻度、不做双轴；`note` 必须写清单位与统计口径。
- **凸点必须单跑 `style_check.py` 才抓得到**：出框探针、motion-qc、selfcheck 三道门禁全绿也不管凸点。本批 dq-05 首轮就是「JS 里写了 `querySelectorAll('.sc')` 与逐枚硬切逻辑、body 里却没写 SVG」，三道门禁全过、只有 style_check 报 `✗0`。**写了硬切逻辑就一定要写 circle，两者要一起改。**
- **凸点排版用 flex 行 + `margin-left:auto`，不要用绝对定位钉角**。第三批 dq-05 首版把 60×60 凸点绝对定位到段块右上角，量矩形发现它和 `.k` / `.n` 的盒子盒重叠（flex 子项默认 stretch，盒子横跨整个内容宽、而文字左对齐只占前几十 px）。当下看着不撞字，用户把数值填成 7–8 位数就会真的压上。照 `brik-ec-09` 的写法：凸点与标签同处一个 `display:flex` 行、`margin-left:auto` 顶到右端，flex 天生不重叠。
- **`gen_b2_lib.py` 的 `stud_svg(n_studs=1)` 有 bug**：`cx = 60 + 120 * i` 在 i=0 时给出 cx=60，而 viewBox 只有 60 宽，凸点整个被裁掉。单枚凸点一律手写 `<circle cx="30" cy="30" r="22">`，与 `brik-ec-14` 现有写法一致。
- **段内纵向余量要先算再排版**：块高被模数锁死（这里 240px），加一行 60px 凸点后内容总高必须 ≤ 块高。本批 dq-05 为此把段内 `gap` 从 12 收到 8（内容 225px ≤ 240px），改完要用量矩形工具复核四行 y 区间互不重叠。

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（本期讲法标签） | `一个数` |
| `title` | string | 主标题（8–16 字） | `这半年最该记住的一个数` |
| `note` | string | 口径（单位与统计范围，必填） | `口径：2026 上半年 · 全渠道 · 单位 单` |
| `big` | string | 主数字（数字部分即可，不带单位） | `248` |
| `label` | string | 主数字标签（≤8 字） | `累计交付成片` |
| `s1` | string | 副块一（≤6 字） | `环比 +38%` |
| `s2` | string | 副块二（≤6 字） | `同比 +92%` |
| `s3` | string | 副块三（≤6 字） | `达标率 96%` |
| `unit` | string | 单位（2–4 字，不拼进数字串） | `单` |
| `accent` | color | 强调色（凸点亮起色 / 斜纹带 / 单位 pill / 页脚计数） | `#FFD429` |
| `brickColor` | enum | 配色包（块面轮转顺序） → yellow=暖黄主调 / pink=桃粉主调 / green=薄荷主调 / blue=靛蓝主调 / mixed=四色轮转 | `mixed` |
| `studMode` | enum | 凸点（不显示 / 整排同时亮 / 逐枚硬切） → none=不显示 / top=整排同时亮 / scan=逐枚硬切 | `scan` |
| `duration` | number | 总时长（秒，5–6） | `5.5` |
| `exportMode` | enum | Format → mp4=MP4 / webm=WebM / transparent=透明底 | `mp4` |

## 配套

- 本地预览：`http://127.0.0.1:4313/brik-demo.html?tpl=brik-dq-06`（打开即自动播放、控制条可暂停拖进度）
- 真源：`<id>/index.html` 的 `data-composition-variables`；catalog 的 `schema` 由它逐项生成，不手抄
- 同族样板：`brik-ec-01`（价格砸换）/ `brik-ec-02`（三卖点堆叠）/ `brik-ec-09`（六格凸点清单）/ `brik-dq-01`（里程碑柱）
