# 环形电平表 视觉规范

## 方向

画面是一只 600px 的环形电平表：56 根刻度均匀绕一圈，刻度随这条声音的振幅包络长短变化，正中是 92px 的分贝读数。右侧一条 48 段的历史包络带铺在底部，一根强调色标记卡在最近 HOLD 秒里的最高点上停住——「峰值掉不下去」这件事是有画面的。

## Palette

- Background: `#0F0F0F`（墨底）
- Foreground: `#FFFFFF`（刻度 / 描边 / 表圈）
- Accent: `#FF5FA2`（强调色变量；超过参考电平的刻度 / 历史带已播段 / 峰值保持标记）
- Chip: `#FF5FA2` 底 + `#0F0F0F` 字（标题词块）
- Ghost: `rgba(255,255,255,.34)`（历史带未播段）
- Yellow: `#FFD429`（眉标 / 通告条 / 参考电平读数）
- Muted: `#9A9A9A`（刻度数字 / REF 标注）
- Stripe: `repeating-linear-gradient(45deg, #FF5FA2 0 10px, #0F0F0F 10px 20px)`

## Typography

- 分贝读数：`Sarasa Gothic SC`，字重 900，92px，line-height 1，`font-variant-numeric: tabular-nums`
- 主标题：`Noto Sans SC`，字重 900，80px，line-height 1.05
- 副标题两行：`Noto Sans SC`，字重 700，29px / 继承
- 眉标 / 单位 / REF / 刻度：`Sarasa Gothic SC`，字重 700–900，20–26px，letter-spacing .06–.16em
- 页脚：mono 标签 22px + sans 正文 25px

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应 938px，`align-items:center`，内边距 20 / 72 / 30）→ 斜纹带 20px → 页脚 66px
- 主区横向两栏：环形表 600×600 固定 + 右栏自适应（间隙 74px，剩 1102px）
- **环形刻度怎么摆**：每根刻度 `position:absolute; left:50%; top:calc(50% − 246px); width:11px; transform-origin:50% 50%; transform:rotate(Adeg)`——元素中心落在半径 246 的圆上、绕**自身中心**旋转，所以高度变化时圆心不会飘（这是环形表最容易做错的地方）
- 扫角 280°（从 −140° 到 +140°），56 根均分；最大刻度长 56px，圆心距 246 → 最大外径 274 < 300，半径不碰边
- 表圈 330px 圆内是分贝读数（92px）+ 单位（24px）+ REF 标注（20px），三行居中
- 右栏纵向四段：眉标 32px → 标题栈（上边距 0，两行 80px + 两行副标题）→ 历史带 56px → 刻度尺（间隙 26px）
- 历史带 48 段 16px 宽的柱，整段都在画（代表这条音轨的完整包络），已播过的段翻成强调色
- 峰值保持标记 `#hold` 是历史带里的 7px 强调色竖条，`height` 由 JS 写入
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 定格，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 主区 / 眉标 / 两行标题 / 两行副标题 / 历史带 / 刻度尺依次硬着陆（0.22–0.30s）
- **环形刻度（音频驱动）**：`tickLen(i,k) = 8 + round(peak(k)/1000 · 48 · (0.72 + 0.28·|cos(0.7i)|))`——只依赖刻度序号 i 与时间桶 k
- **分贝读数**：`db(k) = −60 + round(60·peak(k)/1000)`，每桶 `set()` 一次（读数不需要插值）
- **峰值保持**：`max(peak[k−HOLD/SEG], …, peak[k])`——**对一段固定输入取滑动最大值，不是有状态的累加器**，所以仍然是 t 的纯函数（乱序 seek 也给同一个答案）
- **历史带**：第 b 段在 b ≤ k 时翻成强调色，每桶 `tl.call` 一次
- 环形表入场时整体 −24° 转正（0.5s，power3.out），刻度转动只是入场，不是持续自转
- 降级分支：刻度定格在 62% 处那一帧、读数与保持标记定格、历史带停在 62% 处，时间轴 2.3s

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-06.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**，无第三方素材、无版权问题
- 这条轨是「一路爬升再回落」：包络从 99/1000 爬到 1000/1000 再落回 16/1000——**峰值保持只有在有回落时才看得见**，用一条一路平的轨做这张表就白做了
- 页面挂 `<audio src="音轨 voice-06.wav" data-start="0" data-duration="5.6">`，放在 `#stage` 之外；渲染时由 hyperframes 在 Node 侧离线裁剪混流封装
- `peaks` = 该 wav 的离线 RMS 包络（48 桶，整数 0–1000），`aud_batch2_synth.py` 算出，`音轨 voice-06.peaks.json` 留溯源
- 历史带的 48 段是**整段包络**（静态，忠实于这条音轨），它与环形的区别是：环形的刻度在动，历史带是在告诉你「整条长什么样」

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
- 环形刻度必须用「元素中心落在半径上 + 绕自身中心旋转」，不要用 `transform-origin:50% 100%` 加 `translateY(-R)`——那样高度一变圆心就飘
- 峰值保持**必须是滑动最大值，不能写成 `Math.max(prev, cur)` 这种累加器**：累加器是有状态的，乱序 seek 会给出与顺序播放不同的答案，音画就对不上了
- 分贝读数用 `tabular-nums`，否则 −60 → −9 的位宽变化会让表圈中心的字左右跳
- `level` 只改刻度与「超参考电平」的着色，**不许让用户直接填指针角度或读数**——那两个都是 f(t) 的派生物（规范 §6.4）

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距，≤12 字） | `METER / 环形` |
| `titleA` | string | 主标题第一行（普通字，≤6 字） | `这一段，` |
| `titleB` | string | 主标题第二行（强调色块里的词，≤4 字） | `音量超标` |
| `level` | number | 刻度盘参考电平（dBFS，0 到 0，越接近 0 越贴顶；只改刻度，不改指针逻辑） | `-3` |
| `peakHold` | number | 峰值保持秒数（0.3–1.5，只影响保持标记的停留时长） | `0.8` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `99,252,78,277,18,362,21,376,39,465,131,351,358,1…`（48 桶） |
| `accent` | color | 强调色（超过参考电平的刻度 / 峰值保持标记） | `#FF5FA2` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-meter-01 templates/aud-meter-01/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
