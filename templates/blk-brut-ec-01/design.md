# 划线价对撞 · 到手价视觉规范

## 方向

满版左右对撞：左半屏反白压着划线原价，右半屏强调色压着到手现价，中间一枚白底 VS 方块硬切在接缝上，底部一条收尾把「直降多少钱 / 折扣几成」算清楚。适合带货视频里需要在一帧之内同时交代「原本多贵」和「现在多便宜」的商品价格卡。

## Palette

- Background: `#FFF6E5`（纸底，右半屏之外的底）
- Foreground: `#0F0F0F`（描边 / 右半屏文字）
- Accent: `#FFD429`（到手价色块 / 斜纹带 / 顶部标签）
- Ink panel: `#0F0F0F`（左半屏整块反白）
- Discount chip: `#FF5FA2`（底部 OFF 胶囊）
- Muted: `#6B6B6B`（口径说明小字）

## Typography

- 商品名：`Noto Sans SC`，字重 900，34px
- 眉标 / 标签：`Sarasa Gothic SC`，字重 700，22–24px，letter-spacing .12–.14em
- 价格数字：`Sarasa Gothic SC`，字重 900，152px（原价）/ 200px（到手价），tabular-nums
- 说明行：`Noto Sans SC`，字重 700，28px

## 布局

- 画布 1920×1080，顶栏 76px 满宽反白
- 主体 `duo` 占剩余高度，左右各 960px，内边距 0 88px
- VS 方块 132×132px，绝对定位于主体正中
- 收尾条高约 110px，左右内边距 72px，与主体之间 3px 实线分隔
- 斜纹带 20px，压在收尾条下沿

## 动画

- 顶栏自画外上方 76px 硬着陆（0.26s，power4.out）
- 眉标 / 角标错峰自上拍入（0.22s，power4.out）
- 左右两块从各自画外对向切入（0.28s，power4.out）
- 价格数字逐个自上拍入，VS 方块落定后阴影压 2 帧再弹回 8px 档
- 收尾条自下拍入，OFF 胶囊落定后阴影压 2 帧再弹回 6px 档
- 斜纹带匀速滚动 60px（3 个图案周期，1.2s，ease:none）
- 结尾定格最后一帧

## 变量

- `title` string 商品名（顶部黑条上的 900 白字）
- `eyebrow` string 眉标（黑条上的 mono 字）
- `note` string 右上角角标（限时说明）
- `wasPrice` number 划线原价（元）
- `nowPrice` number 到手价（元）
- `wasLabel` string 原价侧标签
- `nowLabel` string 到手价侧标签
- `accent` color 强调色（到手价色块 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（不由表单填写，只读显示）：`offPct` 折扣率 = `round((1 − nowPrice / wasPrice) × 100)`；`calc` 口径行由两个价格拼出。

## Avoid

- 折扣率与直降金额不许手填，必须由两个价格算出
- 不出现第二个 CTA 或第二个优惠点，一帧只放一个价格焦点
- 阴影只用 4/6/8px 三档硬偏移，X 恒等于 Y，第三值恒 0
- 圆角只用 4px 与 9999px，不出现 50% 或有机半径
- 不使用 rotate / skew 入场，不使用 opacity 淡入当入场手段