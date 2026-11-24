# 中线均衡条视觉规范

## 方向

整块画面反白成墨底，中间是一排 24 组上下镜像的胶囊柱，3px 白色中线从左贯到右，字重最重的一根正好压在中线上。上方是 92px 900 字重的标题两行，下方是频段 mono 说明 + 一排刻度 + 时间码，一枚 34px 的方块播放头在刻度上匀速滑动。

做音乐可视化、片头氛围、播客章节标记。上下镜像不是为了对称好看——低频坐在正中间才有胸腔感，柱阵的高度分布本身就是频率分布。

## Palette

- Background: `#0F0F0F`（墨底，整屏反白）
- Foreground: `#FFFFFF`（正文 / 中线 / 播放头描边）
- Accent: `#3D7BFF`（强调色变量，默认值；高频段柱 + 播放头 + 斜纹带）
- Yellow: `#FFD429`（中低频段柱 + 眉标 + 频段说明）
- Muted: `#6B6B6B`（刻度数字）
- Border: `#0F0F0F` / `#FFFFFF`（深底区块用白边，页脚整块反白回白底）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #3D7BFF 10px 20px)`

> 本件是深底件：`#stage` 的 `background` 与 `color` 整体走 ink / white 反白，阴影在白底页脚上自动换成白侧，字色随承载底色走。

## Typography

- 主标题：`Noto Sans SC`，字重 900，92px，color #FFFFFF，letter-spacing 0
- 副标题：`Noto Sans SC`，字重 700，30px，color #FFFFFF，letter-spacing 0
- 眉标 / 频段说明 / 刻度：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em
- 时间码：`Sarasa Gothic SC`，字重 900，26px，letter-spacing .08em，`font-variant-numeric: tabular-nums`
- 页脚：mono 标签 22px（#3D7BFF）+ sans 正文 25px（ink），成对出现

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px（accent 底）→ 主区（自适应，938px，上下内边距 40 / 34）→ 斜纹带 20px → 页脚 66px（白底反白）
- 主区自上：眉标行 → 标题栈（上边距 26，两行 92px/1.06 = 195px）→ 副标题 30px → 均衡区 392px（上边距 38）→ 底部频段条（`margin-top:auto` 贴底，3px 白色上边线分隔）
- 均衡区：24 组 `.col`，每组上下各一根 26px 宽 pill 柱，间距 8px；上柱区间 10–176px，下柱 = 上柱 × 0.62
- 中线：3px 白线，绝对定位在均衡区正中，`z-index` 高于柱阵
- 播放头是 `#stage` 的**直接子元素**：34×34 方块，accent 底 + 3px 白边，`left/top` 由 JS 按底部刻度尺实测盒子写死
- 底部频段条：频段 mono 说明 + `flex:1` 的刻度行（6 个等分刻度，虚线下边线）+ 时间码
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 静止 hold，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 眉标 / 两行标题 / 副标题 / 均衡区依次硬着陆（0.22–0.28s，power4.out），词块落定后阴影压 2 帧再弹回（深底用 `sh-w` 白阴影）
- **均衡柱（音频驱动）**：上排与下排各 48 个定长补间（`WIN/N`，`ease:'none'`），每根柱的高度只依赖「柱序号 c 与时间轴秒数 t」。权重函数 `bandGain(c) = 1 − 0.42·|c−11|/11` 把柱高往中线聚——**「低频坐在正中」是布局算出来的，不是碰巧**
- **播放头（音频驱动）**：`x` 从 0 匀速推到刻度尺实际宽度（实测 1166px）
- **时间码**：整秒 `set()` 硬切 `00:00 / 00:05` → `00:05 / 00:05`
- 斜纹带匀速滚动 40px（0.8s，ease:none）
- 尾部静止 hold 0.6s，画面停在「已播完」的定格状态
- 演完定格最后一帧，无收尾 fade-out
- 降级分支：柱阵停成静态对称剪影（取包络 62% 处的高度向量），播放头停到 62%，时间码停 `00:03 / 00:05`，只保留 ≤8px 微位移淡入，时间轴 2.3s

## 音频路线（本族的命门，必读）

1. **音轨**：`assets/voice-02.wav`（22050Hz 单声道，`pcm_s16le`，实测 5.599955s / 241KB）。本项目**完全自研合成**的语音包络音轨，无第三方素材、无版权问题——不是真人录音。
2. **页面挂载**：`<audio id="voice" src="./assets/voice-02.wav" data-start="0" data-duration="5.6">`，放在 `#stage` 之外。hyperframes 渲染时在 **Node 侧**按 `src` 离线取文件 → 裁剪 → 混流 → 封装，**不依赖采样时浏览器真的出声**。
3. **实测确认**：`hyperframes timeline .` 输出 `timeline 5.6s` + `audio (1) voice 0-5.6s src=./assets/voice-02.wav`；`hyperframes lint` 对这条 `<audio>` **零告警**。
4. **画面数据**：`peaks` 变量 = 该 wav 的离线 RMS 包络（48 桶，整数 0–1000），由 `E:/FDE/_build/qcwork/aud_synth.py` 算出，同时落一份 `assets/voice-02.peaks.json` 作溯源。
5. **为什么不做实时 AnalyserNode**：无头渲染逐帧 seek，hyperframes runtime 在 `__HF_RENDER_CAPTURE_MODE` 下把媒体当 seek 处理（`allowLiveTimelineSeek` 为 false），AnalyserNode 读到的不是「此刻在放什么」；motion-qc 探针同样无序 seek。
6. **换音轨的操作**：换 `assets/` 里的 wav → 跑离线脚本重算 → 填进 `peaks` → 改 `duration`（并同步 `<audio data-duration>`）。

## Avoid

- **不用实时 `AnalyserNode` / rAF 驱动任何可见值**——柱高必须是 `f(时间轴秒数)` 的纯函数
- 不用 `Date.now()` / `Math.random()` / `setInterval`
- 柱阵圆角只用 `9999px`，不引第三种
- 深底件的阴影判定看**承载阴影的色块自身底色**：墨底上的彩色件用白阴影（`sh-w`），页脚整块换回白底后阴影随之换回 ink 侧
- 描边恒 3px、阴影恒 `Npx Npx 0` 且 X=Y
- 零 overshoot：不出现 `back.*` / `elastic.*` / `bounce.*`
- 不用 opacity 淡入当主入场手段
- 播放头位移必须落在刻度尺实际宽度内，任何时刻都不许出画布
- **降级媒体查询必须同时写 `transition-property:none`**：`transition-property` 初始值是 `all`，只压 duration 会让所有内联样式改动变成 0.01ms 过渡——播放头的 inline `top` 就是在降级分支里卡在旧值、被抽帧审计逮到的
- 音频窗口固定 `[0, WIN]`，`WIN = min(duration − 0.6, 音轨长度)`；禁止用变量值推算时间轴总长
- 样片用 `--format mp4` 渲，不要用 `--format webm`（webm 走 alpha 捕获会注入 `background:transparent !important`，见 RENDER-PIPELINE.md §5）

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `EQ / 中线均衡` |
| `titleA` | string | 主标题第一行（普通字） | `把低频放在` |
| `titleB` | string | 主标题第二行（强调色块里的词） | `正中` |
| `sub` | string | 副标题（一行短句） | `低频是胸腔，中频是字，高频是齿——三段各有落点` |
| `deck` | string | 底部频段 mono 说明 | `20Hz · 1kHz · 20kHz` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `439,665,101,267,614,80,374,608,792,89,199,484,86,861,184,326,341,427,635,766,86,240,614,318,368,134,614,83,1000,377,39,282,490,98,804,116,326,665,632,47,199,561,86,774,122,763,335,15` |
| `accent` | color | 强调色（高频段柱 / 播放头 / 斜纹带） | `#3D7BFF` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | 5.6 |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`E:/FDE/_build/qcwork/aud_synth.py`
- 渲染样片：`node scripts/render.mjs aud-eq-01 templates/aud-eq-01/presets/default.json`
- 参考样本：`E:/FDE/motion-preview/templates/aud-wave-01/`（同族的单向波形版式）、`E:/FDE/motion-preview/templates/sin-spectrum-bars/`（存量频谱，只能当反面参照）
