# 口播字幕条视觉规范

## 方向

把口播里最该被记住的那一句原样压在画面下方，左端一道高饱和竖条当视觉锚点，右下角再挂一枚字幕标记说明这条字幕属于哪一类。适合知识口播、资讯解读、课程录屏的下三分之一字幕。

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

- 字幕卡绝对定位 left 220 / right 420 / bottom 168，画布 1920×1080
- 卡宽 1280px，由左端 22px 强调色竖条 + 白底内容区两段构成
- 内容区左右内边距 44px，上下 26/30px
- mono 眉标 22px 在上，中文 900 大字 62px 在下，行距 1.16
- 字幕标记 ink 底黄字，右端贴 120px 安全区，底边与字幕卡对齐
- 四档硬阴影只挂 sh-l 一档，X 恒等于 Y，第三值恒 0
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 字幕卡自下方 44px 硬着陆（0.26s，power4.out），落定瞬间阴影压 2 帧再弹回（steps(2)）
- 竖条 / 眉标 / 大字错峰自左装上（0.18–0.30s，power4.out），纯位移，opacity 恒为 1
- 字幕标记自右 48px 拍入，落定瞬间阴影压 2 帧再弹回
- 竖条与标记各走一段匀速往返位移（ease:none，起步时间错开半拍）
- 时长 5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 中文大字 letter-spacing 恒 0，靠 data-fit 收口不靠负字距
- 字幕卡内的字不许换行，长句一律靠 data-fit 缩
- 不用 opacity 淡入当入场手段
- 不碰 scale，位移入场零过冲
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `note` | string | 左端 mono 标签（2–8 字） | `KEY POINT` |
| `text` | string | 字幕文案（口播原句，10–20 字，单行） | `真正拉开差距的，是能不能把话说明白` |
| `tag` | string | 右下角 mono 标记（2–8 字） | `CC` |
| `accent` | color | 强调色（左端竖条） | `#FFD429` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
