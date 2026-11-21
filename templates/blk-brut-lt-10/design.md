# 折扣标签贴视觉规范

## 方向

折扣贴只解决一件事：让「便宜了几折」在缩略图尺寸下也读得出来。做法是把折扣数字放到最大的胶囊里，四周再挂一块 ink 小条和一块白底说明，视线先落在数字上，再往下读到限制条件。

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

- 胶囊绝对定位 left 120 / bottom 200，620×176，border-radius 9999px
- ink 小条 left 180 / bottom 352，320×64，压住胶囊上沿约 19px
- 右侧白底说明块 left 786 / bottom 200，520×176
- 胶囊内 132px 折扣数字 + 12px 间距 + 56px 单位字
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 胶囊自左 80px 拍入（0.26s，power4.out），落定瞬间阴影压 2 帧再弹回
- 说明块自左分六格擦出（0.32s，steps(6)），文字错峰自右装上
- ink 小条自上方 34px 落位（0.24s，power4.out），压 2 帧阴影
- 折扣数字做一次 0.82→1 单调缩放落位（0.22s，power3.out）
- 三层各走一段匀速往返位移，起步时间错开（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 胶囊是 9999px 圆角，全文件唯一允许的非直角
- 折扣数字不做连续滚动，避免 8.5 被取整成 9
- 大数字不做回弹弹入，用 0.82→1 单调缩放
- 说明块与胶囊并排不重叠，间距 46px
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `flag` | string | 顶部 mono 小条（2–8 字） | `LIMITED` |
| `num` | string | 折扣数字（1–3 个字符，如 8 / 8.5） | `8` |
| `unit` | string | 折扣单位（1 字） | `折` |
| `note` | string | 胶囊右侧说明（6–14 字） | `仅剩最后 3 天` |
| `accent` | color | 强调色（胶囊底） | `#FF5FA2` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
