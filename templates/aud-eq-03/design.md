# 贯穿游标频段栅格 视觉规范

## 方向

画面是一条被分成三段的频率轴：LOW / MID / HIGH 三块背景分区，32 组胶囊柱上下镜像夹在一条白色中线两侧。柱高按频段加权——中频满权、低频 0.78、高频 0.86，所以重量自然落在画面正中。一根强调色竖线从栅格顶贯穿到底、匀速推进，游标压到哪一段，那一段的名字就填成强调色。

## Palette

- Background: `#0F0F0F`（墨底）
- Foreground: `#FFFFFF`（描边 / 中线 / 下排柱 / 分区边框 / 频段名）
- Accent: `#FFD429`（强调色变量；中频段上排柱 / 贯穿游标 / 当前频段名 / 眉标 / 斜纹带）
- Zone: `rgba(255,255,255,.05)`（LOW / HIGH 分区底），中频分区 `rgba(255,212,41,.10)`
- Chip: `#FFD429` 底 + `#0F0F0F` 字（标题词块）
- Muted: `#9A9A9A`
- Stripe: `repeating-linear-gradient(45deg, #FFD429 0 10px, #0F0F0F 10px 20px)`

## Typography

- 主标题：`Noto Sans SC`，字重 900，88px，line-height 1.05
- 副标题：`Noto Sans SC`，字重 700，29px
- 频段名：`Sarasa Gothic SC`，字重 900，24px，letter-spacing .16em，居中
- 眉标 / 页脚标签：`Sarasa Gothic SC`，字重 700，22–26px
- 页脚：mono 标签 22px + sans 正文 25px

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应 938px，内边距 40 / 72 / 34）→ 斜纹带 20px → 页脚 66px
- 主区自上：眉标行 32px → 标题栈（上边距 24，两行 88px）→ 副标题 29px → 频段栅格 400px（上边距 32）→ 频段名行（`margin-top:auto` 贴底）
- 栅格内三层绝对定位叠在一起：`.zones` 三块 3px 白边分区（gap 10px，中区用 `.cen`）→ `.cols` 32 组柱（左右内边距 22px）→ 3px 白色中线
- 每组柱上下两根：上排 168px 上限（按频段加权），下排是上排的 0.62 倍
- 游标是 `#stage` 的直接子元素：5px 强调色竖线贯穿栅格全高 400px + 顶部 21px 白色方帽，`left/top/height` 由 JS 按栅格实测盒子写死
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 静止，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 眉标 / 两行标题 / 副标题 / 栅格依次硬着陆（0.22–0.28s，power4.out）
- **柱高（音频驱动）**：`max(10, round(PEAKS[idx]/1000 · 168 · zoneGain(c)))`，`idx = floor(k + c·N/32) % N`；下排 = 上排 × 0.62
- `zoneGain(c)`：c < MIDCOL−5 → 0.78，|c − MIDCOL| ≤ 5 → 1.00，否则 0.86
- **游标**：匀速推进到栅格实际宽度（贯穿全高，不是底部小方块）
- **频段名高亮**：游标位置换算成三段的归一化中心线 `fcol`，每桶 `tl.call` 一次重画——同一时刻算出来的对应关系，不另开一条时间轴
- 降级分支：两排定格在 62% 处那一帧（分区权重关系在静止画面里成立），游标停 62%，MID 频段名保持填色

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-04.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**（基频 + 共振峰 + 确定性伪噪声摩擦音 + 手工音节计划），无第三方素材、无版权问题
- 这条轨是「密排快语」，包络最小值 333/1000——密排的包络才能让「哪个频段更宽」这件事在柱高上看得出来
- 页面挂 `<audio src="音轨 voice-04.wav" data-start="0" data-duration="5.6">`，渲染时由 hyperframes 在 Node 侧离线裁剪混流封装
- `peaks` = 该 wav 的离线 RMS 包络（48 桶，整数 0–1000），`aud_batch2_synth.py` 算出，`音轨 voice-04.peaks.json` 留溯源

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
- 栅格是三层绝对定位叠放，`.zones` / `.cols` / 中线都要写 `position:absolute` 并显式给 inset——靠 flex 叠不齐
- 本模板里**不要用 `.mid` 同时当中线和频段名的类名**——中线是 `position:absolute;left:0;right:0`，一旦串到频段名上，那个标签会变成 1914px 宽的绝对定位条（不是被裁切，是整块脱离布局）
- 游标是**贯穿全高**的竖线，不要退回 aud-eq-01 那种底部小方块：这一版的说服力全在「指针压在哪一段」上
- `fcol` 必须在建补间之前量一次（量完写进闭包），不要放进 `tl.call` 回调里量

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距，≤12 字） | `EQ / 频段` |
| `titleA` | string | 主标题第一行（普通字，≤6 字） | `低频坐中线，` |
| `titleB` | string | 主标题第二行（强调色块里的词，≤4 字） | `两端收着` |
| `sub` | string | 副标题（一行短句，≤24 字） | `中频最宽，两端各压一档，重量自然落在正中` |
| `deck` | string | 底部 mono 说明（≤18 字） | `LOW · MID · HIGH` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `591,447,705,346,907,401,629,857,464,586,646,764,…`（48 桶） |
| `accent` | color | 强调色（中频段柱 / 游标 / 底部频段名） | `#FFD429` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-eq-03 templates/aud-eq-03/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
