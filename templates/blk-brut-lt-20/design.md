# 关注引导贴视觉规范

## 方向

关注引导常见的问题是把 CTA 写成一行小字。这里的做法是给它一整块绿色按钮，并复刻整套风格里唯一的交互签名——按下时位移量正好等于阴影偏移量，一帧完成不补间。

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

- 大字卡 left 96 / bottom 216，1180×300，白底 + 3px 黑边
- 卡内三段：96px 900 大字、3px 规则、30px mono 账号名
- 动作按钮 left 1312 / bottom 216，388×300，绿色底 + 3px 黑边
- 按钮内两段：88px 900 文字 + 56px 裸字符箭头（文字硬投影）
- 说明条 left 96 / bottom 88，1180×96，ink 底黄字
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 大字卡自左上斜向硬着陆（0.26s，power4.out），压 2 帧阴影
- 大字 / 规则 / 账号自左错峰装上（0.20–0.34s，power4.out）
- 按钮自右 60px 拍入（0.24s，power4.out），压 2 帧阴影
- 模 3 按下反馈：位移 6px + 阴影 2px，1 帧完成，再 1 帧弹回原档
- 说明条自左分六格擦出（0.32s，steps(6)）
- 三块反向做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 按下反馈的位移量恒等于阴影偏移量，这是全风格唯一的交互签名
- 绿色是「正向状态」专用色，不做装饰
- 箭头是裸字符件 + 文字硬投影，不加 3px 描边
- 大字卡与按钮几何不等宽，但底边对齐
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `head` | string | 引导大字（6–12 字，单行） | `关注不迷路` |
| `acct` | string | 账号名（6–16 字） | `@BLOCKBRUT 积木社` |
| `btn` | string | 绿色按钮文字（2–4 字） | `关注` |
| `note` | string | 底部 mono 说明（8–18 字） | `每条视频末尾都会提醒一次` |
| `accent` | color | 强调色（大字色块底 / 说明条） | `#FFD429` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
