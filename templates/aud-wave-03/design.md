# 分句波形封面 视觉规范

## 方向

画面把一条口播切成四格，每格一句话：格子里是这一句真实的振幅包络，格子之间的空隙就是换气的位置。时间推进时，当前格里的柱从一条平线逐根长出来；说过的格子留满，还没说的保持平。静音看能读出「说到第几句、这一句有多重」，声音只是让它更准。

## Palette

- Background: `#FFF6E5`（纸底）
- Foreground: `#0F0F0F`（描边 / 文字 / 柱体）
- Accent: `#3D7BFF`（强调色变量；当前格描边 / 当前标签 / 播放头 / 进度条）
- Chip: `#3D7BFF` 底 + `#FFFFFF` 字（标题词块）
- Muted: `#6B6B6B`（未激活的句子标签 / 刻度）
- Yellow: `#FFD429`（右上角句序药丸 / 通告条标签）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #3D7BFF 10px 20px)`

## Typography

- 主标题：`Noto Sans SC`，字重 900，84px，line-height 1.05
- 副标题：`Noto Sans SC`，字重 700，30px
- 句子标签：`Sarasa Gothic SC`，字重 700，22px，letter-spacing .06em，居中
- 句序药丸 / 时间码 / 刻度：`Sarasa Gothic SC`，字重 900，24–28px，letter-spacing .08–.1em，时间码 `tabular-nums`
- 页脚：mono 标签 22px + sans 正文 25px

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应 938px，内边距 40 / 72 / 34）→ 斜纹带 20px → 页脚 66px
- 主区自上：眉标行 32px → 标题栈（上边距 28，两行 84px）→ 副标题 30px → 分句区（上边距 34）→ 标签行（上边距 12）→ 进度区（`margin-top:auto` 贴底）
- 分句区是 4 个 `flex:1` 格子 + 14px 间隙；每格 316px 高、3px 黑边、白底、左右内边距 10px，内含 12 根 15px 宽的 pill 柱
- 标签行与格子用同一套 `flex:1 + gap:14px`，所以标签和格子天然对齐——对齐是靠共享布局算出来的，不靠手调
- 播放头是 `#stage` 的直接子元素：5px 竖线 + 顶部 21px 方帽，`left/top/height` 由 JS 按分句区实测盒子写死
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 静止，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 眉标 / 句序 / 两行标题 / 副标题 / 分句区依次硬着陆（0.22–0.28s，power4.out）
- **分句波形（音频驱动）**：柱 i 的高度 = `MINH + (full − MINH) · p`，`p = clamp((k − c·12 + 1)/12, 0, 1)`，`c = floor(i/12)`——只依赖柱序号 i 与时间桶 k
- 每桶一个定长补间（`WIN/N`，`ease:'none'`）；当前格切换用 `tl.call` 在同一时刻打一次标记，避免再开一条时间轴
- **播放头 / 进度条**匀速推进到分句区实际宽度与 100%；时间码整秒硬切 00:00 → 00:05
- 降级分支：定格在 62% 处的句子，当前格填色、播放头停 62%、时间码停 00:03，只保留 ≤8px 微位移淡入

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-03.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**（基频 + 共振峰 + 确定性伪噪声摩擦音 + 手工音节计划），无第三方素材、无版权问题
- 这条轨是「慢而顿」的语气：长音节 + 长句读，所以包络的谷很深、句子边界清楚——分句件选它不是为了复用，是因为它的换气位置真的能看成分句
- 页面挂 `<audio src="音轨 voice-03.wav" data-start="0" data-duration="5.6">`，渲染时由 hyperframes 在 Node 侧离线裁剪混流封装
- `peaks` = 该 wav 的离线 RMS 包络（48 桶，整数 0–1000），`aud_batch2_synth.py` 算出，`音轨 voice-03.peaks.json` 留溯源
- 一根柱 = 一个包络桶（BARS == N == 48），所以 `marks` 换四段名字时不用重算 peaks；换音轨才要

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
- `marks` 用**全角竖线｜**分隔，不要用半角 `|`（JSON 里转义麻烦）也不要换行
- 格子的揭示进度不要写成「按格计时」——必须挂在包络桶 k 上，否则画面就和这段声音的实际语速脱钩了
- 标签行与格子必须共用同一套 flex 比例；用 `justify-content:space-between` 各排一套，句子一多就错位

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距，≤12 字） | `AUDIO / 分句` |
| `titleA` | string | 主标题第一行（普通字，≤6 字） | `四句话，` |
| `titleB` | string | 主标题第二行（强调色块里的词，≤4 字） | `四种声口` |
| `sub` | string | 副标题（一行短句，≤22 字） | `一句一格，格与格之间是你换气的位置` |
| `marks` | string | 四句的短名，用全角竖线｜分隔（每段≤4 字，如 开场｜反问｜例子｜收尾） | `开场｜反问｜例子｜收尾` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `14,1000,397,37,28,274,332,289,14,963,612,77,14,2…`（48 桶） |
| `accent` | color | 强调色（当前句描边 / 播放头 / 进度条填充） | `#3D7BFF` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-wave-03 templates/aud-wave-03/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
