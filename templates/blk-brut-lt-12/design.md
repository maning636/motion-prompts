# 进度角标视觉规范

## 方向

进度贴的读法是「填了多少 + 走到第几步」两件事同时成立，所以卡片里给了三层：当前进度的文字、一道会长的条、一排会被逐格点亮的刻度。适合答题、分步流程、章节进度。

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

- 主卡绝对定位 left 96 / bottom 216，760×216，白底 + 3px 黑边
- 卡内三行：进度文字行 64px、底槽 44px、十格刻度 22px，间距 16/14px
- 底槽白底 + 3px 黑边，填充块绝对定位左顶底，初始 width:0
- 刻度十格等分，格距 6px，每格独立 3px 黑边
- 读数条 left 96 / bottom 88，760×96，ink 底黄字
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 主卡自左 70px 拍入（0.26s，power4.out），压 2 帧阴影
- 填充条用 B.in.grow 从 0% 长到设定百分比，缓动恒 none，展示窗口写死 1.3s
- 读数 steps(10) 整数跳到百分比，与填充条同一时间轴
- 刻度按百分比逐格 tl.set 硬切点亮底色，每格 1 帧不补间
- 读数条自下方 40px 压入（0.26s，power4.out），压 2 帧阴影
- 两层反向做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- width:0 的填充条一律用 B.in.grow，不用 B.in.wipe
- 百分比只决定画面上的数值，绝不参与时间轴长度计算
- onUpdate 里只写 textContent，不做任何 DOM 测量
- 底槽白底、填充实色，长度差就是进度差
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `label` | string | 左上角 mono 眉标（2–6 字） | `答题进度` |
| `now` | string | 当前进度（形如 03 / 10） | `03 / 10` |
| `note` | string | 底部读数前缀（2–4 字） | `已完成` |
| `pct` | number | 完成百分比（0–100） | `30` |
| `accent` | color | 强调色（填充条 / 已完成格） | `#FFD429` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
