# 专家观点卡视觉规范

## 方向

一张白底卡：顶部 ink 职务条，右侧姓名，左侧 120×120 头像方块，主区两行观点，底部标签与机构。适合请第三方在口播里给一句可引用的判断。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
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

- 顶部眉标 + 3px 规则
- 卡片 1744px 宽，sh-l；顶部 ink 职务条高 88px
- 主区左右分栏：左侧 120px 头像方块，右侧两行 56px 观点
- 底部一行：两枚胶囊标签 + 右对齐 22px mono 机构名
- 底部规则 + 22px 注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与顶部规则自左进入（0.24–0.28s，power4.out）
- 卡片 0.86→1 缩放（0.3s，power3.out）
- 职务条、职务、姓名依次落位（0.22–0.26s）
- 头像 0.86→1 缩放并压阴影（0.26s，power3.out）
- 两行观点自左上错峰进入（0.24s，power4.out）
- 底部两枚标签与机构名依次落位（0.22–0.24s）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 观点必须注明是原话摘录
- 职务条用 mono，人名用 sans
- 头像只用单字方块，不放照片
- 标签最多两枚

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `EXPERT / 专家观点` |
| `who` | string | 姓名（2–4 字） | `周思远` |
| `role` | string | 职务（ink 头条里的 mono 行） | `CONTENT STRATEGY · 前电视台编导` |
| `org` | string | 机构（底部 mono） | `叙事实验室` |
| `q1` | string | 观点第一行（12–18 字） | `观众不奖励复杂，他们奖励被说清楚` |
| `q2` | string | 观点第二行（12–18 字） | `把复杂留给制作者，把简单留给前 3 秒` |
| `t1` | string | 底部标签 1（mono） | `NARRATIVE` |
| `t2` | string | 底部标签 2（mono） | `CLARITY` |
| `note` | string | 底部 mono 注脚 | `观点为受访者原话摘录 · 经本人确认` |
| `accent` | color | 强调色（头像块 + 斜纹带） | `#2FD07A` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
