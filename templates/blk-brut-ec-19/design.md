# 我们 vs 别家视觉规范

## 方向

竖向对撞双栏：左右两栏各列三行对比项，中间一枚白色 VS 方块硬切在接缝上，右侧整栏压强调色并带一枚推荐角标。适合参数横评、竞品对比类带货画面。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`（右侧整栏底 / 斜纹带 / 顶部标签）
- Right name bar: `#0F0F0F` 底 + accent 字
- VS block: `#FFFFFF` 底 + 8px 黑色硬阴影
- Left values: `#6B6B6B`

## Typography

- 主标题：`Noto Sans SC`，字重 900，38px
- 栏名：`Noto Sans SC`，字重 900，36px
- 对比项名：`Noto Sans SC`，字重 700，26px
- 对比项值：`Sarasa Gothic SC`，字重 900，44px，tabular-nums
- 眉标 / 推荐角标：`Sarasa Gothic SC`，字重 700 24px / 900 24px

## 布局

- 画布 1920×1080，顶部反白条 80px，底部斜纹带 20px
- 主体两栏等宽，中缝 3px 实线（右侧栏不画右边框）
- 每栏顶部名称条 padding 18/32，下沿 3px 实线
- 每栏三行等高，行间共享 3px 边框
- VS 方块 130×130px 绝对居中；推荐角标绝对定在右栏右上角

## 动画

- 顶部反白条落下，眉标与主标题错峰补位
- 两栏从左右画外对向切入（各 0.3s，power4.out）
- 三行对比项自各自方向错峰切入（纯位移，opacity 恒为 1）
- VS 方块以 scale .86 → 1 弹入，落定后阴影压 2 帧再弹回 8px 档
- 推荐角标、底部说明与斜纹带依次收尾
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `title` string 主标题（黑条上的一行 900 白字）
- `leftLabel` string 左侧 · 名称
- `rightLabel` string 右侧 · 名称
- `k1` string 第一项名称
- `a1` string 左侧第一项值
- `b1` string 右侧第一项值
- `k2` string 第二项名称
- `a2` string 左侧第二项值
- `b2` string 右侧第二项值
- `k3` string 第三项名称
- `a3` string 左侧第三项值
- `b3` string 右侧第三项值
- `note` string 底部口径说明（一行 mono）
- `accent` color 强调色（右侧色块 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 对比项左右两侧的名称必须用同一个变量渲染，不允许左右各写一份
- 一帧只放一组对比，不叠第四行
- VS 方块用 translate(-50%,-50%) 定位，动效只改 scale
- 深色名称条上的字必须换白，不许沿用 ink 底 ink 字
- 不用 rotate / skew 入场，不用 back.out / elastic / bounce