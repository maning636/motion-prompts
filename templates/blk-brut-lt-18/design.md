# 时间条视觉规范

## 方向

时间条的秒数是这个族里少数「必须动」的信息，所以把它单独压在高饱和块上硬跳；时分只负责定位，时区方块与日期条负责消除歧义。适合直播常驻时钟、限时活动倒计时的辅助读数。

## Palette

- Background: `transparent`（透明底贴片，默认导出带透明通道；`--paper` 全程不出现）
- Foreground: `#0F0F0F`（描边 / 中文正文 / 深色块上的文字）
- Accent: `#FFD429`（强调色，JS 走 `setProperty('--accent', v.accent)`）
- Muted: `#6B6B6B`（只用于小字号次级信息，不做描边、不做色块）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽，描边恒 ink 永不翻白）
- Shadow: `#FFFFFF`（透明底默认切白，走 §7.2 规则 A 的 `--shadow` 变量）

## Typography

- 中文大字 / 数值：`Noto Sans SC`，字重 900，字号比标签 ≥1.6×，letter-spacing 0（中文不收紧）
- 数字 / 编号 / 英文 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .06–.18em
- 次级说明：`Noto Sans SC` 或 `--mono`，字重 700，20–30px，letter-spacing 0–.06em

## 布局

- 时区方块 right 540 / top 96，200×200，黄色底 + 3px 黑边
- 时钟块 right 96 / top 96，420×200，ink 底白字，阴影走白
- 时钟块内两段：104px mono 时分 + 强调色秒数块（84×56）
- 日期条 right 96 / top 320，420×100，白底 + 3px 黑边
- 秒数用 mono + tabular-nums，两位补零
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 时钟块与时区方块自右上斜向硬着陆（0.26s，power4.out），错峰 0.12s，各压 2 帧阴影
- 秒数 steps(12) 整数硬跳到设定值，展示窗口写死 1.6s
- 日期条自右分六格擦出（0.30s，steps(6)），文字错峰装上
- 时分自左 24px 装上（0.20s，power4.out）
- 三层错峰做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 秒数只决定显示到哪一格，绝不用秒数推算时间轴长度
- 秒数恒两位补零，位宽稳定不抖
- ink 底上的件阴影走白
- onUpdate 里只写 textContent，不做任何 DOM 测量
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `hm` | string | 时:分（5 个字符，如 20:00） | `20:00` |
| `sec` | number | 秒（0–59，决定秒针跳到哪里） | `48` |
| `tz` | string | 时区标记（2–6 字） | `UTC+8` |
| `date` | string | 日期行（6–14 字） | `10 月 13 日 周一` |
| `accent` | color | 强调色（时区方块 / 秒数） | `#FFD429` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
