# 新品角标视觉规范

## 方向

新品角标的信息结构是三层：谁家的、叫什么、什么规格。所以卡片里三行给信息，角标只负责「这是新的」这一个判断，价格单独成块放在右边。适合直播上新、新品发布。

## Palette

- Background: `transparent`（透明底贴片，默认导出带透明通道；`--paper` 全程不出现）
- Foreground: `#0F0F0F`（描边 / 中文正文 / 深色块上的文字）
- Accent: `#FF5FA2`（强调色，JS 走 `setProperty('--accent', v.accent)`）
- Muted: `#6B6B6B`（只用于小字号次级信息，不做描边、不做色块）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽，描边恒 ink 永不翻白）
- Shadow: `#FFFFFF`（透明底默认切白，走 §7.2 规则 A 的 `--shadow` 变量）

## Typography

- 中文大字 / 数值：`Noto Sans SC`，字重 900，字号比标签 ≥1.6×，letter-spacing 0（中文不收紧）
- 数字 / 编号 / 英文 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .06–.18em
- 次级说明：`Noto Sans SC` 或 `--mono`，字重 700，20–30px，letter-spacing 0–.06em

## 布局

- 商品卡 left 96 / bottom 216，1200×280，白底 + 3px 黑边
- 卡内三段：24px mono 品牌、76px 900 商品名、26px mono 规格
- NEW 角标 left 60 / bottom 456，300×96，pill 圆角，压住卡片左上角约 35px
- 价格块 left 1332 / bottom 216，368×280，黄色底 + 3px 黑边
- 价格块内两段：22px mono 标签 + 104px mono 价格 + 40px 单位
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 商品卡自左 80px 拍入（0.26s，power4.out），压 2 帧阴影
- 品牌 / 商品名 / 规格错峰自左装上（0.18–0.32s，power4.out）
- NEW 角标自左上盖章落位（0.8→1 单调缩放，0.24s，power3.out），压 2 帧阴影
- 价格块自右 80px 拍入（0.26s，power4.out），标签与单位错峰装上
- 价格 steps(9) 整数跳数，展示窗口写死 1.0s
- NEW 角标底色按固定节奏 tl.set 硬切换两次并停在默认色
- 三块错峰做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 大面积元素不做回弹弹入，角标用 0.8→1 单调缩放
- 价格数字用 mono + tabular-nums
- onUpdate 里只写 textContent，不做任何 DOM 测量
- 角标与商品卡的压叠量是几何常量，不随文字长度变化
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `brand` | string | 品牌 mono 行（4–12 字） | `BLOCKBRUT SELECT` |
| `pname` | string | 商品名（4–12 字，单行） | `积木社年度订阅卡` |
| `spec` | string | 规格说明（8–18 字） | `12 期 · 含全部资料包` |
| `newtag` | string | 新品角标文字（2–6 字） | `NEW` |
| `price` | number | 价格数字（不含货币符号） | `199` |
| `currency` | string | 货币单位（1 字） | `元` |
| `accent` | color | 强调色（新品角标 / 价格块） | `#FF5FA2` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
