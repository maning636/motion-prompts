# 里程碑五段纵向堆叠视觉规范

## 方向

五块 480×120 里程碑块自基线下方逐块顶起、在同一列塔位上共边成塔，每块带一枚凸点作序号；塔顶自下顶出一块 480×120 承重块封口。（企业宣传 / 信息卡片，5.5s）。时间线要读成「塔」而不是「横排」时。

本条属于积木风族：3px 纯黑描边 + 无模糊硬阴影 + 4px 直角 + 凸点 stud，块宽只走 120/240/480/720 四档（≥1440 的 240 整数倍通栏带另行放行）。与 BLOCKBRUT 的真正区分是五项——锁 8px 格点、阴影按功能分两档（不是按件大小分四档）、有凸点、入场以垂直轴为主、底永远是桌面。

## Palette

- Background: `#FFF6E5`（暖纸桌面）
- Foreground: `#0F0F0F`（描边 / 正文 / 桌沿铭牌底）
- Accent: `#FFD429`（强调色变量；凸点亮起色 / 斜纹带 / 页脚计数色）
- 色板八色（照抄，不新增）: `#0F0F0F` `#FFF6E5` `#FF5FA2` `#FFD429` `#3D7BFF` `#2FD07A` `#FFFFFF` `#6B6B6B`
- 块面轮转序恒为 yellow → pink → blue → green，一屏彩色块 ≤4 且不重色，第一个落位的块恒 yellow
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`
- 落印 / 判词 / 落款块恒 ink 底（`#0F0F0F`）+ 白字 + 强调色小字，是本族的收口件

## Typography

- 中文标题 / 正文：`Noto Sans SC`，字重 900 / 700，44 px，letter-spacing **0**（中文不收紧）
- 数字 / 编号 / 英文缩写 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .10–.14em（中文数字说明仍用 sans）
- 微标签 / 眉标：24 px，`letter-spacing:.14em`；≤26px 的次级信息才可用 `#6B6B6B`
- 页面实测字号跨度：24–44px（最大 44px 是主数字或主大字）

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：桌沿铭牌 56px（ink 底，贴桌面之外）→ 主区 → 斜纹带 20px（bottom 64）→ 页脚 64px
- `.col`：left 720px，top 340px，width 480px，height 588px
- `.base`：left 720px，top 216px，width 480px，height 120px
- `.head`：left 600px，top 92px，width 720px
- 块宽只用 120/240/480/720（**960 / 1008 / 1080 这类中间的数一律违规**，只有 ≥1440 的 240 整数倍通栏带才放行）；块高只用 120/240/360/480
- 相邻块以 -3px 负边距，或 `border-left-width:0` / `border-top-width:0` / `border-bottom-width:0`，合成单线缝
- **顶出块（式 4）的落定 bottom 要再留 120px 余量**：起跳帧比落定位置低 120px，`落定 bottom + 120 ≤ 1080` 才不越框

## 动画

- 时长 5.5s；落定红线 **4.18**（安全区 0.70 × 5.5 = 3.85）
- 式 2 堆叠：五块 480×120 里程碑块自基线下方 +120px 逐块顶起，在同一列塔位上共边成塔，**共用同一段位移、逐块错峰**
- **凸点排布错开：奇数块右端、偶数块左端** —— 120px 行高放不下两条 60px 凸点，同侧排会挤掉年份字
- 式 4 顶出：塔顶自下 +120px 顶出 480×120 封口块（承重件 10px 影）
- **这是 `brik-ent-02` 横排八格墙的纵向翻版**，块面按 `pack[i % 4]` 轮转
- 落位时刻：0 / 1.42（`slam()` 的第二个参数，逐块错峰 0.10–0.30s）
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
- **ent 族的语域是企业宣传**：主数字（团队规模、档位价、客户数）要压得住，收尾要有落印或承重件。**不要把 kb 的「三步讲道理」或 hook 的「反常识砸场」搬进来** —— 本族讲的是「我们是谁 / 做过什么 / 怎么合作 / 怎么联系」。
- **落印块 / 判词块恒 ink 底白字**（`.seal` / `.verdict` / `.stamp` 三处），且恒用承重件 10px 影；它是本族的收口件，不要为了省一档阴影把它降成 8px。
- **「顶部说明条 + 主体块 + 末尾 720×120 承重块」是本族的标准三段骨架**，主体块可以换手法，骨架不换。本批只有 `brik-ent-18` 例外（以落印块直接收尾）。
- contact / 地址 / 价格 / 起步价这类文案一律 `string`，**不许用 `number`** —— 避免用户把连字符、小数位、千分位填丢。
- **`B.fit()` 拿元素的「父级 clientWidth」当可用宽，父级带 padding 时会高估可用宽、收口收不住**。后果是长句仍然 `nowrap` 溢出，被出框探针判 clip（本批 ent-10 首版就踩了：`.panel` 上挂 `padding:0 48px`，13 个 48px 汉字 = 624px 挤在 618px 可用宽里）。**修法：把 padding 挪到多一层的 `.in` 上，让 `data-fit` 元素的直接父级是零 padding 的盒子。**
- **共用位移量必须由位置最高的那个元素反推**（`fromCeil('#i1')` 之类），逐块各算各的会让下面几块起点跑到画布上沿之外 —— 只有出框探针抓得到。
- **`foot` / `base` 这类页脚变量要么在 body 里真的放 `<span id="foot">`，要么从 `VARS` 和 `TEXTVARS` 里一起删掉**，漏删任一边 selfcheck 第 10 条就红。注意容器 id 与变量 id 别撞名（本批 ent-15 的容器改成 `#sealTop`，变量才叫 `base`）。
- **`style_check.py` 读 `describe.json`、`describe.py` 读预览副本**。顺序固定：generate → `sync_brik.py` → `describe.py` → `fmt_describe.py` → `style_check.py`。**凸点是唯一只能被 `style_check.py` 抓到的门**（selfcheck / motion-qc / 出框探针三道全绿也不管凸点），所以每批收尾必须单跑它、看「凸点」那一列。
- **`brik-hook` 是全族第一个 `slot: hook` 的子族**（库内 56 条在用该 slot，站点侧已支持）。入库时 `slot` 必须从 `meta.json` 原样取成 `hook`，不要被 register 脚本按 `pack` 覆盖掉。
- **`#stage` 上的 `overflow:hidden` 是允许的，被禁的是文字 span 上的 `overflow:hidden`** ——给 nowrap 文字 span 加 `overflow:hidden` 又把 `line-height` 压紧，行盒比盒子高 4px 就被判 clip。照 `brik-ec-09` 的 `.x` 写：`flex:0 1 auto; min-width:0; line-height:1.2; white-space:nowrap`。
- **落定红线的反算法**：式 4 顶出（`y:+120`）的起跳帧比落定低 120px，所以承重块要按 `落定 bottom + 120 ≤ 1080` 反算位置，不是只看落定帧。本批 12 条全部按这条算过。

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（栏目标签） | `走到哪一步` |
| `title` | string | 主标题（8–16 字） | `五年只做一件事，做成了五段` |
| `m1` | string | 里程碑 1（6–12 字） | `第一版系统上线` |
| `y1` | string | 年份 1（4 位数字） | `2021` |
| `m2` | string | 里程碑 2（6–12 字） | `标准化交付流程` |
| `y2` | string | 年份 2（4 位数字） | `2022` |
| `m3` | string | 里程碑 3（6–12 字） | `内容中台自研` |
| `y3` | string | 年份 3（4 位数字） | `2023` |
| `m4` | string | 里程碑 4（6–12 字） | `跨城团队成型` |
| `y4` | string | 年份 4（4 位数字） | `2024` |
| `m5` | string | 里程碑 5（6–12 字） | `方法论对外开放` |
| `y5` | string | 年份 5（4 位数字） | `2025` |
| `base` | string | 封口块（6–12 字） | `下一段在交付里` |
| `accent` | color | 强调色（凸点亮起色 / 斜纹带 / 页脚计数） | `#FFD429` |
| `brickColor` | enum | 配色包（块面轮转顺序） → yellow=暖黄主调 / pink=桃粉主调 / green=薄荷主调 / blue=靛蓝主调 / mixed=四色轮转 | `mixed` |
| `studMode` | enum | 凸点（不显示 / 整排同时亮 / 逐枚硬切） → none=不显示 / top=整排同时亮 / scan=逐枚硬切 | `scan` |
| `duration` | number | 总时长（秒，5–6） | `5.5` |
| `exportMode` | enum | Format → mp4=MP4 / webm=WebM / transparent=透明底 | `mp4` |

## 配套

- 本地预览：`http://127.0.0.1:4313/brik-demo.html?tpl=brik-ent-15`（打开即自动播放、控制条可暂停拖进度）
- 真源：`<id>/index.html` 的 `data-composition-variables`；catalog 的 `schema` 由它逐项生成，不手抄
- 同族样板：`brik-ent-08`（联系落印收尾）/ `brik-ent-13`（三栏轨道推入）/ `brik-ent-17`（四项数字顶出）/ `brik-hook-01`（反常识砸限位）
- 跨族样板：`brik-dq-01`（steps(22) 数字跳）/ `brik-ec-09`（六格凸点清单）/ `brik-ec-06`（递进条分段宽现算）
- 视觉抽检：把缩略图缩到 200px 宽，看有没有一排带黑边的圆点（stud）——有 stud 的那一张才是积木风
