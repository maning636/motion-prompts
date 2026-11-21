# 地点条视觉规范

## 方向

地点条分三层：定位针负责「在哪」，地点卡负责「具体是哪儿」，绿色状态块负责「是不是现场」。三块几何依次递减，视线自然从左走到右。适合线下活动、探店、现场连线。

## Palette

- Background: `transparent`（透明底贴片，默认导出带透明通道；`--paper` 全程不出现）
- Foreground: `#0F0F0F`（描边 / 中文正文 / 深色块上的文字）
- Accent: `#2FD07A`（强调色，JS 走 `setProperty('--accent', v.accent)`）
- Muted: `#6B6B6B`（只用于小字号次级信息，不做描边、不做色块）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽，描边恒 ink 永不翻白）
- Shadow: `#FFFFFF`（透明底默认切白，走 §7.2 规则 A 的 `--shadow` 变量）

## Typography

- 中文大字 / 数值：`Noto Sans SC`，字重 900，字号比标签 ≥1.6×，letter-spacing 0（中文不收紧）
- 数字 / 编号 / 英文 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .06–.18em
- 次级说明：`Noto Sans SC` 或 `--mono`，字重 700，20–30px，letter-spacing 0–.06em

## 布局

- 定位板 left 120 / bottom 200，120×176，ink 底，阴影走白
- 定位针 SVG 76×76，stroke-width 3，fill 黄色
- 地点卡 left 264 / bottom 200，1080×176，白底 + 3px 黑边
- 卡内三段：64px 900 地名、3px ink 规则、26px mono 地址
- 现场状态块 left 1380 / bottom 200，320×176，绿色底
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 三块自左上依次斜向硬着陆（0.26s，power4.out），错峰 0.14s，各压 2 帧阴影
- 地名 / 规则 / 地址 / 状态点 / 状态字错峰自各自方向装上
- 状态方块按固定节奏 tl.set 硬切闪一次并停在可见帧
- 三块错峰做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- ink 底上的件阴影走白（§7.2 规则 B），不许翻成黑
- SVG 必须同时给 width 与 height
- SVG 描边恒为 stroke #0F0F0F + stroke-width 3
- 每段文字都压在不透明色块上，深底 footage 上照样读得清
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `pname` | string | 地点名（2–8 字） | `杭州 · 未来科技城` |
| `addr` | string | 详细地址（8–20 字） | `梦想小镇学术交流中心 3 号楼` |
| `live` | string | 绿色状态块上的 mono 字（2–4 字） | `现场` |
| `accent` | color | 强调色（状态块底 / 定位角） | `#2FD07A` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
