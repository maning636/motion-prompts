# 章节角标视觉规范

## 方向

章节角的职责只有一件事：让观众知道「现在进入第几部分」。所以左边一枚超大序号方块做主视觉，右边一条 ink 章节条给名字，底下再压一道匀速滚动的斜纹导轨把画面收口。

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

- 序号方块 left 96 / top 96，248×248，强调色底 + 3px 黑边
- 章节条 left 376 / top 96，1104×248，ink 底白字
- 章节条内两段：24px mono 眉标（yellow）+ 76px 900 章节名（white）
- 斜纹导轨 left 376 / top 360，1104×20，3px 黑边
- 导轨砖带 16 格 × 80px，平移一格 = 4 个图案周期
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 序号方块自上方 64px 硬砸落（0.26s，power4.out），压 2 帧阴影
- 章节条自左分六格擦出（0.34s，steps(6)），压 2 帧阴影
- 眉标与章节名错峰自左装上（0.20–0.34s，power4.out）
- 斜纹导轨分 7 圈匀速滚动 80px（ease:none，圈数按窗口算）
- 方块与章节条反向做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 斜纹是全系列唯一合法渐变，图案周期 10px + 10px，平移量必须是周期的整数倍
- 砖带格数要让窗口内容比视窗宽出一整格，否则循环点露缝
- repeat 必须是有限值，repeat:-1 会把时长撑爆导致 settle 取帧失效
- 序号用 mono，不换字体
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | ink 条上的 mono 眉标（4–10 字） | `CHAPTER / 章节` |
| `num` | string | 章节序号（2 位，如 03） | `03` |
| `title` | string | 章节名（4–12 字，单行） | `先把标准定下来` |
| `accent` | color | 强调色（序号方块 / 斜纹带） | `#FFD429` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
