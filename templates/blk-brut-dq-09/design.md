# 评论区引用视觉规范

## 方向

一条白底评论条（方块头像 + 昵称 + 时间 + 内容 + 点赞胶囊 + 作者回复），右侧一块 ink 底作者回复卡。适合把观众的真实反馈摆到画面上当论据。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，46px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 3px 规则 + 右上 ink 计数方块
- 主体 858px 高：左评论条自适应 + 右回复卡 320px
- 评论条：72px 头像 + 32px 昵称 + 22px 时间 + 46px 内容（遮罩揭示）
- 底部：点赞胶囊 + 回复胶囊 + 右对齐 mono 标签
- 底部规则 + 22px 注脚；最底 20px -45° 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标、顶部规则与计数方块依次进入（0.24s，power4.out）
- 评论条 0.86→1 缩放（0.3s，power3.out）
- 头像 0.86→1 缩放并压阴影（0.24s，power3.out）
- 昵称与时间自相反方向进入（0.22s，power4.out）
- 评论内容竖向遮罩揭示（0.5s，power4.out）
- 两枚胶囊与标签依次落位并压阴影（0.24s，power4.out）
- 右侧回复卡自右 40px 拍入（0.28s，power4.out）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 评论内容必须已获授权展示
- 不使用 opacity 做「次要评论」的淡化
- 头像只用 4px 圆角方块
- 评论正文不超过 34 个字

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `COMMENT / 评论区` |
| `name` | string | 评论者昵称（中文 / 英文，2–10 字） | `镜头前的leman` |
| `time` | string | 评论时间（mono） | `2 小时前 · 来自 iPhone` |
| `text` | string | 评论正文（18–34 字） | `看了 12 期才发现我一直是在给句子配画面，顺序反了` |
| `likes` | string | 点赞数（mono） | `2.4k` |
| `reply` | string | 作者回复（12–24 字） | `这条我会单独做一期讲顺序问题` |
| `tag1` | string | 底部标签 1（mono） | `TOP COMMENT` |
| `note` | string | 底部 mono 注脚 | `已获授权展示 · 内容未做删改` |
| `accent` | color | 强调色（点赞胶囊 + 斜纹带） | `#FF5FA2` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
