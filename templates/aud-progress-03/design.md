# 双轨进度带（透明叠加） 视觉规范

## 方向

把「时间」和「段落」拆成上下两条轨：上面一条上下镜像的波形带占满高度，40 根柱上下成对、中间一条 3px 半透白轴；下面一条细进度线配三个章节标记。播放头是一根贯穿整条波形带的白色竖线——观众一眼同时看到「听到哪」和「说到第几段」。

## Palette

- Background: `transparent`（叠加原子）
- Plate: `rgba(15,15,15,.90)` + 3px `#FFFFFF` 边
- Foreground: `#FFFFFF`（描边 / 中轴 / 播放头）
- Accent: `#3D7BFF`（强调色变量；上排柱 / 播放头方帽 / 章节标记 / 进度填充）
- Ghost bar: `rgba(255,255,255,.26)`（下排柱）
- Axis: `rgba(255,255,255,.55)`（3px 中轴）

## Typography

- 章节标记 / 眉标 / 标题 / 时间码 / 刻度：`Sarasa Gothic SC`，字重 700–900，20–28px，letter-spacing .04–.14em
- 时间码 `font-variant-numeric: tabular-nums`
- 章节名超 6 字必须换文案：标记是固定宽的 flex 项，缩字号会让三块大小不一

## 布局

- 画布 1920×1080，`#stage` **背景透明**并 `overflow:hidden`
- 底板 `.plate`：`position:absolute; left/right 56px; bottom:56px`，内边距 24px × 40px，纵向 flex gap 10px
- 底板内四段：眉标行 32px → 波形带 104px → 下轨行（进度条 `flex:1` + 章节标记）→ 时间码行 30px
- 波形带 40 组柱，每组 20px 宽、上下各一根（`flex-direction:column` + gap 4px）；上排 44px 上限，下排 = 上排 × 0.52
- 播放头是 `#stage` 的直接子元素：5px 白色竖线贯穿波形带全高 104px + 顶部 21px 强调色方帽，`left/top/height` 由 JS 按波形带实测盒子写死
- 音频窗口 `[0, 5.0s]`：底板在 0–0.7s 内落定，音频驱动件从 0s 就开始走；尾部 0.6s 定格，时间轴总长 **5.6s = 音轨长度**

## 动画

- 底板从下方 36px 硬着陆（0.30s），随后各段 −12/−18px 依次落位（0.22–0.24s）
- **上排（音频驱动）**：`max(6, round(PEAKS[floor(k + i·N/40) % N]/1000 · 44))`；**下排** = 上排 × 0.52，同一时刻各自 tween
- **播放头**：贯穿波形带全高匀速推进到实际宽度（不是底部小方块）
- **章节标记**：`clamp(CH0 + floor((k+0.5)/N·3), 0, 2)`，每桶 `tl.call` 一次换色
- 降级分支：两排定格在 62% 处那一帧、当前章节标记保持填色、播放头停 62%、时间码停 00:03

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-06.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**，无第三方素材、无版权问题
- 这条轨是「稳定节拍型」：强弱规律、几乎没有长音——上下镜像的带子在这种包络下才看得出上下两排的呼吸是同步的，而不是两个各说各话的图形
- 页面挂 `<audio src="音轨 voice-06.wav" data-start="0" data-duration="5.6">`，放在 `#stage` 之外；渲染时由 hyperframes 在 Node 侧离线裁剪混流封装
- `peaks` = 该 wav 的离线 RMS 包络（48 桶，整数 0–1000），`aud_batch2_synth.py` 算出，`音轨 voice-06.peaks.json` 留溯源

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
- 播放头贯穿波形带全高，不要退回底部小方块——这一版的两轨信息靠「同一根指针同时指两条轨」建立
- `.ribbon .axis` 是绝对定位的中轴，必须放在 `z-index:4` 且给 `.ribbon` 留出 `position:relative`，否则会被柱盖住
- 下轨里进度条是 `flex:1`、章节标记是 `flex:0 0 auto`——顺序反了进度条会被章节名挤扁

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 叠加条左上角 mono 眉标（≤14 字） | `TRACK · 双轨` |
| `titleA` | string | 轨道右上角 mono 标题（≤16 字） | `人声轨 + 章节` |
| `chapters` | string | 三个章节名，用全角竖线｜分隔（每段≤6 字） | `第一段｜第二段｜第三段` |
| `chapterIdx` | number | 当前正在讲的章节序号（0/1/2），决定第一个章节标记的位置 | `0` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `825,570,345,300,892,135,327,296,973,314,309,184,…`（48 桶） |
| `accent` | color | 强调色（上排柱 / 播放头 / 章节标记 / 进度填充） | `#3D7BFF` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `transparent` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-progress-03 templates/aud-progress-03/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
