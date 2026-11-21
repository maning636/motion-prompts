# 聊天逐条滴落视觉规范

## 方向

画面左侧是一只 3px 黑边 + 10px 硬阴影的方形手机壳，里面是微信语境下的聊天窗；五条消息按固定节拍从底部逐条硬着陆落进来，对方是白气泡、自己是绿气泡，灰色时间条只打在第一条上方。右侧是观点区：mono 眉标、112px 900 字重大标题、一行副标题、三个胶囊要点标签。

适合短视频开场钩子——观众先看「别人在聊什么」，产生代入之后再听你的结论。聊天记录本身就是叙事引擎，比直接抛结论的完播率高。

## Palette

- Background: `#FFF6E5`（纸底）
- Foreground: `#0F0F0F`（描边 / 文字唯一来源）
- Accent: `#FF5FA2`（强调色变量，默认值；标签块与斜纹带）
- Muted: `#6B6B6B`（输入框占位字）
- Chat grey: `#EDEDED`（聊天窗底色，变量 `--wa-grey`）
- Chat green: `#95EC69`（自己发出去的气泡，变量 `--wa-green`）
- Chat red: `#FA5151`（未读角标，变量 `--wa-red`）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

> 三个聊天 UI 色全部收进 CSS 变量，不写死。微信的绿是行业通行的聊天 UI 色，不是受商标保护的标识；本模板不复制任何官方素材（无双气泡 logo、无官方头像、无「微信」字样），全部形状纯 CSS 重绘。换成 QQ 蓝或微博橙只改 `--wa-green` 一个值。

## Typography

- 主标题：`Noto Sans SC`，字重 900，112px，letter-spacing 0（中文大字恒 0，收紧会粘连）
- 副标题 / 气泡正文：`Noto Sans SC`，字重 700，32px / 23px，letter-spacing 0
- 眉标 / 时间条 / 输入栏标签：`Sarasa Gothic SC`，字重 700，16–26px，letter-spacing .06–.14em
- 头像方块：`Noto Sans SC`，字重 900，22px
- 页脚：`Sarasa Gothic SC`（mono 标签 22px）+ `Noto Sans SC`（正文 25px）成对出现

## 布局

- 画布 1920×1080，`#stage` 锁定尺寸并 `overflow:hidden`
- 纵向四段：通告条 56px → 主区（自适应，938px）→ 斜纹带 20px → 页脚 66px
- 主区左右双栏，间距 52px，左右内边距 72px
- 手机壳 466×840（高度是算出来的：1080 − 56 − 20 − 66 − 上下内边距 74 = 864，留 24 余量）
- 手机壳内四段：状态条 40px → 聊天头 66px（3px 下边线分隔）→ 消息流（flex-end，气泡从底部往上长）→ 输入条 76px（3px 上边线分隔）
- 头像 46×46 方块；气泡 `max-width:300px`，内边距 11px 14px
- 右侧观点区：眉标 32px 行高 → 112px 主标题 → 32px 副标题 → 3px 规则线 → 三个 9999px 胶囊标签
- 安全边距贴边元素从 72px 起步，不贴 0

## 动画

- 通告条自上硬着陆（0.26s，power4.out），手机壳自左上斜拍入（0.28s）后阴影压 2 帧再弹回原档
- 手机壳内部三件错峰跟位：状态条 / 聊天头 / 输入条（0.20–0.22s，power4.out）
- **消息滴落节拍恒定 0.52s**：五条消息依次从左下 / 右下 26px、30px 硬着陆（0.24s），落定瞬间气泡阴影压 2 帧（`steps(2)`）再弹回
- 时间条在第一条之前 0.18s 从下 16px 切入
- 右侧观点区与聊天流**并行**推进（不排在后面）：前两条消息落定后才开始出标题，标题 1.20s → 副标题 1.52s → 规则线 1.74s（scaleX 从左画出）→ 三个标签 1.88 / 2.02 / 2.16s
- 斜纹带匀速滚动 40px（0.8s，ease:none），位移是 20px 图案周期的整数倍
- **所有运动在 3.44s 前收干净**，尾部静止 hold 到 5.5s——motion-qc 的落定期从 76% × 总时长（4.18s）开始扫，还有元素在半路上会被判出框
- 演完定格最后一帧，无收尾 fade-out
- 降级分支：五条消息一次性全在，只保留 ≤8px 微位移淡入，时间轴 2.3s

## Avoid

- 不复制任何微信商标素材：无双气泡 logo、无官方头像、无「微信」二字字样
- 气泡尾巴用 clip-path / border 三角切角，**不用 `border-radius:50%`**——圆角只有 4px 与 9999px 两档
- 圆角只允许 `4px` 与 `9999px`
- 描边恒 3px、阴影恒 `Npx Npx 0` 且 X=Y，永不写第四个值
- 零 overshoot：不出现 `back.*` / `elastic.*` / `bounce.*`，入场一律 `power4.out`
- 不用 opacity 淡入当主入场手段
- 时间条只打在时间块的第一条上方，不是每条都打
- 一次只出一条消息，不在第 0 帧把整串对话倒出来
- 不用 `rotate` / `skew`，所有元素 rotation 恒为 0
- 降级媒体查询必须同时写 `transition-property:none`（只压 duration 会让内联几何变成过渡，见 aud 族实测）

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `CHAT / 聊天体` |
| `title` | string | 主标题（大字，最多两行） | `评论区比正文更值钱` |
| `sub` | string | 副标题（一行短句） | `把开场做成聊天记录，观众先看戏，再听观点` |
| `peer` | string | 对方昵称（白气泡说话的人） | `林小满` |
| `m1` | string | 对方 · 第 1 条气泡 | `发了 30 条，一条爆款都没有？` |
| `m2` | string | 自己 · 第 2 条气泡 | `问题不在正文，在封面。` |
| `m3` | string | 对方 · 第 3 条气泡 | `封面还能做文章？` |
| `m4` | string | 自己 · 第 4 条气泡 | `把封面做成聊天截图。` |
| `m5` | string | 对方 · 第 5 条气泡 | `评论区已经全是问链接了` |
| `stamp` | string | 时间条（HH:MM，mono） | `20:26` |
| `tag1` | string | 要点标签 1（2–6 字） | `爆款开头` |
| `tag2` | string | 要点标签 2（2–6 字） | `评论区引导` |
| `tag3` | string | 要点标签 3（2–6 字） | `私信转化` |
| `accent` | color | 强调色（标签块 / 斜纹带） | `#FF5FA2` |
| `duration` | number | 总时长（秒，5–6） | 5.5 |
| `exportMode` | enum | Format | `mp4` |

## 配套

- 音轨：无（本模板不吃音频）
- 渲染样片：`node scripts/render.mjs msg-drip-01 templates/msg-drip-01/presets/default.json`（或第 1 批的 `render_blkbrut_batch.py` 同款 `--format webm`；本件是实底件，不受 alpha 捕获影响）
- 参考样本：`同族模板目录`（透明贴片族的四件积木叠法）、`离线包络脚本（未随仓分发）`（本表由脚本从 HTML 声明生成）
