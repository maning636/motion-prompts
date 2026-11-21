# 瀑布频谱 视觉规范

## 方向

画面是一张会往下长的频谱瀑布：每隔一段时间从底部落一行新的，每行 48 根柱，行内容就是那一刻这条声音的包络形状，落定之后这一行永远不变。最新一行填成强调色，扫描线随时间推进。静止的一帧里就能读完整条声音。

## Palette

- Background: `#0F0F0F`（墨底）
- Foreground: `#FFFFFF`（描边 / 扫描线 / 边框）
- Accent: `#FF5FA2`（强调色变量；最新一行 / 通告条 / 斜纹带 / 词块）
- Row base: `rgba(255,255,255,.42)`（已落定的常规行）
- Fall bg: `rgba(255,255,255,.04)`（瀑布容器底）
- Yellow: `#FFD429`（落行间隔药丸 / 扫描线）
- Stripe: `repeating-linear-gradient(45deg, #FF5FA2 0 10px, #0F0F0F 10px 20px)`

## Typography

- 主标题：`Noto Sans SC`，字重 900，76px，line-height 1.05
- 副标题：`Noto Sans SC`，字重 700，27px
- 眉标 / 落行间隔 / 时间码 / 刻度 / 页脚标签：`Sarasa Gothic SC`，字重 700–900，20–28px，letter-spacing .06–.14em
- 时间码 `font-variant-numeric: tabular-nums`
- 页脚：sans 正文 25px + mono 标签 22px

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应 938px，内边距 40 / 72 / 34）→ 斜纹带 20px → 页脚 66px
- 主区自上：眉标行 32px → 标题栈（上边距 22，两行 76px）→ 副标题 27px → 瀑布区（上边距 26）→ 页脚行（`margin-top:auto` 贴底）
- 瀑布区用 `flex-direction:column-reverse` + `gap:4px`：**最新的行排在最下面**，12 行 × 34px + 11 × 4px + 内边距 20 + 上下 3px 边 ≈ 486px
- 每行 48 根 18px 宽的 pill 柱，`justify-content:space-between` 均分，柱高区间 4–30px（偶数柱 ×1、奇数柱 ×0.74，错落一点更像频谱而不是条形码）
- 扫描线是 `#stage` 的直接子元素：4px 黄色竖线贯穿瀑布区全高，`left/top/height` 由 JS 按瀑布区实测盒子写死
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 定格，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 眉标 / 间隔药丸 / 两行标题 / 副标题 / 瀑布区 / 页脚行依次硬着陆（0.22–0.28s）
- **落行（音频驱动 · 冻结行机制）**：第 r 行在 `t = r·ROW` 用 `tl.set` 一次性写入 `rowHeights(r)`，之后永不改变
- **行高公式**：`max(4, round(PEAKS[r % N]/1000 · 30) · (i 偶 ? 1 : 0.74))`——只依赖行号 r、柱号 i 与 peaks，没有插值、没有累加
- 这是全族最容易验证的一种音画同步：任意时刻回看第 r 行，它永远等于 `h(i, r)`（离散、无插值）
- **最新行**在同一时刻 `tl.set` 成 `fresh` 类（强调色）；扫描线匀速推进到瀑布区实际宽度；时间码整秒硬切
- 降级分支：只落 62% 处那一行、其余行保持 CSS 默认高度，整屏定格成一张静态剪影，扫描线停 62%

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-07.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**，无第三方素材、无版权问题
- 这条轨是「两段爆点 + 中间真静音」：两次整体抬升之间有一段近乎平的区——瀑布图上那一段会落下一片短平的行，两次抬升就是两道明显的「山脊」，这张图才立得住
- 页面挂 `<audio src="音轨 voice-07.wav" data-start="0" data-duration="5.6">`，放在 `#stage` 之外；渲染时由 hyperframes 在 Node 侧离线裁剪混流封装
- `peaks` = 该 wav 的离线 RMS 包络（48 桶，整数 0–1000），`aud_batch2_synth.py` 算出，`音轨 voice-07.peaks.json` 留溯源
- `rowSec` 只改落行间隔（钳制 0.3–0.6s），**不改行的内容公式**；行数由 `floor(WIN / ROW)` 推导，不让用户填

## Avoid

- **不用实时 `AnalyserNode` / rAF 驱动任何可见值**——所有音频件的高度必须是 `f(时间轴秒数)` 的纯函数，否则逐帧 seek 会失步或冻住
- 不用 `Date.now()` / `Math.random()` / `setInterval`；一切可见值只由时间轴位置决定
- 描边恒 3px、阴影恒 `Npx Npx 0` 且 X=Y；圆角只用 `4px` 与 `9999px` 两档
- 零 overshoot：不出现 `back.*` / `elastic.*` / `bounce.*`，入场一律 `power4.out`
- 不用 opacity 淡入当主入场手段
- 变量类型只用 `string` / `color` / `number` / `enum`，**禁用 `select`**（hyperframes 0.8.55 的变量解析器不认）
- **降级媒体查询必须同时写 `transition-property:none`**：`transition-property` 的初始值是 `all`，只压 `transition-duration` 会让所有内联样式改动变成 0.01ms 的过渡——JS 写死的内联几何会在降级分支里卡在 CSS 旧值上，motion-qc 全绿也照样渲染错位置
- **flex 行里的每一个文字都要显式 `min-width:0`**（flex item 的 `min-width` 初值是 `auto`，不写就永不收缩，`text-overflow:ellipsis` 形同虚设）；`B.fit()` 对 flex 被压缩项无效（它拿元素 scrollWidth 跟**父元素** clientWidth 比，抓不到元素自己被 flex 压缩后的盒）：凡在 flex 行里的文字一律 `min-width:0` + `overflow:hidden;text-overflow:ellipsis` 兜底，不靠缩字号自适应
- 音频窗口固定 `[0, WIN]`，`WIN = min(duration − 0.6, 音轨长度)`；禁止用变量值推算时间轴总长（数值填大就把时轴撑爆撞 `SMOKE_TOO_LONG`）
- 样片用 `--format mp4` 渲，不要用 `--format webm`：webm 走 alpha 捕获会注入 `background:transparent !important` 剥掉 stage 底色（见 RENDER-PIPELINE.md §5）
- 文字类变量的 label 必须写清字数上限；超限必须换文案，不许靠缩字号救
- 瀑布必须用 `flex-direction:column-reverse` 才能让「最新的行在最下面」；用 `column` 会变成最新的在顶上，观众读成倒放
- 行内容要用 `tl.set` **一次性**写入，不要 tween——一 tween 就有插值，冻结行机制与「落定不变」的视觉承诺就破了
- 行数是**推导量**（`floor(WIN / ROW)`），不许暴露成变量让用户填：填大了瀑布区撑破主区，填小了画面上半截是空的
- 整屏 12 × 48 = 576 根柱，全部在 motion-qc 的出框检查范围内；柱宽别小于 14px
- `#head` 的 `className` 不要在补间里反复 `set` 成空串——它没有 class，写一次就够

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距，≤12 字） | `SPECTRUM / 瀑布` |
| `titleA` | string | 主标题第一行（普通字，≤6 字） | `每一拍，` |
| `titleB` | string | 主标题第二行（强调色块里的词，≤4 字） | `往下落一行` |
| `rowSec` | number | 每行间隔秒数（0.3–0.6，决定瀑布的流速） | `0.42` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `14,117,117,14,212,76,14,237,139,1000,190,294,158…`（48 桶） |
| `accent` | color | 强调色（最新一行 / 播放头 / 斜纹带） | `#FF5FA2` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-spectrum-03 templates/aud-spectrum-03/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
