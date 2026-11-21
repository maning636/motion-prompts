# 底部章节条（透明叠加） 视觉规范

## 方向

一条可以直接压在实拍口播画面底部的轨道：深色半透底板上，64 根柱按这条声音真实的振幅包络起伏，下面一条细进度线匀速推进，三个章节名跟着播放位置换高亮，右边 mono 时间码整秒硬切。底板之外什么都不画——叠上去时那 800px 还是原画面。

## Palette

- Background: `transparent`（这是叠加原子，画布底色必须透明）
- Plate: `rgba(15,15,15,.90)` + 3px `#FFFFFF` 边（唯一的不透明块）
- Foreground: `#FFFFFF`（描边 / 播放头方帽 / 章节名 / 总时长）
- Accent: `#FF5FA2`（强调色变量；播放头 / 进度填充 / 当前章节名）
- Ghost bar: `rgba(255,255,255,.30)`（未播柱）
- Muted: `#9A9A9A`（刻度数字）

## Typography

- 眉标 / 标题 / 章节名 / 时间码 / 刻度：`Sarasa Gothic SC`，字重 700–900，20–28px，letter-spacing .06–.14em
- 时间码 `font-variant-numeric: tabular-nums`（秒数跳动时位宽必须稳）
- 章节名 22px 居中，字号固定不随长度缩——章节名超 6 字必须换文案

## 布局

- 画布 1920×1080，`#stage` **背景透明**并 `overflow:hidden`；`html,body` 同样透明
- 底板 `.plate`：`position:absolute; left/right 56px; bottom:56px`，内边距 24px × 40px，纵向 flex gap 10px
- 底板内五段：眉标行 32px → 微型波形 56px → 进度条 10px → 章节名行 40px → 时间码行 30px
- 底板高度由内容撑开（`height:auto`），不写死——章节名换长一点也不会溢出
- 微型波形 64 根 20px 宽的 pill 柱，`justify-content:space-between` 均分，柱高区间 6–48px
- 播放头是 `#stage` 的直接子元素（不在底板里，否则会被底板的 overflow 与底色吃掉）：5px 强调色竖线 + 顶部 21px 白色方帽，`left/top/height` 由 JS 按波形实测盒子写死
- 音频窗口 `[0, 5.0s]`：底板在 0–0.6s 内落定，音频驱动件从 0s 就开始走（入场只改位姿，不推迟声音）；尾部 0.6s 定格，时间轴总长 **5.6s = 音轨长度**

## 动画

- 底板从下方 36px 硬着陆（0.30s），随后眉标 / 波形 / 进度条 / 章节 / 时间码依次 −12px 落位（0.22–0.24s）
- **柱高（音频驱动）**：`max(6, round(PEAKS[floor(k + i·N/64) % N]/1000 · 48))`，每桶一个定长补间（`ease:'none'`）
- **章节高亮**：切换点由 `chapterIdx` 起算、三等分铺满音频窗口（`floor((k+0.5)/N · 3)`），每桶 `tl.call` 一次——**推导**而不是让用户再手填一组时间点，两个时间源迟早对不上
- **播放头 / 进度条**从 0s 匀速到 100%，全程不出底板
- 降级分支：柱高定格在 62% 处那一帧，当前章节保持高亮，播放头停 62%，时间码停 00:03，时间轴 2.05s

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-03.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**，无第三方素材、无版权问题
- 页面挂 `<audio src="音轨 voice-03.wav" data-start="0" data-duration="5.6">`，放在 `#stage` 之外；渲染时由 hyperframes 在 Node 侧离线裁剪混流封装
- `peaks` = 该 wav 的离线 RMS 包络（48 桶，整数 0–1000），`aud_batch2_synth.py` 算出，`音轨 voice-03.peaks.json` 留溯源
- 叠加件带音轨不是必须的，但带着它交付，用户替换成自己的口播时**只要换 wav + 重算 peaks**，轨道上的形状就自动跟着变

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
- **画布底色必须 `transparent`**，且 `exportMode` 默认值与 options 顺序都要把 transparent 放第一位——这是它能被当叠加件用的前提
- 底板之外不要画任何东西：加了标题条、logo、装饰，观众看到的就不是「压在口播上的轨道」而是一张新卡片
- 播放头必须挂在 `#stage` 上而不是底板里：底板是 `position:absolute`，子元素会跟着底板的内边距与 overflow 走
- `chapters` 用全角竖线｜分隔，固定三段（多退少补），不要做成可变长数组

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 叠加条左上角 mono 眉标（≤14 字） | `CH · 章节` |
| `titleA` | string | 轨道右上角 mono 标题（≤16 字） | `第 03 期 · 三段论` |
| `chapters` | string | 三个章节名，用全角竖线｜分隔（每段≤6 字，如 起手｜拆解｜收尾） | `起手｜拆解｜收尾` |
| `chapterIdx` | number | 当前正在讲的章节序号（0/1/2），会高亮对应章节名 | `0` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `14,1000,397,37,28,274,332,289,14,963,612,77,14,2…`（48 桶） |
| `accent` | color | 强调色（播放头 / 进度填充 / 当前章节名） | `#FF5FA2` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `transparent` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-progress-01 templates/aud-progress-01/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
