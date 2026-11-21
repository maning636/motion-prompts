# 反差点题视觉规范

## 方向

满版黄底先给一句大众预期的大字，停一拍后整块换成 ink 底，反过来的真相句才落定。适合口播里「你以为…，其实是…」的认知反转那一拍。

## Palette

- Background: `#FFD429`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，160px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，160px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标行 y=44
- 预期大字区 787px，大字 160px 居中 + 28px 提示句
- 真相区整块 ink 底 191px：强调色 mono 眉标 + 46px 真相句
- 落款行 92px，ink 底 + 纸色规则
- 最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与预期大字自上硬着陆（0.24–0.28s，power4.out）
- 1.00s 处整块换底色，1 帧硬切（模 8）
- 斜纹带同帧分 8 格推出
- 真相区自下 40px 硬压入（0.28s，power4.out）
- 真相眉标与真相句依次落位（0.22–0.26s）
- 落款行自下压入，规则从左画出（0.22–0.28s）
- 斜纹带匀速滚动 60px（1.2s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 反转句不超过 22 个字
- 先给预期、后给真相，顺序不可调换
- 换底色用 1 帧硬切，不做渐变
- 真相区整块反白，不叠半透明层

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `TWIST / 反差点题` |
| `big` | string | 观众预期的大字（一行，7–10 字） | `涨粉慢了，就是内容不行` |
| `realLab` | string | 真相区 mono 眉标 | `ACTUALLY / 真相是` |
| `realTx` | string | 反过来的真相句（一行，14–22 字） | `内容没问题，是开头三秒全在自我介绍，没人停下来` |
| `note` | string | 底部 mono 注脚 | `反转句先落地再解释 · 顺序反了就没有落差` |
| `accent` | color | 强调色（底部斜纹带） | `#FF5FA2` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
