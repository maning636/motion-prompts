# 双色字幕（词级推进） 视觉规范

## 方向

画面下半部是字幕：当前句 58px 白字，念到哪个字哪个字就换成强调色；下一句 34px 灰字垫在底下，观众始终知道「马上要说什么」。上面是一条 56 根柱的能量轨，后 42 根走强调色。与逐句版的差别只有一处：这一版是**词级**推进。

## Palette

- Background: `#0F0F0F`（墨底）
- Foreground: `#FFFFFF`（描边 / 当前句未念到的字 / 刻度轴线）
- Accent: `#FFD429`（强调色变量；已念到的字 / 能量轨高段 / 词块 / 页脚标签）
- Ghost bar: `rgba(255,255,255,.34)`（能量轨低段）
- Next line: `#8E8E8E`（下一句垫底行）
- Stripe: `repeating-linear-gradient(45deg, #FFD429 0 10px, #0F0F0F 10px 20px)`

## Typography

- 当前句：`Noto Sans SC`，字重 900，58px，line-height 1.26，nowrap + ellipsis；已念到的字包在 `<em>` 里
- 下一句：`Noto Sans SC`，字重 700，34px，`#8E8E8E`
- 主标题：`Noto Sans SC`，字重 900，80px，line-height 1.05
- 副标题：`Noto Sans SC`，字重 700，27px
- 眉标 / 句序药丸 / 时间码 / 刻度：`Sarasa Gothic SC`，字重 700–900，20–28px，letter-spacing .06–.14em，时间码 `tabular-nums`
- 页脚：sans 正文 25px + mono 标签 22px

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应 938px，内边距 40 / 72 / 34）→ 斜纹带 20px → 页脚 66px
- 主区自上：眉标行 32px → 标题栈（上边距 24，两行 80px）→ 副标题 27px → 能量轨 170px（上边距 28）→ 字幕组（上边距 30，58px + 16px + 34px）→ 页脚行（`margin-top:auto` 贴底）
- 能量轨 56 根 18px 宽的 pill 柱，`justify-content:space-between` 均分，柱高区间 8–152px；前 14 根是常规色、后 42 根是强调色（写死在类名上，不参与动画）
- 字幕组两行：`.sa` 当前句、`.sb` 下一句。当前句按**字**拆成 `<span>` / `<em>` 两种元素，由 JS 在运行时拼
- 可用文字宽度：1776px（画布 1920 − 左右 72 × 2）
- 音频窗口 `[0, 5.0s]`，尾部 0.6s 定格，时间轴总长 **5.6s = 音轨长度**

## 动画

- 通告条 / 眉标 / 句序 / 两行标题 / 副标题 / 能量轨 / 字幕组依次硬着陆（0.22–0.28s）
- **能量轨（音频驱动）**：`max(8, round(PEAKS[floor(k + i·N/56) % N]/1000 · 152))`，每桶一个定长补间（`ease:'none'`）
- **切句**：`sentIdxAt(t) = (LI0 + clamp(floor(t/(WIN/4)), 0, 3)) mod 4`，句号变化时重建整句的字元素并把下一句写进垫底行
- **词级高亮**：`n = round(((t/SENTSEG) mod 1) · 字数)`，前 n 个字换成 `<em>`——**纯由 t 求值**，不做增量高亮（增量在乱序 seek 下会累积出错）
- 时间码整秒硬切 00:00 → 00:05
- 降级分支：能量轨定格在 62% 处那一帧、字幕停在 62% 处该显示的句子与进度、时间码停 00:03

## 音频路线（本族的命门，必读）

- 音轨 `音轨 voice-07.wav`（22050Hz 单声道 `pcm_s16le`，5.6s / 241KB），**完全自研合成**，无第三方素材、无版权问题
- 这条轨是「两段爆点 + 中间真静音」：1.0–3.2s 与 3.6s 后各一声重、中间留白——**中间那段静音正好落在第三句附近**，字幕会明显卡住一下然后继续走，这是词级推进最值得给人看的一种情形
- 页面挂 `<audio src="音轨 voice-07.wav" data-start="0" data-duration="5.6">`，放在 `#stage` 之外；渲染时由 hyperframes 在 Node 侧离线裁剪混流封装
- `peaks` = 该 wav 的离线 RMS 包络（48 桶，整数 0–1000），`aud_batch2_synth.py` 算出，`音轨 voice-07.peaks.json` 留溯源

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
- `lines` 用**全角竖线｜**分隔，句子里不要再出现竖线
- 字幕超 16 字必须换文案：58px 中文一行在 1776px 里放不下 16 个字以上，会出省略号
- **词级高亮不要写成增量**（`for (i=prev; i<n; i++) …`）——增量在 motion-qc 的乱序 seek 下会累积出错，音画就断了；必须每桶按 t 重算全句
- 字元素要在**换句时重建**，不要复用旧节点：`textContent` 长度变了但节点没换，下一次高亮的索引就会对不上
- 能量轨的高段色写死在类名上，不要放进补间——它是「刻度配色」不是「随时间变化的值」，混进补间会让降级分支的定格状态难以推理

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距，≤12 字） | `CAPTION / 双色` |
| `titleA` | string | 主标题第一行（普通字，≤6 字） | `先听这一句，` |
| `titleB` | string | 主标题第二行（强调色块里的词，≤4 字） | `再看这句` |
| `lines` | string | 四句字幕，用全角竖线｜分隔（每句≤16 字，如 这一段是真的重要｜别把它剪掉｜…） | `这一段是真的重要｜别在剪辑台把它剪掉｜这段安静是刻意的｜你听到的空白也是内容` |
| `lineIdx` | number | 从第几句开始念（0–3，超过 3 自动回到 0） | `0` |
| `peaks` | string | 离线 RMS 包络（JSON 数组，整数 0–1000；换音轨后用离线脚本重算） | `14,117,117,14,212,76,14,237,139,1000,190,294,158…`（48 桶） |
| `accent` | color | 强调色（已念到的字 / 能量条高段 / 词块） | `#FFD429` |
| `duration` | number | 总时长（秒，须等于音轨长度 5.6） | `5.6` |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 离线包络脚本：`离线包络脚本（未随仓分发）`（合成音轨 + 算 48 桶 RMS 包络）
- 渲染样片：`node scripts/render.mjs aud-caption-02 templates/aud-caption-02/presets/default.json --format mp4`
- 同族样板：`同族模板目录`、`aud-eq-01/`
