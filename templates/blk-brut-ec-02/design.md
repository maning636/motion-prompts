# 到手价大字牌视觉规范

## 方向

中央纵向构图：顶部一条纸底眉标行，中部一整块强调色价格牌压着巨型到手价数字，底部一条反白口径条收尾。适合带货视频里把「今天到底多少钱」做成整屏唯一焦点的一帧。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`（价格牌底 / 斜纹带）
- Ink bar: `#0F0F0F`（底部口径条整块反白）
- Muted: `#6B6B6B`（编号 chip 与斜纹带之外的小字）

## Typography

- 主标题：`Noto Sans SC`，字重 900，96px
- 价格数字：`Sarasa Gothic SC`，字重 900，280px，tabular-nums
- 货币符号 / 单位：`Sarasa Gothic SC`，字重 900 96px / 700 44px
- 眉标：`Sarasa Gothic SC`，字重 700，26px，letter-spacing .14em

## 布局

- 画布 1920×1080，顶部眉标行约 118px，上下各带 3px 实线
- 主体 `hero` 占剩余高度，纵向居中，标题与价格牌间距 40px
- 价格牌最大宽 1744px（1920 − 2×88），内边距 34/96/40
- 底部口径条高约 92px，与主体间 3px 实线
- 斜纹带 20px 压在最下沿

## 动画

- 眉标行自上落下（0.24s，power4.out）
- 主标题自左上拍入（0.26s，power4.out）
- 价格牌以 scale .86 → 1 弹入（0.3s，power3.out，面积单调涨到末帧）
- 价格数字自下补位（0.28s，power4.out），落定后阴影压 2 帧再弹回 10px 档
- 对照胶囊、口径条、斜纹带依次错峰落位
- 斜纹带匀速滚动 60px（1.2s，ease:none）
- 结尾定格最后一帧

## 变量

- `title` string 主标题（中文大字，一行）
- `eyebrow` string 眉标（mono + 大字距）
- `badge` string 右上角胶囊角标
- `price` number 到手价（元）
- `unit` string 计价单位（件 / 双 / 套）
- `note` string 底部口径说明（一行 mono）
- `wasLabel` string 对照标签（价格牌下方的小标签）
- `accent` color 强调色（价格牌底 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 一帧只放一个价格焦点，不出现第二个 CTA
- 阴影只用 8px / 10px 两档硬偏移，X 恒等于 Y，第三值恒 0
- 圆角只用 4px 与 9999px
- 不使用 rotate / skew 入场，不使用 opacity 淡入当入场手段
- 不用 back.out / elastic / bounce，起始缩放一律 ≤0.86