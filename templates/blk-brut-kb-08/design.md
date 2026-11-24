# 标题换词视觉规范

## 方向

满版黄底，同一个版位先放 A 词，停一拍后 1 帧硬切成 B 词，不做交叉淡入。适合观点反转、口播里的「不是 A，是 B」这一拍。

## Palette

- Background: `#FFD429`
- Foreground: `#0F0F0F`
- Accent: `#2FD07A`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #2FD07A 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，118px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，118px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部左右各一枚 mono 胶囊标签，间距靠 justify-content:space-between
- 换词区占满剩余高度并垂直居中
- 两行 118px / 行高 1.16，A 词与 B 词各压一枚 4px 圆角色块
- 色块比文字左右各外扩 14px，底距 -6px
- 底部规则 + 22px mono 注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 底部斜纹带分 8 格推出（0.34s，steps(8)）
- 左右胶囊斜向拍入并压阴影（0.24s，power4.out）
- 两行大字自左上斜撞入（0.26s，power4.out）
- A 词色块 0.86→1 缩放（0.26s，power3.out）
- 1.66s 处 A/B 两词 1 帧硬切，B 词同步缩放（0.26s，power3.out）
- 底部规则从右画出（0.26s，power4.out）
- 斜纹带匀速滚动 60px（1.2s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 换词只用 1 帧硬切，不做交叉淡入
- 换词前后的句式长度尽量接近，避免版心跳动
- A/B 两词字数控制在 2–5 字
- 黄底上不放绿色文字

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `sideL` | string | 左侧胶囊标签（mono + 中文） | `SWAP / 换词` |
| `title` | string | 主标题前半（会自动接上 A 词，不要把 A 词写进来） | `与其把内容做得` |
| `wordA` | string | 先出现的词（2–5 字） | `更多` |
| `title2` | string | 换词之后的后半句（会自动接上 B 词） | `不如把一条` |
| `wordB` | string | 换上去的词（2–5 字，比 A 词更重） | `讲透` |
| `note` | string | 底部 mono 注脚 | `硬切换 · 不做交叉淡入` |
| `accent` | color | 强调色（侧标 + 斜纹带） | `#2FD07A` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
