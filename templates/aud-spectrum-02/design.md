# 八段频谱 视觉规范

## 方向

画面把整条声音拆成八个频段，从超低到空气每段一格。每格里面六根柱，是这条声音在那一段的真实形状；格下面一排八条电平条，是「此刻这一段有多响」——用高斯窗做，所以同时有三到五段亮着，而不是一根指针只指一段。扫描线走到哪一格，那一格的描边与名字就换色。

## Palette

- Background: `#FFF6E5`（纸底）
- Foreground: `#0F0F0F`（描边 / 文字 / 段内柱）
- Accent: `#FFD429`（强调色变量；段级电平 / 当前段描边与名 / 通告条 / 斜纹带）
- Chip: `#3D7BFF` 底 + `#FFFFFF` 字（标题词块）
- Muted: `#6B6B6B`（未激活的段名）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

## Typography

- 主标题：`Noto Sans SC`，字重 900，84px，line-height 1.05
- 副标题：`Noto Sans SC`，字重 700，29px
- 段名：`Sarasa Gothic SC`，字重 700，19px，居中 nowrap + ellipsis
- 眉标 / 段数药丸 / 页脚标签：`Sarasa Gothic SC`，字重 700–900，22–26px，letter-spacing .1–.14em
- 页脚：mono 标签 22px + sans 正文 25px

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应 938px，内边距 40 / 72 / 34）→ 斜纹带 20px → 页脚 66px
- 主区自上：眉标行 32px → 标题栈（上边距 24，两行 84px）→ 副标题 29px → 八段区 280px（上边距 30）→ 段名行（上边距 12）→ 段级电平行 64px（`margin-top:auto` 贴底）
- 八段区是 8 个 `flex:1` 格子 + 10px 间隙，每格 280px 高、3px 黑边、白底、左右内边距 8px，内含 6 根 14px 宽的 pill 柱
- 段名行与电平行都复用同一套 `flex:1 + gap:10px`，所以三行的段天然对齐
- 扫描线是 `#stage` 的直接子元素：5px 强调色竖线 + 顶部 21px 方帽，`left/top/height` 由 JS 按八段区实测盒子写死
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 定格，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 眉标 / 段数药丸 / 两行标题 / 副标题 / 八段区 / 段名 / 电平行依次硬着陆（0.22–0.28s）
- **段内柱高（静态但忠实）**：第 `b·6+j` 根 = `max(8, round(PEAKS[b·6+j]/1000 · 210))`——一根柱一个包络桶，一一对应
- **段级电平（音频驱动）**：`level(b,k) = max(4, round(bandPeak(b)/1000 · exp(−((k−(b+0.5)·6)/3.2)²/2) · 58))`——量级来自该段真实峰值，动态来自以当前桶为中心、标准差 3.2 桶的高斯窗，**只依赖 k**
- 高斯窗的宽度不能收成一根针：那样同时只有一段亮着，观众看到的是指针不是频谱
- **当前段**：`floor(k/6)`，每桶 `tl.call` 一次换描边与段名
- 降级分支：电平条定格在 62% 处那一帧、当前段保持换色、扫描线停 62%

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-07.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**，无第三方素材、无版权问题
- 这条轨是「两段爆点 + 中间真静音」：1.0s 前近乎平、1.0–3.2s 一声重、3.6s 后又一声重——八段电平扫过去时能看见两次明显的整体抬升，段与段之间差别才拉得开
- 页面挂 `<audio src="音轨 voice-07.wav" data-start="0" data-duration="5.6">`，放在 `#stage` 之外；渲染时由 hyperframes 在 Node 侧离线裁剪混流封装
- `peaks` = 该 wav 的离线 RMS 包络（48 桶，整数 0–1000），`aud_batch2_synth.py` 算出，`音轨 voice-07.peaks.json` 留溯源
- 段名 `bands` 固定八段（多退少补），换名字不换 peaks；只有换音轨才要重算

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
- 段名用**全角竖线｜**分隔，固定八段；半角 `|` 在 JSON 里要转义，换行会破坏变量声明
- 段名超 5 字必须换文案：每格宽度是 `flex:1` 算出来的（1776 − 7×10 = 1706 / 8 ≈ 213px），缩字号会让八格字重不一
- 段内柱是**静态**的，不要为了「让它动」去 tween——它的职责是忠实展示静态形状，动的是下面那排电平
- 高斯窗的 σ 不要小于 2 桶，否则同时只有一段亮着；也不要大于 5 桶，否则八段全亮、等于没分段

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距，≤12 字） | `SPECTRUM / 八段` |
| `titleA` | string | 主标题第一行（普通字，≤6 字） | `八个频段，` |
| `titleB` | string | 主标题第二行（强调色块里的词，≤4 字） | `从低到高` |
| `bands` | string | 八个频段名，用全角竖线｜分隔（每段≤5 字，如 频段A｜频段B｜…） | `超低｜底鼓｜低音｜中低｜中音｜中高｜ Presence｜空气` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `14,117,117,14,212,76,14,237,139,1000,190,294,158…`（48 桶） |
| `accent` | color | 强调色（段内柱 / 段级电平条 / 当前段名） | `#FFD429` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-spectrum-02 templates/aud-spectrum-02/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
