# 整点秒杀倒计时视觉规范

## 方向

整屏反白倒计时卡：顶部一条斜纹带压住画面，中部三格白底倒计时格逐秒跳数，归零那一帧整排硬切成「开抢」态，底部一枚绿色 CTA 与口径说明并置。适合整场开抢、限时秒杀的时间压力帧。

## Palette

- Background: `#0F0F0F`（整屏反白）
- Foreground: `#FFFFFF`
- Accent: `#FFD429`（斜纹带 / 眉标 / 单位标签）
- Cell: `#FFFFFF` 底 + `#0F0F0F` 字 + 8px 白色硬阴影
- CTA: `#2FD07A` + 8px 白色硬阴影

## Typography

- 倒计时数字：`Sarasa Gothic SC`，字重 900，180px，tabular-nums
- 开抢态：`Noto Sans SC`，字重 900，88px
- 单位标签：`Sarasa Gothic SC`，字重 700，24px，letter-spacing .14em
- 眉标：`Sarasa Gothic SC`，字重 700，26px，letter-spacing .14em
- CTA：`Noto Sans SC`，字重 900，34px

## 布局

- 画布 1920×1080，顶部与底部各一条 20px 斜纹带
- 眉标行 padding 40/88/30
- 三格倒计时格居中，每格 352×280，格间距 22px，冒号自底部对齐
- 底部 CTA 行 padding 0/88/36，CTA 与口径说明横向并排
- 深底上描边与斜纹里的 ink 全部换成 white

## 动画

- 顶部斜纹带分格擦出（steps(8)，0.34s）
- 眉标行落下，左右两格从左右画外对向切入，中格最后落
- 每格落定后阴影压 2 帧再弹回 8px 白影
- 倒计时推进：ease:none 匀速，onUpdate 只写 textContent
- 归零那一帧整排 className 硬切成开抢态（模 8，1 帧不做渐变）
- CTA、口径说明与底部斜纹带依次收尾
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（反白画面上的 mono 字）
- `title` string 主标题（中文大字）
- `titleB` string 倒计时格标签（默认「开抢」，倒计时归零后三格内同步显示）
- `seconds` number 起始倒计时秒数（秒）
- `cta` string 按钮文案（唯一一处 CTA）
- `note` string 底部口径说明（一行 mono）
- `accent` color 强调色（斜纹带 / CTA 底）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：时 / 分 / 秒三位数字由 `seconds × (1 − 进度)` 推出。

## Avoid

- 倒计时是时间轴位置的纯函数，禁止 setInterval、setTimeout、Date.now
- 倒计时窗口写死 1.8 秒压完，再进 hold，绝不让时间轴随起始秒数增长
- onUpdate 里只写 textContent，不做任何 DOM 测量
- 一帧只放一个 CTA，不叠加第二个倒计时
- 深底上描边与阴影必须换白，不许沿用 ink