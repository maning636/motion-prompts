# 口播波形封面视觉规范

## 方向

画面是知识口播的 audiogram 封面：上方是 104px 900 字重的标题两行（第二行压在蓝色词块上），中间一条 32 根柱子的波形条从左向右推过去，一枚竖线播放头卡在波形上匀速推进，底部是进度条 + mono 时间码。柱高不是装饰，是这条音频真实振幅包络的形状。

适合知识口播、播客切片、直播回放的封面与转发片段。静音看也能读懂进度与层级——声音是加分，画面本身独立成立。

## Palette

- Background: `#FFF6E5`（纸底）
- Foreground: `#0F0F0F`（描边 / 文字 / 波形柱唯一来源）
- Accent: `#FF5FA2`（强调色变量，默认值；波形柱 / 播放头 / 进度条）
- Chip blue: `#3D7BFF`（标题词块）
- Muted: `#6B6B6B`（刻度数字）
- Yellow: `#FFD429`（期数标签）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 主标题：`Noto Sans SC`，字重 900，104px，letter-spacing 0
- 副标题：`Noto Sans SC`，字重 700，32px，letter-spacing 0
- 眉标 / 期数标签 / 刻度：`Sarasa Gothic SC`，字重 700，21–26px，letter-spacing .06–.14em
- 时间码：`Sarasa Gothic SC`，字重 900，28px，letter-spacing .08em，`font-variant-numeric: tabular-nums`（秒数跳动时位宽必须稳）
- 页脚：mono 标签 22px + sans 正文 25px 成对出现

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应，938px，上下内边距 40 / 34）→ 斜纹带 20px → 页脚 66px
- 主区自上：眉标行 32px → 标题栈（上边距 34，两行 104px/1.06 = 220px）→ 副标题 32px → 波形区 340px（上边距 46）→ 进度区（`margin-top:auto` 贴底）
- 波形区左右内边距 18px、3px 黑边；32 根 30px 宽的 pill 柱，`justify-content:space-between` 均分；柱高区间 12–292px
- 播放头是 `#stage` 的**直接子元素**：5px 竖线 + 顶部 21px 方帽 + 底部 21px 方钮，`left/top/height` 由 JS 按波形区实测盒子写死
- 进度条：24px 高、3px 黑边、1776px 宽的轨道 + 强调色填充；下方一行是时间码 + 6 个等分刻度 + 总时长
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 静止 hold，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 眉标 / 期数 / 两行标题 / 副标题 / 波形区依次硬着陆（0.22–0.28s，power4.out），词块落定后阴影压 2 帧再弹回
- **波形（音频驱动）**：`peaks` 数组 48 个桶，每个桶一个定长补间（`WIN/N`，`ease:'none'`），逐段把 32 根柱的高度 tween 到该桶对应的目标值。柱高只依赖两个自变量——柱序号 i 与时间轴秒数 t，**没有任何实时 analyser**
- **播放头（音频驱动）**：`x` 从 0 匀速推到波形实际宽度（实测 1771px），全程不出画布
- **进度条（音频驱动）**：宽度 `0% → 100%` 匀速；**时间码**：整秒 `set()` 硬切 00:00 → 00:05（时间码不需要逐帧）
- 斜纹带匀速滚动 40px（0.8s，ease:none）
- 尾部静止 hold 0.6s，画面停在「已播完」的定格状态，与音轨尾部静音对齐
- 演完定格最后一帧，无收尾 fade-out
- 降级分支：波形停成静态剪影（取包络 62% 处的高度向量），播放头停到 62%，时间码停 00:03，只保留 ≤8px 微位移淡入，时间轴 2.3s

## 音频路线（本族的命门，必读）

1. **音轨**：`音轨 voice-01.wav`（22050Hz 单声道，`pcm_s16le`，实测 5.599955s / 241KB）。这是本项目**完全自研合成**的语音包络音轨，无第三方素材、无版权问题——不是真人录音，design.md 里写明这一点。
2. **页面挂载**：`<audio id="voice" src="音轨 voice-01.wav" data-start="0" data-duration="5.6">`，放在 `#stage` 之外。hyperframes 渲染时在 **Node 侧**按 `src` 离线取文件 → 裁剪（`prepareAudioTrack`）→ 混流（`mixAudioTracks`）→ 封装（`muxVideoWithAudio`），**不依赖采样时浏览器真的出声**。
3. **实测确认**：`hyperframes timeline .` 输出 `timeline 5.6s` + `audio (1) voice 0-5.6s src=音轨 voice-01.wav`——音轨被识别、与时间轴等长。`hyperframes lint` 对这条 `<audio>` **零告警**。
4. **画面数据**：`peaks` 变量 = 该 wav 的**离线 RMS 包络**（48 桶，整数 0–1000），由 `离线包络脚本（未随仓分发）` 算出，同时落一份 `音轨 voice-01.peaks.json` 作溯源。
5. **为什么不做实时 AnalyserNode**：无头渲染是逐帧 seek 采样，hyperframes runtime 在 `__HF_RENDER_CAPTURE_MODE` 下把媒体当 seek 处理（`allowLiveTimelineSeek` 为 false），AnalyserNode 接在暂停的元素上读到的不是「此刻在放什么」；motion-qc 的探针同样是无序 seek。
6. **换音轨的操作**：换 `assets/` 里的 wav → 跑离线脚本重算 48 桶 → 把新数组填进 `peaks` → 把 `duration` 改成新音轨长度（并同步 `<audio data-duration>`）。

## Avoid

- **不用实时 `AnalyserNode` / rAF 驱动任何可见值**——波形必须是 `f(时间轴秒数)` 的纯函数，否则逐帧 seek 会失步或冻住
- 不用 `Date.now()` / `Math.random()` / `setInterval`；一切可见值只由时间轴位置决定
- 波形柱与均衡柱的圆角只用 `9999px`，不引第三种
- 描边恒 3px、阴影恒 `Npx Npx 0` 且 X=Y
- 零 overshoot：不出现 `back.*` / `elastic.*` / `bounce.*`，入场一律 `power4.out`
- 不用 opacity 淡入当主入场手段
- 播放头位移必须落在波形实际宽度内，任何时刻都不许出画布（落定期从 76% × 总时长开始扫出框）
- **降级媒体查询必须同时写 `transition-property:none`**：`transition-property` 的初始值是 `all`，只压 `transition-duration` 会让**所有内联样式改动**变成 0.01ms 的过渡——本模板的播放头 inline `top` 就是在降级分支里卡在旧值、被抽帧审计逮到的
- 音频窗口固定 `[0, WIN]`，`WIN = min(duration − 0.6, 音轨长度)`；禁止用变量值推算时间轴总长（数值填大就把时轴撑爆撞 `SMOKE_TOO_LONG`）
- 样片用 `--format mp4` 渲，不要用 `--format webm`：webm 走 alpha 捕获会注入 `background:transparent !important` 剥掉 stage 底色（见 RENDER-PIPELINE.md §5），本件是实底件不需要 alpha

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `AUDIO / 口播封面` |
| `titleA` | string | 主标题第一行（普通字） | `能听出情绪的` |
| `titleB` | string | 主标题第二行（强调色块里的词） | `封面` |
| `sub` | string | 副标题（一行短句） | `波形不是装饰，是这条口播的心跳` |
| `episode` | string | 右上角 mono 期数标签 | `EP.073` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `160,402,466,172,828,95,279,635,206,340,558,828,86,236,546,110,819,104,442,466,837,77,196,491,512,543,298,166,1000,399,71,242,580,236,791,77,279,899,313,196,417,390,641,509,365,933,196,15` |
| `accent` | color | 强调色（波形 / 播放头 / 进度条） | `#FF5FA2` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | 5.6 |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-wave-01 templates/aud-wave-01/presets/default.json`（默认 H.264 + AAC，音轨会被封进去）
- 参考样本：`同族模板目录`（同族的镜像 EQ 版式）、`同族模板目录`（存量裸 GSAP 的假波形，只能当反面参照）
