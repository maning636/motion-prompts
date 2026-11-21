# 结尾关注引导卡视觉规范

## 方向

左边两行 118px 大字加三枚动作胶囊，右边一张 380×380 的二维码位（纯 div 拼的方格）。适合一条口播结束时的关注 / 收藏 / 点赞引导。

## Palette

- Background: `#FFF6E5`
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

- 顶部眉标 + 3px 规则
- 主体 871px 高，左文右码，间距 72px
- 文字区 1292px 宽，两行 118px / 行高 1.16 + 38px 内边距的三枚胶囊
- 二维码位 380×380，白底 3px 黑边 + sh-l，内含 7×7 方格
- 底部规则 + 22px 注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与顶部规则自左进入（0.24–0.28s，power4.out）
- 两行大字自左上斜撞入（0.26s，power4.out）
- 三枚胶囊逐枚自左上拍入（0.24s，power4.out）
- 二维码位自右 40px 拍入并分 8 格从右推出（0.36s，steps(8)）
- 账号行自上进入（0.22s，power4.out）
- 底部规则从右画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 二维码方格由行列坐标算出，绝不用 Math.random
- 动作胶囊最多三枚
- 一排贴纸里不放裸字符重音
- 二维码位必须留出替换说明

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `FOLLOW / 关注引导` |
| `t1` | string | 大字第一行（5–9 字） | `觉得有用，` |
| `t2` | string | 大字第二行（5–9 字） | `就顺手关注一下` |
| `act1` | string | 动作胶囊 1（2–4 字） | `点赞` |
| `act2` | string | 动作胶囊 2 | `收藏` |
| `act3` | string | 动作胶囊 3 | `关注` |
| `handle` | string | 账号名（mono） | `@积木社BLOCKBRUT` |
| `note` | string | 底部 mono 注脚 | `每周二更新 · 不发广告` |
| `accent` | color | 强调色（动作胶囊 + 斜纹带） | `#2FD07A` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
