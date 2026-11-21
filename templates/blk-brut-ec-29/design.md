# 权威背书方章视觉规范

## 方向

中央方章构图：画面正中一枚 640px 见方的近黑印章压着认证主文与报告编号，印文分四层由两条 3px 实线分隔，下方一排三枚小徽章收尾。适合检测报告、认证资质这类第三方背书的呈示帧。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#3D7BFF`（印章主文 / 徽章色块 / 斜纹带）
- Seal: `#0F0F0F` 底 + accent 字 + 10px accent 硬阴影
- Badge: `#FFFFFF` 底 + 6px 黑色硬阴影
- Muted: `#6B6B6B`（眉标）

## Typography

- 主标题：`Noto Sans SC`，字重 900，64px
- 印章主文：`Noto Sans SC`，字重 900，88px
- 印章顶字：`Sarasa Gothic SC`，字重 700，26px，letter-spacing .16em
- 报告编号：`Sarasa Gothic SC`，字重 700，30px，letter-spacing .12em
- 徽章正文：`Noto Sans SC`，字重 900，34px

## 布局

- 画布 1920×1080，顶部纸底标题行（下沿 3px 实线），底部斜纹带 20px
- 中央印章区 padding 36/72/36，印章 620×620px 居中
- 印章内五段：顶字 / 3px 分隔 / 主文 / 3px 分隔 / 编号 / 机构
- 徽章排 padding 0/72/30，三枚等宽，徽章间距 26px
- 每枚徽章含 28px 色点 + 900 字正文

## 动画

- 标题行落下，眉标与主标题错峰补位
- 模 1 拍进来：印章自左上斜向砸入（0.3s，power4.out），落定后阴影压 2 帧再弹回 10px 档
- 印文四层依次自上补位
- 三枚小徽章自下错峰落位（每枚 0.11s）
- 口径说明与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（顶部纸底行上的 mono 字）
- `title` string 主标题（中文大字，一行）
- `stampTop` string 印章顶部小字
- `stampMain` string 印章主标题
- `stampNo` string 报告编号（mono）
- `stampOrg` string 出具机构
- `b1` string 第一枚徽章
- `b2` string 第二枚徽章
- `b3` string 第三枚徽章
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（印章底 / 徽章 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

## Avoid

- 印章固定正方 620px + 4px 直角，不做圆形、不做撕边 clip-path、不做旋转
- 印章内两条分隔线都用 3px 强调色实线，不做渐变
- 三枚徽章数量固定，不随变量增减
- 背书文案必须给出可核查的编号，不许写「权威认证」这类无判定标准的话
- 不用 rotate / skew 入场，不用 opacity 淡入当入场手段