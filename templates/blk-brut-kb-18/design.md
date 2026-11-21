# 竖排氛围标题视觉规范

## 方向

左侧一列竖排中文大字，右边 3px 竖线隔开，再往右是竖排 mono 英文标签与右对齐的说明句。适合偏气质、偏片头氛围的段落，竖排把眼睛按在一条线上。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，112px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，112px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 3px 规则
- 主体 881px 高：竖排中文列 123px 宽，间距 72px
- 竖排中文 112px / 行高 1.1，高度按可用高度实测缩放（data-fit-axis=y）
- 右侧说明区：竖排英文列 31px 宽 + 36px 说明右对齐 + 胶囊标签
- 底部规则 + 22px 注脚；最底 20px -45° 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与顶部规则自左进入（0.24–0.28s，power4.out）
- 竖排区自上压入，竖排大字自 -48px 落位（0.28s，power4.out）
- 竖分隔线自上而下分 8 格画出（0.36s，steps(8)）
- 竖排英文自右上拍入（0.26s，power4.out）
- 说明句与标签依次落位（0.22–0.24s）
- 底部规则从右画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 竖排中文不超过 9 字
- 竖排件必须 align-self:flex-start，否则会被拉成整列宽
- 竖排只用 vertical-rl + upright，不用斜体
- 竖排列高按容器实测缩放，不写死字号

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `VERTICAL / 竖排氛围` |
| `title` | string | 竖排中文标题（6–9 字，自上而下） | `只做一件事的人` |
| `en` | string | 右侧竖排 mono 英文标签 | `ONE THING AT A TIME` |
| `desc` | string | 右侧说明句（一行，12–20 字） | `竖排不是装饰，是把读者的眼睛从上往下按在一条线上` |
| `tag` | string | 胶囊标签（2–6 字） | `SLOW` |
| `note` | string | 底部 mono 注脚 | `竖排 · 上到下 · 右到左起列` |
| `accent` | color | 强调色（标签 + 斜纹带） | `#FF5FA2` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
