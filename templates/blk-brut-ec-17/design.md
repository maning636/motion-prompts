# 涨价倒计时视觉规范

## 方向

左时间轴右价格构图：左侧竖向时间轴两个节点标出今天与明天，右侧两行价格并置（今日价虚化、明日价加重音），下方一整条满宽倒计时条压缩归零。适合涨价预告、限时恢复原价的压力帧。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`（明日行 / 倒计时条 / 节点方块 / 斜纹带）
- Node done: `#2FD07A`
- Today price: `#6B6B6B`
- Countdown block: `#0F0F0F` 底 + accent 字 + 8px 白色硬阴影

## Typography

- 主标题：`Noto Sans SC`，字重 900，72px
- 时间轴节点标签：`Noto Sans SC`，字重 900，36px
- 价格：`Sarasa Gothic SC`，字重 900，118px，tabular-nums
- 涨额片：`Sarasa Gothic SC`，字重 900，34px，ink 底白字
- 倒计时小时：`Sarasa Gothic SC`，字重 900，120px，tabular-nums

## 布局

- 画布 1920×1080，顶部反白条 66px，底部斜纹带 20px
- 主体左右布局：左时间轴定宽 340px（竖轴 3px 贯穿），右价格列自适应
- 价格列左边缘画一条 3px 实线，两行共用左边框不重复
- 倒计时条满宽强调色，padding 26/72/26
- 底部口径说明 padding 20/72/24

## 动画

- 顶部反白条落下，眉标补位
- 时间轴两个节点分别自上与自下落位，方块斜向拍入
- 两行价格自右画外依次切入，金额自上补位
- 倒计时条自下硬落位，数字块阴影压 2 帧再弹回 8px 白影
- 倒计时推进：ease:none 匀速，onUpdate 只写 textContent，窗口写死 2.0 秒
- 说明行与斜纹带依次收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `todayLabel` string 今日行的标签
- `nextLabel` string 明日行的标签
- `todayPrice` number 今日价（元）
- `nextPrice` number 明日价（元）
- `cdLabel` string 倒计时条上的标题
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（倒计时条底 / 明日行 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：涨额 `rise = nextPrice − todayPrice`。

## Avoid

- 涨额必须由两个价算出，不允许单独再填
- 倒计时是时间轴位置的纯函数，禁止 setInterval / Date.now
- 倒计时窗口写死 2.0 秒压完，再进 hold，绝不让时间轴随小时数增长
- 深底上的涨额片与倒计时块阴影必须换白
- 一帧只放一个价格焦点，不叠加第二个优惠