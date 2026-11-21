# 双人对话条视觉规范

## 方向

把「谁在说」做成画面结构而不是口播交代：上下两行永远同宽同高，当前发言人那一行整块换底色，右端再挂一枚裸字符的发言中标记。适合双人访谈、对谈类栏目。

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

- 两行绝对定位 top 586 / 754，行高 152px，行距 16px，左起 160px
- 每行由 250px ink 名牌块 + 自适应台词区两段构成，块间靠 3px 实线分隔
- 名牌 900 大字 56px，台词 700 大字 38px，右侧 22px mono 发言标记
- 整体左起 160px，行宽 1420px，最下一行底边距画布底 174px
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 上行自左、下行自右对撞入位（0.26s，power4.out），错峰 0.12s
- 每块落定瞬间阴影压 2 帧再弹回原档（steps(2)）
- 名牌与台词错开半格自各自方向装上（0.20–0.40s，power4.out）
- 发言标记自右分五格擦出（0.30s，steps(5)）
- 两行错峰做匀速往返位移（ease:none，起步时间错开半拍）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 两行几何必须完全对称：等宽等高，不许一行长一行短
- 当前发言行用整块换底色，不用半透明蒙版
- 名牌块恒为 ink 底白字，不随强调色变
- 台词单行不换行，靠 data-fit 缩
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `n1` | string | 上方发言人姓名（2–4 字） | `主持人` |
| `n2` | string | 下方发言人姓名（2–4 字） | `李知遥` |
| `t1` | string | 上方台词（12–20 字） | `很多人做内容不是不努力，是没定标准` |
| `t2` | string | 下方台词（12–20 字） | `标准一换，方向就清楚了，剩下的都是执行` |
| `live` | string | 发言中标记（2–5 字） | `正在发言` |
| `accent` | color | 强调色（当前发言人整块底色） | `#FFD429` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
