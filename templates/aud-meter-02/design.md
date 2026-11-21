# 竖向电平格 视觉规范

## 方向

画面右侧是一只 330×640 的电平井：26 个格子的网格是静态的，一根强调色电平柱在网格里上下动，一根墨色保持线卡在最近 HOLD 秒里的最高点上、掉不下去。左侧是 104px 的分贝读数。「电平已经降下来了，但峰值还挂在那儿」——这是压缩/限幅最值得讲的一张图。

## Palette

- Background: `#FFF6E5`（纸底）
- Foreground: `#0F0F0F`（描边 / 文字 / 网格线 / 参考线 / 保持线）
- Accent: `#FF5FA2`（强调色变量；电平柱 / 保持线读数 / 词块 / 斜纹带）
- Chip: `#FF5FA2` 底 + `#FFFFFF` 字（标题词块）
- Well grid: `rgba(15,15,15,.13)`（2px 横线，`repeating-linear-gradient(0deg, …)` 铺出 26 格）
- Muted: `#6B6B6B`（刻度数字 / REF 标注）
- Yellow: `#FFD429`（通告条标签）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 分贝读数：`Sarasa Gothic SC`，字重 900，104px，line-height 1，`font-variant-numeric: tabular-nums`
- 主标题：`Noto Sans SC`，字重 900，88px，line-height 1.05
- 副标题：`Noto Sans SC`，字重 700，30px
- 单位 / REF / PK / 刻度：`Sarasa Gothic SC`，字重 700–900，19–28px，letter-spacing .06–.14em
- 页脚：mono 标签 22px + sans 正文 25px

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应 938px，`align-items:center`，内边距 20 / 72 / 30）→ 斜纹带 20px → 页脚 66px
- 主区横向两栏：左栏自适应 + 右栏固定 330px 电平井 + 刻度列（约 54px），间隙 76px
- 电平井 330×640、3px 黑边、白底；网格用 `repeating-linear-gradient(0deg, rgba(15,15,15,.13) 0 2px, transparent 2px 24.6px)` 铺出 26 格（640 / 26 ≈ 24.6px）
- 三层叠在井里（从下到上）：`.vbar` 电平柱（贴底、高度由 JS 写）→ `.refline` 参考线（`bottom` 由 `level` 推导）→ `#hold` 峰值保持线（`bottom` 由滑动最大值写）
- 读数行在左栏底部：104px 分贝 + 28px 单位 + 右侧 `level` 推导出的 REF 标注
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 定格，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 主区 / 眉标 / 两行标题 / 副标题 / 读数行 / 右栏依次硬着陆（0.22–0.30s）
- **电平柱（音频驱动）**：`bar(k) = max(10, round(peak(k)/1000 · 604))`，每桶一个定长补间（`ease:'none'`）
- **分贝读数**：`db(k) = −60 + round(60·peak(k)/1000)`，每桶 `set()` 一次
- **峰值保持线**：`hold(k) = max(peak[k−HOLD/SEG], …, peak[k])` 映射到井高——**滑动最大值，不是累加器**，乱序 seek 也给同一个答案
- **PK 读数**：每桶 `set()` 一次显示当前桶值；参考线位置 `MAXH·(REFDB+60)/60` 由 `level` 一次算出，不参与动画
- 降级分支：柱高 / 读数 / 保持线全部定格在 62% 处那一帧，时间轴 2.3s

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-06.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**，无第三方素材、无版权问题
- 这条轨是「一路爬升再回落」：峰值落在第 24 桶（1000/1000），之后一路掉到 16/1000——保持线会先追上再原地停住，这正是这张表要讲的事
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
- 峰值保持**必须是滑动最大值，不能写成 `Math.max(prev, cur)`**——累加器有状态，motion-qc 的乱序 seek 会给出与顺序播放不同的答案，音画立刻对不上（这是试产级别的问题，不是风格问题）
- 网格用 `repeating-linear-gradient` 画，不要写 26 个 div——元素一多，motion-qc 的出框检查会把这 26 个全查一遍，慢且没意义
- 井里的三层都要显式 `position:absolute` + `bottom`，不要靠 flex 堆叠——保持线要贴着柱顶动，flex 做不到
- `level` 只改参考线位置，不许让用户直接填柱高或读数（规范 §6.4：派生量必须派生）

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距，≤12 字） | `METER / 竖格` |
| `titleA` | string | 主标题第一行（普通字，≤6 字） | `峰值卡住，` |
| `titleB` | string | 主标题第二行（强调色块里的词，≤4 字） | `下不来` |
| `level` | number | 参考电平（dBFS，0 到 0；只改刻度线位置，不改柱高逻辑） | `-6` |
| `peakHold` | number | 峰值保持秒数（0.3–1.5，只影响保持线的停留时长） | `0.7` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `99,252,78,277,18,362,21,376,39,465,131,351,358,1…`（48 桶） |
| `accent` | color | 强调色（电平柱 / 峰值保持线 / 词块） | `#FF5FA2` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-meter-02 templates/aud-meter-02/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
