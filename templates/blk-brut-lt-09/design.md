# 价格贴视觉规范

## 方向

价格贴要解决的是「一眼比出便宜了多少」：左边一块高饱和价格块给到手价，右边一块白底小牌给划线原价，视觉重量天然不等，答案不用口播解释。适合直播挂价、开箱报价、限时优惠。

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

- 价格块绝对定位 left 120 / bottom 176，780×296，强调色底 + 3px 黑边
- 块内三段：mono 标签 26px、132px 价格数字 + 44px 单位、mono 补充说明 22px
- 原价块 left 940 / bottom 288，440×112，白底 + 3px 黑边
- 原价块内一条 3px ink 划线压住数字，左右各留 24px
- 价格数字用 mono + tabular-nums，位宽稳定不抖
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 价格块自左 70px 拍入（0.26s，power4.out），落定瞬间阴影压 2 帧再弹回
- 价格数字 steps(9) 整数跳数，展示窗口写死 1.2s（ease:steps(9)）
- 标签 / 单位 / 补充说明错峰自左装上（0.18–0.40s，power4.out）
- 原价块自右 70px 拍入，压 2 帧阴影
- 划线用 clip-path 分六格从左画出（0.30s，steps(6)）
- 两块反向做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 数字跳数的展示窗口写死，绝不用价格数值推算时间轴长度
- onUpdate 里只写 textContent，不做任何 DOM 测量
- 划线是 3px 实线元素，不依赖 text-decoration
- 价格数字恒用 mono + tabular-nums
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `tag` | string | 价格标签（2–5 字） | `到手价` |
| `cur` | number | 现价数字（不含货币符号） | `299` |
| `unit` | string | 货币单位（1–2 字） | `元` |
| `was` | number | 原价数字（划线显示） | `599` |
| `note` | string | 价格下方补充说明（8–16 字） | `含一年服务 · 下单后 3 分钟生效` |
| `accent` | color | 强调色（价格块底 / 原价块） | `#FFD429` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
