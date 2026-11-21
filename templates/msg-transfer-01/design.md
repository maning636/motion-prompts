# 聊天转账卡视觉规范

## 方向

画面右侧是一只 3px 黑边 + 10px 硬阴影的方形手机壳，里面是微信语境的聊天窗：两条白/绿气泡一问一答，中间嵌一张强调色底的**转账卡**（黑条 + 大金额 + 收款人 + 已收款印章），聊天头右上角挂红色未读角标。左侧是观点区：mono 眉标、两行 126px 900 字重大标题（第二行压在强调色词块上）、一行副标题、三个胶囊要点标签。

和同族的「聊天逐条滴落」是同一个壳、相反的版式（手机在右、观点在左），换成电商打赏 / 知识付费的收款场景——转账卡本身就是转化件，不是气泡的附属。

## Palette

- Background: `#FFF6E5`（纸底）
- Foreground: `#0F0F0F`（描边 / 文字唯一来源）
- Accent: `#FFD429`（强调色变量，默认值；转账卡底 + 彩色词块 + 斜纹带）
- Muted: `#6B6B6B`（输入框占位字）
- Chat grey: `#EDEDED`（聊天窗底色，变量 `--wa-grey`）
- Chat green: `#95EC69`（自己发出去的气泡，变量 `--wa-green`）
- Chat red: `#FA5151`（未读角标，变量 `--wa-red`）
- Chat pink: `#FF5FA2`（对方头像方块）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

> 五个聊天 UI 色全部收进 CSS 变量。转账卡底色走 `accent`，所以「换个行业换个卡面颜色」只改一个变量。微信的绿是行业通行的聊天 UI 色，不是受商标保护的标识；本模板不复制任何官方素材（无双气泡 logo、无官方头像、无「微信」字样），全部形状纯 CSS 重绘。

## Typography

- 主标题：`Noto Sans SC`，字重 900，126px，letter-spacing 0（中文大字恒 0）
- 副标题 / 气泡正文：`Noto Sans SC`，字重 700，32px / 23px，letter-spacing 0
- 转账金额：`Sarasa Gothic SC`，字重 900，62px，`font-variant-numeric: tabular-nums`（跳数时位宽必须稳）
- 货币符号：`Sarasa Gothic SC`，字重 900，34px
- 眉标 / 时间条 / 卡上黑条 / 印章：`Sarasa Gothic SC`，字重 700–900，16–26px，letter-spacing .06–.12em
- 页脚：mono 标签 22px + sans 正文 25px 成对出现

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应，938px）→ 斜纹带 20px → 页脚 66px
- 主区左右双栏，间距 52px，左右内边距 72px
- 手机壳 466×840（高度算出来：1080 − 56 − 20 − 66 − 上下内边距 74 = 864，留 24 余量）
- 手机壳内四段：状态条 40px → 聊天头 66px（3px 下边线）→ 消息流（flex-end）→ 输入条 76px（3px 上边线）
- 转账卡 300px 宽，三段式：黑条 30px（mono 小字）→ 金额行（34px 币符 + 62px 数字）→ 收款人行（3px 上边线分隔，18px 备注 + 白底印章）
- 对方气泡 `max-width:300px`；备注 `max-width` 由 flex 决定，超出时 ellipsis
- 左侧观点区：眉标 → 两行主标题 → 副标题 → 3px 规则线 → 三个 9999px 胶囊标签

## 动画

- 通告条自上硬着陆（0.26s，power4.out），手机壳自右上斜拍入（0.28s）后阴影压 2 帧再弹回原档
- 手机壳内部三件错峰跟位：状态条 / 聊天头 / 输入条（0.20–0.22s）
- **滴落节拍 0.48s**：时间条 → 对方问 → 自己答 → 转账卡 → 收账回执，每条从左下 / 右下 26px、30px 硬着陆（0.24s）
- 转账卡落定用 `sh-m`（6px），比气泡的 `sh-s`（4px）重一档——它是场景件不是对话件
- **金额整数跳数**：`steps(14)` 在 0.7s 内跳到目标值（模 4）。金额不允许小数滚动，`steps` 跳数读起来才像「账在跳」；必须早收尾留静止尾巴，否则 settle 可能停在跳数中途
- 左侧观点区与消息并行（不排在后面）：标题 1.10s → 词块 1.34s（阴影压弹）→ 副标题 1.66s → 规则线 1.88s → 三个标签 2.02 / 2.16 / 2.30s
- 斜纹带匀速滚动 40px（0.8s，ease:none）
- **所有运动在 3.58s 前收干净**，尾部静止 hold 到 5.5s（落定期从 4.18s 开始扫）
- 演完定格最后一帧，无收尾 fade-out
- 降级分支：四条消息与角标一次性全在，金额直接写终值，只保留 ≤8px 微位移淡入，时间轴 2.3s

## Avoid

- 不复制任何微信商标素材：无双气泡 logo、无官方头像、无「微信」二字字样、无官方红包/转账图标
- 金额必须用 `tabular-nums`，跳数期间位宽不许抖动
- 未读角标是**方块**不是圆点：`border-radius:50%` 是明令禁止的第三种圆角
- 圆角只允许 `4px` 与 `9999px`
- 描边恒 3px、阴影恒 `Npx Npx 0` 且 X=Y，永不写第四个值
- 零 overshoot：不出现 `back.*` / `elastic.*` / `bounce.*`，入场一律 `power4.out`
- 不用 opacity 淡入当主入场手段
- 一次只出一条消息，不在第 0 帧把整串对话倒出来
- 不用 `rotate` / `skew`，所有元素 rotation 恒为 0
- 降级媒体查询必须同时写 `transition-property:none`（只压 duration 会让内联几何变成过渡）

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `GIFT / 打赏卡` |
| `titleA` | string | 主标题第一行（普通字） | `先给` |
| `titleB` | string | 主标题第二行（强调色块里的词） | `再讲` |
| `sub` | string | 副标题（一行短句） | `把知识做成一笔可以点一下的转账` |
| `peer` | string | 对方昵称（头像方块 + 转账收款人） | `林小满` |
| `m1` | string | 对方 · 第 1 条气泡 | `上次那批 AI 工作流真能用？` |
| `m2` | string | 自己 · 第 2 条气泡 | `能用，代码都给你了。` |
| `note` | string | 转账备注（卡上小字，6–12 字） | `请客 · 下期见` |
| `m3` | string | 自己 · 收账回执气泡 | `收到，蹲下一期。` |
| `stamp` | string | 时间条（HH:MM，mono） | `21:04` |
| `amount` | number | 转账金额（元，整数跳数） | 88 |
| `unread` | number | 未读角标数字（0–99） | 3 |
| `tag1` | string | 要点标签 1（2–6 字） | `知识付费` |
| `tag2` | string | 要点标签 2（2–6 字） | `私域转化` |
| `tag3` | string | 要点标签 3（2–6 字） | `老粉维护` |
| `accent` | color | 强调色（转账卡底 / 彩色词块 / 斜纹带） | `#FFD429` |
| `duration` | number | 总时长（秒，5–6） | 5.5 |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 音轨：无（本模板不吃音频）
- 渲染样片：`node scripts/render.mjs msg-transfer-01 templates/msg-transfer-01/presets/default.json`
- 参考样本：`同族模板目录`（三段式积木卡语法）、`同族模板目录`（同族版式对照）
