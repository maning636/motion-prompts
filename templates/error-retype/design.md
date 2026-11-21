# error-retype · 净室自研

## 设计意图
输入过程演示动效。屏幕中央一行「终端命令行」呈现四段动作：
1. 键入**正确前缀**（正常色）——建立"正在打字"的语境；
2. 键入**会打错的那段**（红字 + 抖动 + 状态条切 ERR、进度条到 55%）；
3. **退格**删除错字（红字一个个隐去）；
4. 键入**正确文案 + 后缀**（强调色），光标闪烁收尾。

用一张卡把「打字—出错—纠正」这个输入体验完整演出来，适合演示 AI / 编辑器 / 命令行工具的自我修复能力。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量走 JS `setProperty` + CSS `var(--xxx, #默认)` 双端接线 + fallback）
- 字体：`MiSans SemiBold` 作标题与徽章，`MEBHeiHeiTi` + 等宽栈作命令行
- 图形语言：终端窗口（macOS 三色圆点 + 路径 + 徽章）、命令行（提示符 ❯ + 字符流 + 光标块）、
  状态条（图标 + 文案 + 进度条 + 步进标签）；顶部 eyebrow 短线 + 底部脚注 dot，安全边距 ≥96px
- 错误状态色 `#FF5C5C` 与成功强调色 `#00FF00` 形成清晰二元对比

## 动效说明（自建运动语法）
- **入场**：eyebrow / 标题 / 终端窗口三段错峰 `fade + y` 上移，`power3.out`
- **打字节奏**：每字 `0.055s` 步进，`opacity 0→1` + `y 4→0` 极小位移（避免整行抖动）
- **错误阶段**：整行 `.shaking` 触发 `shakeX` keyframes（0.28s，`steps(4)`，infinite），
  状态条同时淡入 + 上移，badge LED 切红，进度条推到 55%
- **退格**：错字按 `0.06s` 逆序隐去（比打字略快，模拟 Backspace 手感）
- **重打**：以 `0.055s` 步进键入正确词与后缀，进度条推到 95%
- **收尾**：t=4.8s 后停抖动、状态条切换到 `✓ OK`、进度到 100%，光标闪 4 次收尾
- **总时长**：6s，`__timelines.main` `paused` 注册

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| eyebrow | string | INPUT DEMO · TYPE / BACKSPACE / RE-TYPE | 顶部英文小标签 |
| title | string | 打错，删掉，再对一次 | 标题（页面里由固定片段拼装高亮） |
| subTitle | string | 输入过程中的自我纠正 | 副标题 |
| prefix | string | `npm install ` | 正确前缀（正常色键入） |
| errorText | string | `fack` | 会打错的那段（红字，抖动） |
| correctText | string | `fastify` | 退格后重打的正确词 |
| suffix | string | ` --save` | 正确词之后追加的后缀 |
| errorMsg | string | 拼写错误 · 回退重打 | 错误状态条文案 |
| okMsg | string | 包已安装 · 2.1s | 成功状态条文案 |
| accent | color | #00FF00 | 强调色（正确文案、光标、badge、进度条） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明 / mp4 / webm |

## 关键 DOM id
- `#codeLine` —— 字符容器（内部每个 `.char` 是一个字）
- `#cursor` —— 光标块
- `.char` / `.char-error` —— 字符 span；错字加 `.char-error` 走红字
- `#termBar` —— 终端标题栏（可 `+=err` / `+=ok`）
- `#statusMsg` —— 状态条容器（`err` / `ok` 状态类）
- `#progFill` —— 进度条填充（宽度 % 由 timeline 更新）

## 净室自查记录
1. **功能理解来源**：仅依任务卡的一句话意图「输入过程演示：字符键入→错误部分标红删除（退格动画）→重新正确键入」+
   本项目内既有契约（GSAP / data-composition-variables / __timelines.main / 三颜色字段 + exportMode enum），
   未访问任何外部仓库源码。
2. **无代码可比**：DOM 结构（`.term` / `.termBar` / `.codeLine` / `.char` / `#cursor` / `.status` / `.prog`）
   为本模板自创；`shakeX` keyframe、进度条推进曲线、状态条切换节奏全部按本任务自设。
3. **视觉自建过程**：
   - 终端窗口沿用 macOS 三色圆点作为「窗口」通用符号，路径栏居中显示 `~/workspace — zsh`，右侧 badge 用 LED + 文案做状态指示。
   - 命令行采用「提示符 + 字符容器 + 光标块」布局，光标用 `box-shadow` 光晕强化"当前插入位置"。
   - 状态条与进度条并排：左侧图标 + 文案（错误 / 成功两态），右侧步骤名 + 进度条 + 百分比，让"进度感"和"错误感"同时可见。
4. **命名与曲线**：class 命名 `term / codeLine / char / char-error / cursor / status / prog / progFill / progStep`；
   缓动 `power3.out / power2.out / power1.inOut / power1.out / power2.inOut` 全部 GSAP 内置；
   时长 6s 与 meta.json `duration` 字段一致。
5. **红线合规**：未联网、未使用任何 web 搜索工具、未打开可见浏览器窗口；
   仅在本任务 5 个文件内写入，未修改 motion-library / lab/catalog.json / 其他卡。
6. **结论**：clean-room implementation，功能与「输入过程演示类动效」等价；
   无上游 attribution，license 为 `Proprietary - FDE`。
