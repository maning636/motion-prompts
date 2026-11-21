# 话题标签条视觉规范

## 方向

话题条的作用是让观众在看完之后知道该去哪搜。所以做成一条 ink 长轨，标签全部压在轨里，首个标签用强调色当视觉锚，轨头上方再挂一枚方块说明这是一组标签。

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

- 轨头方块 left 96 / bottom 352，224×120，强调色底 + 3px 黑边
- ink 长轨 left 96 / bottom 200，1728×128，圆角 4px
- 轨内三枚 pill 标签，pill 圆角 9999px，首枚用强调色底
- 轨内左右内边距 30px，标签间距 24px
- 标签文字 mono 700 36px，轨头文字 mono 900 38px
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 轨头方块自左上斜向硬着陆（0.26s，power4.out），压 2 帧阴影
- 长轨自左分八格擦出（0.34s，steps(8)）
- 三枚标签错峰自左装上（0.20s，power4.out），错峰 0.10s
- 轨头文字错峰自左装上（0.20s，power4.out）
- 轨头上抬、长轨下压两层反向匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 三枚标签的几何必须随文字自适应，不写死等宽
- pill 是 9999px 圆角，全文件唯一允许的非直角
- 轨头方块的形状不随字号变：正方感色块 + 3px 黑边 + 4px 直角
- 标签压 ink 轨上时自带 3px 黑边，不靠底色差读出来
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `kind` | string | 轨头上方方块里的 mono 字（2–6 字） | `TAGS` |
| `t1` | string | 话题一（2–6 字） | `#AI效率` |
| `t2` | string | 话题二（2–6 字） | `#内容方法` |
| `t3` | string | 话题三（2–6 字） | `#一人公司` |
| `accent` | color | 强调色（方块底 / 第二个话题） | `#FFD429` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
