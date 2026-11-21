# 大字压屏金句视觉规范

## 方向

两行 168px 大字压满版心，第二行的收尾词压在强调色方块里，右侧另有一枚 176×176 实心方块当重音。适合一条片子里唯一那句要被截图转发的话。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，168px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，168px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 3px 规则 + 右上 mono 编号胶囊
- 版心区高 902px，标题区 1488px 宽，右侧留 48px 间距给方块
- 两行 168px / 行高 1.1；彩块词内嵌 26px 左右内边距
- 右侧方块 176×176，3px 黑边 + sh-l
- 底部 3px 规则 + 30px 署名；最底 20px -45° 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与编号斜向拍入并压阴影（0.24s，power4.out）
- 顶部规则从左画出（0.3s，power4.out）
- 两行大字自左上斜撞入，错峰 0.16s（0.28s，power4.out）
- 彩块词与右侧方块 0.86→1 缩放（0.26s，power3.out）
- 两块阴影压 2 帧再弹回（0.08s，steps(2)）
- 署名自下进入，底部规则从右画出（0.22–0.3s）
- 斜纹带分 8 格推出后匀速滚动 60px（1.2s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 彩块词不超过 4 个字
- 一帧只压一个彩块
- 大字不跨三行
- 右侧方块不做旋转

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `QUOTE / 金句` |
| `no` | string | 右上角 mono 编号 | `Nº07` |
| `q1` | string | 金句第一行（8–10 字） | `所有工具都在变快` |
| `q2` | string | 金句第二行前半（会自动接住彩块词） | `只有你的判断` |
| `kw` | string | 压在彩块里的词（2–4 字） | `变慢` |
| `byline` | string | 底部署名行 | `讲稿第 41 页 · 这一句我改了三遍` |
| `accent` | color | 彩块色 + 右侧方块 | `#FF5FA2` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
