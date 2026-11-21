# 热线电话条视觉规范

## 方向

热线条的号码必须是被抄走的，所以它必须是全画面最大的 mono 数字；绿色方块负责「可以打」，粉色服务时间块负责「什么时候打」。三块从左到右读完就是完整的联系信息。

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

- 电话方块 left 120 / bottom 200，176×176，绿色底 + 3px 黑边
- 话筒 SVG 96×96，stroke-width 3，fill 白色
- 号码卡 left 332 / bottom 200，1088×176，白底 + 3px 黑边
- 卡内两段：24px mono 标签 + 76px mono 900 号码
- 服务时间块 left 1456 / bottom 200，304×176，强调色底
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 三块自左上依次斜向硬着陆（0.26s，power4.out），错峰 0.14s，各压 2 帧阴影
- 标签 / 号码 / 服务时间标签 / 时间错峰自各自方向装上
- 电话方块底色按固定节奏 tl.set 硬切换两次并停在绿色
- 三块错峰做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- SVG 必须同时给 width 与 height
- SVG 描边恒为 stroke #0F0F0F + stroke-width 3
- 号码用 mono + tabular-nums，含分隔符也不抖
- 绿色是「正向状态」专用色，只用在可拨打语义上
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `label` | string | 号码上方 mono 标签（2–6 字） | `咨询热线` |
| `tel` | string | 电话号码（8–16 字） | `400-820-8820` |
| `hours` | string | 服务时间（6–14 字） | `工作日 9:00–18:00` |
| `accent` | color | 强调色（服务时间块底） | `#FF5FA2` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
