# 章节跳转表（透明叠加） 视觉规范

## 方向

把「这期分三段」直接画成三张可以选的块：编号 + 章节名，当前正在讲的那一块整块填色，块底边一条细进度条显示这一章自己走到哪儿了——三等分是从音频窗口推出来的，不用手填时间点。下面是 24 根柱的微型波形和一条总进度线。

## Palette

- Background: `transparent`（叠加原子）
- Plate: `rgba(15,15,15,.90)` + 3px `#FFFFFF` 边
- Foreground: `#FFFFFF`（描边 / 章节名 / 播放头）
- Accent: `#2FD07A`（强调色变量；当前章节块 / 块内进度条 / 播放头 / 总进度填充）
- Chip base: `rgba(255,255,255,.06)`；当前块 `rgba(47,208,122,.16)`
- Muted: `#9A9A9A`（未激活章节编号 / 刻度）

## Typography

- 章节名：`Sarasa Gothic SC`，字重 900，30px，居左 nowrap + ellipsis
- 章节编号 / 眉标 / 标题 / 时间码 / 刻度：`Sarasa Gothic SC`，字重 700–900，20–28px，letter-spacing .04–.14em
- 时间码 `font-variant-numeric: tabular-nums`
- 章节名超 6 字必须换文案：块宽是 `flex:1` 算出来的，缩字号会让三块大小不一

## 布局

- 画布 1920×1080，`#stage` **背景透明**并 `overflow:hidden`
- 底板 `.plate`：`position:absolute; left/right 56px; bottom:56px`，内边距 24px × 40px，纵向 flex gap 10px
- 底板内五段：眉标行 32px → 章节块行（`flex:1` 三块 + gap 12px，内高 ~86px）→ 微型波形 44px → 进度条 10px → 时间码行 30px
- 微型波形 24 根 26px 宽的 pill 柱，`justify-content:space-between` 均分，柱高区间 5–38px
- 播放头是 `#stage` 的直接子元素：5px 强调色竖线 + 顶部 21px 白色方帽，`left/top/height` 由 JS 按波形实测盒子写死
- 音频窗口 `[0, 5.0s]`：底板在 0–0.7s 内落定，音频驱动件从 0s 就开始走；尾部 0.6s 定格，时间轴总长 **5.6s = 音轨长度**

## 动画

- 底板从下方 36px 硬着陆（0.30s），随后各段 −12/−16px 依次落位（0.22–0.24s）
- **柱高（音频驱动）**：`max(5, round(PEAKS[floor(k + i·N/24) % N]/1000 · 38))`，每桶一个定长补间（`ease:'none'`）
- **章节块（音频驱动）**：当前章 = `clamp(CH0 + floor((k+0.5)/N·3), 0, 2)`；块底边填充宽度 = `clamp(k/N·3 − i, 0, 1)·100%`——两者都由音频窗口推导，每桶 `tl.call` 一次重画
- **播放头 / 总进度条**从 0s 匀速到 100%；时间码整秒硬切
- 降级分支：柱高定格在 62% 处那一帧、当前块保持高亮、播放头停 62%、时间码停 00:03

## 音频路线（本族的命门，必读）

- 音轨 `assets/voice-06.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**，无第三方素材、无版权问题
- 这条轨是「稳定节拍型」：强弱规律、几乎没有长音——章节块在三个位置上的明暗差别最大，跳转表才看得出「换章了」
- 页面挂 `<audio src="./assets/voice-06.wav" data-start="0" data-duration="5.6">`，放在 `#stage` 之外；渲染时由 hyperframes 在 Node 侧离线裁剪混流封装
- `peaks` = 该 wav 的离线 RMS 包络（48 桶，整数 0–1000），`aud_batch2_synth.py` 算出，`assets/voice-06.peaks.json` 留溯源

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
- **画布底色必须 `transparent`**，`exportMode` 默认值与 options 顺序都要把 transparent 放第一位
- 章节块宽度是 `flex:1` 算出来的，三块必须等宽——用固定 px 宽会让「当前块填色」看起来像布局坏了
- 块底边填充不要写成「从左到右线性扫三块」，那是总进度不是章节进度；两者混起来观众读不出「这一章走到哪」
- `chipsEls[i].lastChild` 是那条 6px 填充条——往块里插别的元素会把它顶掉，取值改成具名 id 更稳

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 叠加条左上角 mono 眉标（≤14 字） | `JUMP · 章节` |
| `titleA` | string | 轨道右上角 mono 标题（≤16 字） | `哪一段值得回听` |
| `chapters` | string | 三个章节名，用全角竖线｜分隔（每段≤6 字） | `开场｜正文｜收尾` |
| `chapterIdx` | number | 当前正在讲的章节序号（0/1/2），高亮对应章节块 | `0` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `825,570,345,300,892,135,327,296,973,314,309,184,…`（48 桶） |
| `accent` | color | 强调色（当前章节块 / 播放头 / 进度填充） | `#2FD07A` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `transparent` |

## 配套

- 离线包络脚本：`E:/FDE/_build/qcwork/aud_batch2_synth.py`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-progress-02 templates/aud-progress-02/presets/default.json --format mp4`
- 同族样板：`E:/FDE/motion-preview-work/templates/aud-wave-01/`、`aud-eq-01/`
