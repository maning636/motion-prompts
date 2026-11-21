# 投票贴视觉规范

## 方向

投票贴要同时回答两件事：问的是什么、现在谁领先。所以问题独占一条 ink 通栏，下面两块等宽卡镜像排布，领先的那块整块换强调色，百分比直接由两方票数在浏览器里算出来。

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

- 问题条 left 96 / bottom 560，1728×120，ink 底白字
- 两张选项卡 left 96 / 984，bottom 296，各 840×240，几何完全对称
- 卡内三段：84px 编号方块 + 900 选项文字、3px 规则、票数 + 百分比
- 编号方块恒 ink 底 yellow 字，两卡一致
- 百分比用 mono + tabular-nums，票数用 mono 700
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 问题条自左分六格擦出（0.32s，steps(6)），压 2 帧阴影
- 左右两块自两侧对撞入位（0.26s，power4.out），错峰 0.06s，各压 2 帧阴影
- 选项文字自各自方向装上（0.20–0.50s，power4.out）
- 两方百分比 steps(8) 同时整数跳到终值，展示窗口写死 0.9s
- 两块反向做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 两张卡几何必须对称：等宽等高，不许一张大一张小
- 领先方用整块换底色，不用半透明蒙版
- 百分比由票数解析得出，解析失败退回 50 / 50，画面仍完整
- 票数与百分比一律 mono + tabular-nums
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `q` | string | 投票问题（10–20 字） | `你现在最缺的是哪一个？` |
| `a1` | string | 选项甲文字（4–10 字） | `选题标准` |
| `a2` | string | 选项甲票数（含单位，如 1,284 票） | `1,284 票` |
| `b1` | string | 选项乙文字（4–10 字） | `执行节奏` |
| `b2` | string | 选项乙票数（含单位） | `1,180 票` |
| `accent` | color | 强调色（领先方色块） | `#FFD429` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
