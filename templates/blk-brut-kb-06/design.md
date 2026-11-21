# 逐行揭示段落视觉规范

## 方向

ink 满版底，左侧一枚 220×220 强调色序号方块，右侧三行正文用遮罩揭示逐行落定。适合一段完整论述的口播中段，把抽象结论拆成三句能带走的短句。

## Palette

- Background: `#0F0F0F`
- Foreground: `#FFFFFF`
- Accent: `#FFD429`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，112px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，112px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 56px 段落主题，单行 nowrap
- 主体左 220px 序号方块，右侧正文区 1468px 宽
- 正文三行 40px / 行高 1.34，行间 16px
- 底部 20px 纸色斜纹带 + 纸色反白脚注条 85px
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 底部斜纹带分 8 格从左推出（0.34s，steps(8)）
- 眉标与主题自上硬着陆（0.22–0.26s，power4.out）
- 序号方块自左上斜撞入（0.26s，power4.out）
- 三行正文遮罩自 112% 落到 0，逐行错峰 0.16s（0.5s，power4.out）
- 序号方块阴影档位脉冲一次（0.12s，steps(2)）
- 脚注条自下方压入（0.26s，power4.out）
- 斜纹带匀速滚动 60px（1.3s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 正文每行不超过 24 个汉字
- 遮罩揭示只用 translateY，不用 blur
- 深底上的描边与斜纹一律换成 paper 色
- 序号方块不改色不改圆角

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `BODY / 段落揭示` |
| `title` | string | 段落主题（一行，12–18 字） | `一条视频能不能留人，看前三秒讲没讲明白` |
| `no` | string | 左侧段落序号（mono，两到三位） | `01` |
| `p1` | string | 正文第 1 行 | `先说结论，再说过程，这是口播最省时间的顺序` |
| `p2` | string | 正文第 2 行 | `观众没耐心等你铺垫，他只等一个能带走的结论` |
| `p3` | string | 正文第 3 行 | `铺垫不是不能有，是要压到一句话之内` |
| `accent` | color | 强调色（序号 + 斜纹带） | `#FFD429` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
