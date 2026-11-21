# 今日截止日历卡视觉规范

## 方向

日历物件构图：左侧一张 520px 宽的日历卡，顶部强调色月头条压着巨型日期数字与星期胶囊；右侧截止大字、截止时间块与说明依次排开。适合把「今天最后一天」做成一个具体日期对象的截止帧。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`（日历顶条 / 截止块阴影 / 斜纹带）
- Card fill: `#FFFFFF`
- Weekday chip: `#0F0F0F` 底 + `#FFD429` 字
- Deadline block: `#0F0F0F` 底 + `#FFFFFF` 字 + 6px accent 硬阴影

## Typography

- 日历日期：`Sarasa Gothic SC`，字重 900，260px，tabular-nums
- 月份：`Sarasa Gothic SC`，字重 900，52px，letter-spacing .1em
- 星期：`Noto Sans SC`，字重 900，34px
- 主标题：`Noto Sans SC`，字重 900，96px
- 截止时间：`Sarasa Gothic SC`，字重 900，40px
- 说明行：`Noto Sans SC`，字重 700，32px

## 布局

- 画布 1920×1080，顶部反白条 68px，底部斜纹带 20px
- 主体左右布局：左日历卡定宽 520px，右文案列自适应，间距 64px
- 日历卡两段：顶条 padding 20/0，主体 padding 24/20 居中
- 右侧文案列四段：大字、截止块、说明行、3px 实线
- 主体上下内边距 34/72/40

## 动画

- 顶部反白条落下，眉标错峰补位
- 日历卡整张自左上斜向拍入，落定后阴影压 2 帧再弹回 10px 档
- 月份、日期、星期依次自上补位
- 右侧主标题自右画外切入，截止块与说明行错峰补位
- 分隔线 scaleX 从 0 展开到底部说明与斜纹带收尾
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `month` string 月份（如「11 月」）
- `day` number 日历卡上的日期
- `weekday` string 星期（如「星期五」）
- `title` string 右侧主标题（中文大字）
- `deadline` string 截止时间戳
- `desc` string 截止说明（一行）
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（日历顶条 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 一帧只放一个截止，不叠加第二个时间点
- 日期钳制在 1–31，不出现 0 月或 32 日
- 日历卡不做撕角 / 圆角缺口造型，只有 4px 直角
- 分隔线用 scaleX 展开，不做 opacity 淡入
- 不使用 rotate / skew 入场，不用 back.out / elastic / bounce