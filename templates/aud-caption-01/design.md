# 逐句字幕卡 视觉规范

## 方向

画面把口播的原话一句一句放出来：58px 的字幕台，一句一屏，切换点由音频窗口四等分推出来，字幕台底下一条 10px 进度条显示这一句自己念到哪儿；再下面一条 64 根柱的能量条跟着这条声音的包络起伏。静止的一帧里，「说到第几句、这句多重、这句走到哪」三件事同时可读。

## Palette

- Background: `#FFF6E5`（纸底）
- Foreground: `#0F0F0F`（描边 / 文字 / 能量柱 / 进度条轨道）
- Accent: `#FF5FA2`（强调色变量；句内进度条 / 总进度填充 / 词块 / 斜纹带）
- Muted: `#6B6B6B`（句号角标 / 总时长 / 刻度）
- Yellow: `#FFD429`（句序药丸 / 通告条标签）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 字幕正文：`Noto Sans SC`，字重 900，58px，line-height 1.3，nowrap + ellipsis
- 主标题：`Noto Sans SC`，字重 900，80px，line-height 1.05
- 副标题：`Noto Sans SC`，字重 700，29px
- 句号角标 / 句序药丸 / 时间码 / 刻度：`Sarasa Gothic SC`，字重 700–900，21–28px，letter-spacing .08–.12em，时间码 `tabular-nums`
- 页脚：mono 标签 22px + sans 正文 25px

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应 938px，内边距 40 / 72 / 34）→ 斜纹带 20px → 页脚 66px
- 主区自上：眉标行 32px → 标题栈（上边距 28，两行 80px）→ 副标题 29px → 字幕台 222px（上边距 32）→ 能量条 170px（上边距 28）→ 进度区（`margin-top:auto` 贴底）
- 字幕台 3px 黑边、白底、左右内边距 40px 垂直居中；左上角一句 22px mono 句号，底部一条 10px 强调色句内进度条
- **中文大字的行高要盖过字面盒而不是 em 盒**：58px 中文的实际字面盒约 79px，行高写 1.3 只有 75px，上下会被切掉一点（`overflow:hidden` + `ellipsis` 会让它变成真裁切）
- 能量条 64 根 20px 宽的 pill 柱，`justify-content:space-between` 均分，柱高区间 8–152px，底边一条 3px 黑线
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 定格，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 眉标 / 句序 / 两行标题 / 副标题 / 字幕台 / 能量条依次硬着陆（0.22–0.28s）
- **能量条（音频驱动）**：`max(8, round(PEAKS[floor(k + i·N/64) % N]/1000 · 152))`，每桶一个定长补间（`ease:'none'`）
- **字幕切换**：`sentAt(t) = (LI0 + clamp(floor(t/(WIN/4)), 0, 3)) mod 4`——切换点是**推导**的，不让用户填时间（规范 §6.4）
- **句内进度条**：宽度 = `((t/SENTSEG) mod 1)·100%`，随音频窗口四等分循环
- **总进度条**匀速到 100%；时间码整秒硬切 00:00 → 00:05
- 降级分支：能量条定格在 62% 处那一帧、字幕停在 62% 处该显示的那句、总进度停 62%、时间码停 00:03

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-04.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**，无第三方素材、无版权问题
- 这条轨是「密排快语」，包络始终在 333–1000 之间——**能量条从头到尾都不会塌下去**，句子之间没有大片空白，所以「四句」的时间切分不会和真实语流打架
- 页面挂 `<audio src="音轨 voice-04.wav" data-start="0" data-duration="5.6">`，放在 `#stage` 之外；渲染时由 hyperframes 在 Node 侧离线裁剪混流封装
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
- `lines` 用**全角竖线｜**分隔；句子里**不要**再出现竖线，会被切开
- 字幕超 18 字必须换文案：字幕台左右内边距 40px × 2 + 画布 72px × 2 = 1776px 可用，58px 中文一行放不下 18 个字就会出省略号
- **中文 58px 的行高不能低于 1.4**（字面盒 79px > em 盒 75px）；行高不够时 `overflow:hidden` 会把字的上下沿切掉，缩略图上看不出来，58px 大字上一眼就是「字被削了」
- `B.fit()` 对字幕无效——它是 flex 行里的项，**会被 flex 压缩**；字幕的宽度控制只能靠字数上限 + `nowrap` + `ellipsis`
- 字幕切换点不要做成独立时间轴：`sentAt` 已经由 t 推导，再叠一条 `tl.call` 序列就要手动同步两套时间点，迟早对不上

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距，≤12 字） | `CAPTION / 逐句` |
| `titleA` | string | 主标题第一行（普通字，≤6 字） | `把原话，` |
| `titleB` | string | 主标题第二行（强调色块里的词，≤4 字） | `一句句放` |
| `lines` | string | 四句字幕，用全角竖线｜分隔（每句≤18 字，如 我不是在讲工具｜我是在讲省下来的时间｜…） | `先说结论：这套流程三步就能跑完｜第二步最花时间，但它决定后面顺不顺｜工具不是重点，节奏才是｜下期讲怎么把它变成习惯` |
| `lineIdx` | number | 从第几句开始念（0–3，超过 3 自动回到 0） | `0` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `591,447,705,346,907,401,629,857,464,586,646,764,…`（48 桶） |
| `accent` | color | 强调色（当前句底衬 / 能量条 / 进度填充） | `#FF5FA2` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-caption-01 templates/aud-caption-01/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
