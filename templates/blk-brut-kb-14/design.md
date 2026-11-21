# 打字机视觉规范

## 方向

ink 满版底里放一块白底终端卡，句子被 JS 切成单字后用 steps(1) 逐字跳出，末尾光标块有限次闪烁。适合展示一段正在被敲出来的口播稿、脚本或提示词。

## Palette

- Background: `#0F0F0F`
- Foreground: `#FFFFFF`
- Accent: `#2FD07A`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #2FD07A 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，56px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + UTF-8 胶囊；终端卡占 912px 高
- 终端卡白底 1744px 宽，内边距 48/56px；标题栏三枚 22px 圆点
- 正文 56px / 行高 1.34，右侧挂 20×52px 强调色光标块
- 输出行区 26px mono / 行高 1.7，两行，顶部 3px 实线
- 底部规则 + 22px 注脚
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标、终端卡、标题栏依次硬着陆（0.22–0.28s，power4.out）
- 正文逐字 steps(1) 出现，0.055s 错峰（每字 0.05s）
- 光标闪烁 6 次后常亮（0.08s，ease:none，repeat 5 + yoyo）
- 两行输出 steps(3) 逐格回显（0.24s）
- 底部规则从左画出（0.28s，power4.out）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 中文正文用 sans，不用 mono（基因 9）
- 打字机步进只能用 tl.fromTo + steps(1)，不引额外库
- 光标闪烁必须是有限段，绝不写 repeat:-1
- 终端卡内不出现超过两行的中文

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `TYPING / 打字机` |
| `text` | string | 逐字打出的中文句子（18–30 字） | `先写完这句话，再决定要不要配图。` |
| `l1` | string | 卡内下方 mono 输出行 1（提示符由模板补，变量里不要写大于号） | `画面为句子服务，不是反过来` |
| `l2` | string | 卡内下方 mono 输出行 2（提示符由模板补，变量里不要写大于号） | `一条片子里只留一个视觉重心` |
| `note` | string | 底部 mono 注脚 | `整段揭示总时长封顶 800ms` |
| `accent` | color | 强调色（光标 + 眉标） | `#2FD07A` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
