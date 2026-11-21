# 双数据对比卡视觉规范

## 方向

左右两张数据卡各做一次整数跳数，中间一枚 ink 底方块放对比符，两侧数字错开一拍停稳。适合「改造前 / 改造后」这类两段数据摆在一起讲。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#2FD07A`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #2FD07A 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，150px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，150px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 3px 规则
- 主体 871px 高：左卡 715px + 方块 130px + 右卡 715px
- 每卡：24px mono 标签 + 150px 数字 + 40px 单位 + 30px 说明
- 左卡白底、右卡强调色底，两卡共享一条 3px 边
- 底部规则 + 22px 口径注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与顶部规则自左进入（0.24–0.28s，power4.out）
- 左右两卡自相反方向各 48px 撞入（0.28s，power4.out）
- 中间方块 0.86→1 缩放（0.24s，power3.out）
- 左卡数字 steps(12) 跳数（1.0s），右卡错开 0.10s 跳 steps(14)（1.1s）
- 两卡阴影各档位脉冲一次（0.12s，steps(2)）
- 底部规则从右画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（0.8s，ease:none）
- 时长 6 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 两侧必须同口径同单位
- 两个数字错开停稳，不同时到达
- 卡片一色一变，不做半透明
- 对比符只用一个字符

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `BEFORE AFTER / 双数据` |
| `leftLab` | string | 左侧标签（mono + 中文） | `BEFORE / 改造前` |
| `leftNum` | number | 左侧数字（mono 整数跳变） | `21` |
| `leftUnit` | string | 左侧单位 | `条` |
| `leftSub` | string | 左侧说明（中文） | `月更，攒到发不动为止` |
| `rightLab` | string | 右侧标签 | `AFTER / 改造后` |
| `rightNum` | number | 右侧数字（mono 整数跳变） | `21` |
| `rightUnit` | string | 右侧单位 | `条` |
| `rightSub` | string | 右侧说明（中文） | `每周两条，把选题拆成了固定节拍` |
| `vs` | string | 中间方块字符（1 字） | `→` |
| `note` | string | 底部 mono 注脚（口径） | `口径：连续 12 周 · 同平台同账号 · 未投放` |
| `accent` | color | 右侧数据卡底 + 斜纹带 | `#2FD07A` |
| `duration` | number | 总时长（秒，5–8） | `6` |
| `exportMode` | enum | Format | `mp4` |
