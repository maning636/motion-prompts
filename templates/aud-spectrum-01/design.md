# BPM 节拍频谱 视觉规范

## 方向

墨底上先是一行方块闪块，再是一条 64 根细柱的柱阵。两条信息各走各的：闪块按 bpm 推导的拍长循环填色，柱高按这条声音真实的振幅包络起伏。一根白色竖线扫过柱阵——「节拍是人为的格子，包络是这条声音的样子」。

## Palette

- Background: `#0F0F0F`（墨底）
- Foreground: `#FFFFFF`（描边 / 柱阵底边 / 扫描线）
- Accent: `#2FD07A`（强调色变量；柱阵 / 当前拍闪块 / 通告条 / 页脚标签）
- Chip: `#2FD07A` 底 + `#0F0F0F` 字（标题词块）
- Beat base: `rgba(255,255,255,.06)`（未踩中的闪块）
- Yellow: `#FFD429`（拍号药丸 / 扫描线方帽）
- Muted: `#9A9A9A`（刻度）
- Stripe: `repeating-linear-gradient(45deg, #2FD07A 0 10px, #0F0F0F 10px 20px)`

## Typography

- 主标题：`Noto Sans SC`，字重 900，84px，line-height 1.05
- 副标题：`Noto Sans SC`，字重 700，29px
- 眉标 / 拍号 / 时间码 / 刻度 / 页脚标签：`Sarasa Gothic SC`，字重 700–900，20–28px，letter-spacing .06–.14em
- 时间码 `font-variant-numeric: tabular-nums`
- 页脚：sans 正文 25px + mono 标签 22px 成对出现

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应 938px，内边距 40 / 72 / 34）→ 斜纹带 20px → 页脚 66px
- 主区自上：眉标行 32px → 标题栈（上边距 26，两行 84px）→ 副标题 29px → 闪块行 46px（上边距 26）→ 柱阵 300px（上边距 30）→ 页脚行（`margin-top:auto` 贴底）
- 闪块行是 `BPB` 个 `flex:1` 方块 + 12px 间隙，每块 46px 高、3px 白边
- 柱阵 64 根 16px 宽的 pill 柱，`justify-content:space-between` 均分，柱高区间 8–250px，底边一条 3px 白线
- 扫描线是 `#stage` 的直接子元素：4px 白色竖线 + 顶部 20px 黄色方帽，`left/top/height` 由 JS 按柱阵实测盒子写死
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 定格，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 眉标 / 拍号 / 两行标题 / 副标题 / 闪块 / 柱阵依次硬着陆（0.22–0.28s）
- **柱高（音频驱动）**：`max(8, round(PEAKS[floor(k + i·N/64) % N]/1000 · 250))`，每桶一个定长补间（`ease:'none'`）
- **闪块（音频驱动）**：拍长 `per = 60/BPM`，第 b 块的相位 `u = ((t − b·per) mod per)/per`（负数取模要先加一个 per 归一），`u < 0.28` 时填色——**纯由 t 求值，不累计、不 setInterval**
- **扫描线**匀速推进到柱阵实际宽度；时间码整秒硬切 00:00 → 00:05
- 降级分支：柱高定格在 62% 处那一帧、闪块定格在该时刻的相位、扫描线停 62%、时间码停 00:03

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-06.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**，无第三方素材、无版权问题
- 这条轨是「稳定节拍型」：强弱规律、几乎没有长音——在这种包络下「闪块按 BPM 走、柱高按包络走」这两条线才看得出是各走各的，换成起伏剧烈的轨就分不清了
- 页面挂 `<audio src="音轨 voice-06.wav" data-start="0" data-duration="5.6">`，放在 `#stage` 之外；渲染时由 hyperframes 在 Node 侧离线裁剪混流封装
- `peaks` = 该 wav 的离线 RMS 包络（48 桶，整数 0–1000），`aud_batch2_synth.py` 算出，`音轨 voice-06.peaks.json` 留溯源
- `bpm` / `beatsPerBar` 只改闪块节奏，**不改柱高公式**——柱高永远只由 peaks 与 t 决定（规范 §6.4）

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
- 闪块相位**必须**写成 `((t − b·per) % per + per) % per`，JS 的 `%` 对负数返回负值，直接取模会让第 0 块在 t < 0 时算出一整个拍长的相位
- 闪块不要用 `repeat:-1` 循环——时间轴上不能有无限循环（自检会拦），每桶 `tl.call` 求一次值即可
- `bpm` / `beatsPerBar` 要做区间钳制（60–180 / 2·4·8），否则用户填 0 会让拍长除零
- 柱阵 64 根柱 + 闪块 + 扫描线共 130+ 个元素，全部在 motion-qc 的出框检查范围内；柱宽别小于 14px，否则缩略图上就是一条糊线

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距，≤12 字） | `SPECTRUM / 节拍` |
| `titleA` | string | 主标题第一行（普通字，≤6 字） | `每小节四拍，` |
| `titleB` | string | 主标题第二行（强调色块里的词，≤4 字） | `柱子在跳` |
| `bpm` | number | 节拍数（60–180），决定节拍闪块的间隔 | `96` |
| `beatsPerBar` | number | 每小节拍数（2 / 4 / 8），只改闪块分段 | `4` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `825,570,345,300,892,135,327,296,973,314,309,184,…`（48 桶） |
| `accent` | color | 强调色（柱阵 / 节拍闪块 / 页脚标签） | `#2FD07A` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-spectrum-01 templates/aud-spectrum-01/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
