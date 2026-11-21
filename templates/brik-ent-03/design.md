# 服务三步横推视觉规范

## 方向

三块 480×240 步骤块自右沿沿同一条水平轨道依次推入终点格位，每块正中一枚凸点随块落位硬切，末尾承重块收口。（企业宣传 / 信息卡片，5.5s）。合作流程有三步、且要读出「一步步推进」的时间感时。

本条属于积木风族：3px 纯黑描边 + 无模糊硬阴影 + 4px 直角 + 凸点 stud，块宽只走 120/240/480/720 四档。与 BLOCKBRUT 的真正区分是五项——锁 8px 格点、阴影按功能分两档（不是按件大小分四档）、有凸点、入场以垂直轴为主、底永远是桌面。

## Palette

- Background: `#FFF6E5`（暖纸桌面）
- Foreground: `#0F0F0F`（描边 / 正文 / 桌沿铭牌底）
- Accent: `#FFD429`（强调色变量；凸点亮起色 / 斜纹带 / 页脚计数色）
- 色板八色（照抄，不新增）: `#0F0F0F` `#FFF6E5` `#FF5FA2` `#FFD429` `#3D7BFF` `#2FD07A` `#FFFFFF` `#6B6B6B`
- 块面轮转序恒为 yellow → pink → blue → green，一屏彩色块 ≤4 且不重色，第一个落位的块恒 yellow
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`
- 落印 / 落款 / 序号块恒 ink 底（`#0F0F0F`）+ 白字 + 强调色小字，是本族的收口件

## Typography

- 中文标题 / 正文：`Noto Sans SC`，字重 900 / 700，40–48 px，letter-spacing **0**（中文不收紧）
- 数字 / 编号 / 英文缩写 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .10–.14em（中文数字说明仍用 sans）
- 微标签 / 眉标：24 px，`letter-spacing:.14em`；≤26px 的次级信息才可用 `#6B6B6B`
- 页面实测字号跨度：24–48px（最大 48px 是主数字或主价格）

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：桌沿铭牌 56px（ink 底，贴桌面之外）→ 主区 → 斜纹带 20px（bottom 64）→ 页脚 64px
- `.rail`：left 240px，top 400px，width 1440px，height 240px
- `.cap`：left 600px，top 204px，width 720px，height 120px
- `.base`：left 600px，top 700px，width 720px，height 120px
- `.head`：left 480px，top 96px，width 960px
- 块宽只用 120/240/480/720（**960 / 1008 / 1080 这类中间的数一律违规**，只有 ≥1440 的 240 整数倍通栏带才放行）；块高只用 120/240/360/480
- 相邻块以 -3px 负边距合成单线缝
- **顶出块（式 4）的落定 bottom 要再留 120px 余量**：起跳帧比落定位置低 120px，`落定 bottom + 120 ≤ 1080` 才不越框

## 动画

- 时长 5.5s；落定红线 0.76 × 5.5 = **4.18**（当前实现远早于此，末段只留定格）
- 式 1 砸落：720×120 ink 底说明条自画布上沿直落压顶
- 式 5 轨道推入：三块 480×240 步骤块自右沿沿同一条水平轨道依次推入终点格位，单轴、零 overshoot
- **三块的位移量分别由各自离右沿的距离现算**（`rightOf(sel)`），不许写死同一个数 —— 写死会让最左边那块起跳点跑到画布外，只有出框探针抓得到
- 式 8 凸点：凸点在块内一行文字之下竖排，随该块落位硬切
- 末尾 720×120 承重块自下顶出收口
- 落位时刻：0 / 0.3 / 1.6（`slam()` 的第二个参数，逐块错峰 0.12–0.42s）
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
- **ent 族的语域是企业宣传**：主数字（团队规模、档位价、客户数）要压得住，收尾要有落印。**不要把 kb 的「三步讲道理」或 dq 的「同比口径」那套搬进来** —— 本族讲的是「我们是谁 / 做过什么 / 怎么合作 / 怎么联系」。
- **落印块恒 ink 底白字**（`.seal` / `.ord` / `.stamp` 三处），且恒用承重件 10px 影；它是本族的收口件，不要为了省一档阴影把它降成 8px。
- **「顶部一条说明条 + 下面主体块 + 末尾 720×120 承重块」是本族的标准三段骨架**，主体块可以换手法，骨架不换。
- **contact 类文案不许用 `number` 变量**：电话 / 邮箱 / 地址一律 `string`，避免用户把连字符和 @ 填丢。
- 客户名 / 产品档位名这类短标签的变量 label 要写清字数上限（2–6 字），超限换文案，不靠缩字号救。
- **`overflow:hidden` + 紧凑 `line-height` 会被出框探针误报成「文字裁切」**。判据是 `scrollHeight - clientHeight > 2`：给 nowrap 文字 span 加 `overflow:hidden` 又把 `line-height` 压到 1.1，行盒比盒子高 4px 就被判 clip。**家族既有写法是不加 `overflow:hidden`** —— 照 `brik-ec-09` 的 `.x`：`flex:0 1 auto; min-width:0; line-height:1.2; white-space:nowrap`。
- **`display:none` 会被 motion-qc 判成「宽高为 0，等于没画出来」**。抽换类的旧段必须留在文档流里，照 `brik-kb-08` 的写法：全部叠放 + `gsap.set(sel,{y:IN,opacity:0})`，出场用 `tl.set(sel,{opacity:0})` 硬切，不用淡入、也不切 display。
- **块宽只有四档 {120,240,480,720}，或 ≥1440 的 240 整数倍**。本批 ent-01 首版用 1008、ent-05 首版用 1080，style_check 直接打 ✗；压到 720 之后 ent-05 的 56px 主张字装不下，得连字号一起降到 40px。**排版先定块宽再定字号。**
- **`selfcheck` 的「string 变量必须有同名 id 或 `v.xxx` 引用」这条容易踩**：给 8 条都加了 `foot` 页脚变量，但只有放了 `id="foot"` 的那几条算数。要么在 body 里真的放元素，要么把变量从 VARS 和 TEXTVARS 里一起删掉 —— 漏删任一边都会被抓。
- **`style_check.py` 读 `describe.json`，而 `describe.py` 读预览副本**。改了模板没先 `sync_brik.py` 就 describe，style_check 会拿旧几何出报告，看起来像改动没生效。**顺序必须是 generate → sync → describe → style_check。**

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（栏目标签） | `怎么合作` |
| `title` | string | 主标题（8–16 字） | `三步走完，中间不用你操心` |
| `note` | string | 说明条（10–20 字） | `从第一次通话到上线验收` |
| `s1` | string | 步骤 1 标题（3–6 字） | `诊断` |
| `d1` | string | 步骤 1 说明（10–18 字） | `先弄清楚问题长什么样` |
| `s2` | string | 步骤 2 标题（3–6 字） | `共创` |
| `d2` | string | 步骤 2 说明（10–18 字） | `两周一个可点的原型` |
| `s3` | string | 步骤 3 标题（3–6 字） | `交付` |
| `d3` | string | 步骤 3 说明（10–18 字） | `上线后仍有人接电话` |
| `accent` | color | 强调色（凸点亮起色 / 斜纹带 / 页脚计数） | `#FFD429` |
| `brickColor` | enum | 配色包（块面轮转顺序） → yellow=暖黄主调 / pink=桃粉主调 / green=薄荷主调 / blue=靛蓝主调 / mixed=四色轮转 | `mixed` |
| `studMode` | enum | 凸点（不显示 / 整排同时亮 / 逐枚硬切） → none=不显示 / top=整排同时亮 / scan=逐枚硬切 | `scan` |
| `duration` | number | 总时长（秒，5–6） | `5.5` |
| `exportMode` | enum | Format → mp4=MP4 / webm=WebM / transparent=透明底 | `mp4` |

## 配套

- 本地预览：`http://127.0.0.1:4313/brik-demo.html?tpl=brik-ent-03`（打开即自动播放、控制条可暂停拖进度）
- 真源：`<id>/index.html` 的 `data-composition-variables`；catalog 的 `schema` 由它逐项生成，不手抄
- 同族样板：`brik-ent-02`（八格名单）/ `brik-ent-03`（三步横推）/ `brik-ent-05`（三句主张抽换）/ `brik-ent-08`（联系落印收尾）
- 跨族样板：`brik-kb-07`（四步塔）/ `brik-dq-02`（里程碑柱阵）/ `brik-ec-09`（六格凸点清单）
