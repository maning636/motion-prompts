# 直播状态贴视觉规范

## 方向

直播状态贴要在缩略图尺寸下也读得出「正在播」和「有多少人」。所以状态牌用高饱和胶囊，状态方块靠硬切闪烁做存在感，人数用等宽数字避免跳动时左右抖。

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

- 状态胶囊 left 96 / top 96，340×104，pill 圆角，强调色底
- 胶囊内：26px 状态方块 + 40px 900 mono 状态文字
- 在线人数卡 left 96 / top 232，480×132，白底 + 3px 黑边
- 人数卡内：84px mono 数字 + 26px mono 单位
- 点赞胶囊 left 612 / top 248，340×104，pill 圆角，黄色底
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 状态胶囊自左上斜向硬着陆（0.26s，power4.out），压 2 帧阴影
- 人数卡与点赞胶囊自左依次分六格擦出（steps(6)），错峰 0.24s
- 在线人数 steps(14) 整数跳数，展示窗口写死 1.4s，数字带千分位
- 状态方块按固定节奏 tl.set 硬切闪三下，收尾停在可见帧
- 三块错峰做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 在线人数只决定显示值，绝不用人数推算时间轴长度
- 数字带千分位并用 mono + tabular-nums，滚动时宽度不抖
- onUpdate 里只写 textContent，不做任何 DOM 测量
- 硬切闪烁后必须回到可见帧，收尾不允许停在 opacity 0
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `state` | string | 直播状态文字（2–5 字） | `直播中` |
| `views` | number | 观看人数（只决定显示值） | `12800` |
| `unit` | string | 人数单位（1–2 字） | `人在线` |
| `like` | string | 点赞文案（4–10 字） | `点赞 1.2w` |
| `accent` | color | 强调色（状态胶囊底） | `#FF5FA2` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
