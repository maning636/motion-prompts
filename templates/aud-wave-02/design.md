# 双色扫过切片封面 视觉规范

## 方向

画面是知识口播切片的转发封面：墨底，88px 900 字重标题两行（第二行压在强调色词块上），中间一条 40 根柱子的波形条从左向右推过去，一枚 5px 白色竖线播放头卡在波形上匀速推进。这版与 aud-wave-01 的差别是一件事：柱色跟着播放头翻——已经响过的柱是强调色，还没响的是灰白。静音看也能读出「听到哪了」，颜色本身就是进度条。

## Palette

- Background: `#0F0F0F`（墨底）
- Foreground: `#FFFFFF`（描边 / 文字 / 播放头 / 未播柱）
- Accent: `#FF5FA2`（强调色变量；已播柱 / 播放头方帽 / 进度条填充 / 通告条）
- Chip shadow: `#FFFFFF`（8px 8px 硬阴影）
- Ghost bar: `rgba(255,255,255,.22)`（未播柱）
- Yellow: `#FFD429`（期数标签 / 峰值读数）
- Muted: `#8E8E8E`（刻度数字）
- Border: `#FFFFFF`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #FF5FA2 0 10px, #0F0F0F 10px 20px)`

## Typography

- 主标题：`Noto Sans SC`，字重 900，88px，line-height 1.05，letter-spacing 0
- 副标题：`Noto Sans SC`，字重 700，30px
- 眉标 / 期数 / 刻度 / 峰值读数：`Sarasa Gothic SC`，字重 700，21–26px，letter-spacing .06–.14em
- 时间码：`Sarasa Gothic SC`，字重 900，28px，letter-spacing .08em，`font-variant-numeric: tabular-nums`
- 页脚：mono 标签 22px + sans 正文 25px 成对出现

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应 938px，内边距 40 / 72 / 34）→ 斜纹带 20px → 页脚 66px
- 主区自上：眉标行 32px → 标题栈（上边距 30，两行 88px）→ 副标题 30px → 波形区 300px（上边距 40）→ 图例行（上边距 16）→ 进度区（`margin-top:auto` 贴底）
- 波形区 3px 白边、左右内边距 18px；40 根 26px 宽的 pill 柱，`justify-content:space-between` 均分；柱高区间 10–236px
- 播放头是 `#stage` 的**直接子元素**：5px 白色竖线 + 顶部 21px 方帽，`left/top/height` 由 JS 按波形区实测盒子写死
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 静止 hold，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 眉标 / 期数 / 两行标题 / 副标题 / 波形区依次硬着陆（0.22–0.28s，power4.out），词块落定后阴影压 2 帧再弹回
- **波形（音频驱动）**：`peaks` 48 个桶，每个桶一个定长补间（`WIN/N`，`ease:'none'`），逐段把 40 根柱的 `height` 与 `backgroundColor` 一起 tween 到目标值
- 柱色阈值 `hi = floor(k·BARS/N − 0.5)`——播放头扫过的柱翻成强调色，同一个补间里完成，不需要第二条时间轴
- 峰值读数 `PEAK nnn` 每个桶 `set()` 一次（读数不需要逐帧插值）
- **播放头 / 进度条**：匀速推进到波形实际宽度与 100%，全程不出画布；时间码整秒硬切 00:00 → 00:05
- 斜纹带匀速滚动 40px（0.8s，ease:none）；尾部 0.6s 定格在「已播完」
- 降级分支：柱高与柱色都定格在 62% 处那一帧，播放头停 62%，峰值读数停 PEAK，00:03，只保留 ≤8px 微位移淡入，时间轴 2.3s

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-03.wav`（22050Hz 单声道，`pcm_s16le`，5.6s / 241KB）。这是本项目**完全自研合成**的语音包络音轨（基频 + 共振峰 + 确定性伪噪声摩擦音 + 手工音节计划），不是真人录音，无第三方素材、无版权问题
- 页面挂载 `<audio id="voice" src="音轨 voice-03.wav" data-start="0" data-duration="5.6">`，放在 `#stage` 之外。hyperframes 渲染时在 Node 侧按 `src` 离线取文件 → 裁剪 → 混流 → 封装，**不依赖采样时浏览器真的出声**
- `peaks` 变量 = 该 wav 的**离线 RMS 包络**（48 桶，整数 0–1000），由 `aud_batch2_synth.py` 算出，同时落一份 `音轨 voice-03.peaks.json` 作溯源
- 换音轨：换 wav → 重跑离线脚本 → 填新 peaks → 同步 `duration` 与 `<audio data-duration>`

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
- 柱色阈值与柱高必须写在**同一个**补间里——拆成两条时间轴会出现颜色追不上播放头的半拍错位
- `--ghost` 用 rgba 而非纯色：纯灰白柱在墨底上会和描边同亮度，整条波形糊成一片

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距，≤12 字） | `AUDIO / 切片` |
| `titleA` | string | 主标题第一行（普通字，≤6 字） | `这条声音` |
| `titleB` | string | 主标题第二行（强调色块里的词，≤4 字） | `值得听完` |
| `sub` | string | 副标题（一行短句，≤22 字） | `左边是已经响过的，右边是你还没听到的` |
| `episode` | string | 右上角 mono 期数标签（≤8 字） | `EP.118` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `14,1000,397,37,28,274,332,289,14,963,612,77,14,2…`（48 桶） |
| `accent` | color | 强调色（已播柱 / 播放头 / 进度条填充） | `#FF5FA2` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-wave-02 templates/aud-wave-02/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
