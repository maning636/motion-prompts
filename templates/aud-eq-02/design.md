# 两行对比均衡 视觉规范

## 方向

画面把同一条声音画两遍：上排是原声，下排是压过之后的版本，中间一条 3px 黑线把两者隔开。两排读的是同一份 peaks、同一个时间桶，差别只有一条压缩曲线——所以观众看到的「变平了」是算出来的对比，不是两张拼在一起的图。

## Palette

- Background: `#FFF6E5`（纸底）
- Foreground: `#0F0F0F`（描边 / 文字 / 上排原声柱 / 中线 / 游标）
- Accent: `#FF5FA2`（强调色变量；下排处理后柱 / 通告条 / 斜纹带）
- Chip: `#3D7BFF` 底 + `#FFFFFF` 字（标题词块）
- Muted: `#6B6B6B`（频段说明 / 刻度）
- Yellow: `#FFD429`（游标方帽）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 主标题：`Noto Sans SC`，字重 900，86px，line-height 1.05
- 副标题：`Noto Sans SC`，字重 700，29px
- 行标签（RAW / COMP）：`Sarasa Gothic SC`，字重 700，19px，letter-spacing .14em
- 频段说明 / 时间码 / 刻度：`Sarasa Gothic SC`，字重 700–900，20–26px，时间码 `tabular-nums`
- 页脚：mono 标签 22px + sans 正文 25px

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应 938px，内边距 40 / 72 / 34）→ 斜纹带 20px → 页脚 66px
- 主区自上：眉标行 32px → 标题栈（上边距 26，两行 86px）→ 副标题 29px → 对比区 390px（上边距 34）→ 频段说明（`margin-top:auto` 贴底）
- 对比区 390px 内：上排 190px 贴顶、下排 190px 贴底，中间 3px 黑线居中；每排 36 根 22px 宽的 pill 柱，`justify-content:space-between` 均分
- 两排各自在两端有一行 19px 的 mono 行标签（RAW 0–1000 / COMP 0.30–0.82），把量纲直接写在画上
- 游标是 `#stage` 的直接子元素：5px 墨色竖线贯穿整块对比区 + 顶部 21px 黄色方帽，`left/top/height` 由 JS 按对比区实测盒子写死
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 静止，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 眉标 / 两行标题 / 副标题 / 对比区依次硬着陆（0.22–0.28s，power4.out）
- **上排（音频驱动）**：`max(10, round(PEAKS[idx]/1000 · 190))`，`idx = floor(k + c·N/36) % N`
- **下排（音频驱动）**：`max(10, round(comp(x) · 190))`，同一个 `idx`，`comp(x) = 0.30 + 0.52·x^0.55`
- 两排在**同一个**补间时刻各自 tween（`WIN/N`，`ease:'none'`）——拆开写会出现上排已经变、下排还没变的半拍错位
- 游标匀速推进到对比区实际宽度；时间码整秒硬切 `00:0s / 00:05`
- 降级分支：两排定格在 62% 处那一帧（对比关系在静止画面里依然成立），游标停 62%，时间码停 00:03

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-04.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**（基频 + 共振峰 + 确定性伪噪声摩擦音 + 手工音节计划），无第三方素材、无版权问题
- 这条轨是「密排快语」：音节几乎不留缝，包络最小值就有 333/1000——只有密集的包络才看得出压缩把动态收窄了多少，稀疏的包络对比会像两排随机噪声
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
- 两排**必须**用同一个 `idx` 公式——上排用一种取样下排用另一种，两排就不在同一个时间点上，「对比」会变成「错位」
- 压缩曲线不要写成线性缩放：线性缩放两排比例恒定，观众看不出任何处理
- `comp()` 的下限不能取 0（那不是压缩那是降噪），上限不能取 1（那不是压缩那是削顶）

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距，≤12 字） | `EQ / 两行对比` |
| `titleA` | string | 主标题第一行（普通字，≤6 字） | `压掉的那一段，` |
| `titleB` | string | 主标题第二行（强调色块里的词，≤4 字） | `就是答案` |
| `sub` | string | 副标题（一行短句，≤24 字） | `上排原声，下排压过：底噪抬起来，峰顶削下去` |
| `deck` | string | 底部 mono 说明（≤18 字） | `RAW 0–1000 · COMP 动态压缩` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `591,447,705,346,907,401,629,857,464,586,646,764,…`（48 桶） |
| `accent` | color | 强调色（下排处理后柱 / 中线 / 斜纹带） | `#FF5FA2` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-eq-02 templates/aud-eq-02/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
