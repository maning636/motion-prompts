# 下期预告卡视觉规范

## 方向

满版粉底，中间一张白底预告卡：左侧 200×200 的 NEXT 方块，右侧两行 104px 预告标题、看点句与日期胶囊。适合一条口播结尾的下期预告。

## Palette

- Background: `#FF5FA2`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，104px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，104px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 3px 规则
- 预告卡 1744px 宽，sh-xl；左侧 NEXT 方块 200×200（ink 底 + 强调色字 + 强调色阴影）
- 右侧两行 104px / 行高 1.14，看点句 32px，日期胶囊 26px
- 底部两枚标签 + 右对齐 22px 注脚；最底 20px -45° 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与顶部规则自左进入（0.24–0.28s，power4.out）
- 预告卡 0.86→1 缩放（0.3s，power3.out）
- NEXT 方块 0.86→1 缩放并压阴影（0.26s，power3.out）
- 两行标题自左上斜撞入（0.28s，power4.out）
- 看点句与日期胶囊依次落位，胶囊阴影压弹（0.08s，steps(2)）
- 底部两枚标签与注脚依次落位（0.22–0.24s）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 预告标题不超过两行
- 满版底只用 yellow 和 pink
- NEXT 方块不改色不改圆角
- 日期胶囊用 mono

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `NEXT EP. / 下期预告` |
| `t1` | string | 预告标题第一行（8–12 字） | `下一期我们把` |
| `t2` | string | 预告标题第二行（8–12 字） | `镜头顺序拆开讲` |
| `date` | string | 更新日期（mono） | `2026.10.20 周二 20:00` |
| `hook` | string | 看点句（一行，16–24 字） | `带上你那条改到第八版的片子，我们一起对着看` |
| `tag1` | string | 底部标签 1（mono） | `EP.013` |
| `tag2` | string | 底部标签 2（mono） | `直播连麦` |
| `note` | string | 底部 mono 注脚 | `关注后可提前一天收到提醒` |
| `accent` | color | 强调色（NEXT 方块 + 斜纹带） | `#FFD429` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
