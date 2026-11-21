# 倒计时贴视觉规范

## 方向

倒计时贴的可信度全靠「数得准、看得见剩多少」：大数字按整数硬跳给准确读数，下方剩余条匀速排空给连续感知，两条信息互相印证。适合限时开拍、整点抽奖、秒杀。

## Palette

- Background: `transparent`（透明底贴片，默认导出带透明通道；`--paper` 全程不出现）
- Foreground: `#0F0F0F`（描边 / 中文正文 / 深色块上的文字）
- Accent: `#FF5FA0`（强调色，JS 走 `setProperty('--accent', v.accent)`）
- Muted: `#6B6B6B`（只用于小字号次级信息，不做描边、不做色块）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽，描边恒 ink 永不翻白）
- Shadow: `#FFFFFF`（透明底默认切白，走 §7.2 规则 A 的 `--shadow` 变量）

## Typography

- 中文大字 / 数值：`Noto Sans SC`，字重 900，字号比标签 ≥1.6×，letter-spacing 0（中文不收紧）
- 数字 / 编号 / 英文 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .06–.18em
- 次级说明：`Noto Sans SC` 或 `--mono`，字重 700，20–30px，letter-spacing 0–.06em

## 布局

- 数字块 left 96 / bottom 288，900×280，强调色底 + 3px 黑边
- 块内两段：26px mono 标签 + 168px mono 数字 + 56px 单位
- 剩余条 left 96 / bottom 88，900×168，白底 + 3px 黑边
- 剩余条内两段：26px mono 说明 + 40px 百分比、34px 底槽 + 34px 填充
- 填充块初始 width:100%，倒计时结束时排空到 0
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 数字块自左上斜向硬着陆（0.26s，power4.out），压 2 帧阴影
- 标签 / 单位自左装上（0.18–0.34s，power4.out）
- 剩余条自左分六格擦出（0.32s，steps(6)），说明与百分比错峰装上
- 数字 steps(12) 整数倒数，展示窗口写死 1.8s
- 剩余条匀速排空，缓动恒 none，与倒数同一条时间轴
- 倒数到 0 时标签左右各跳一格做硬切闪烁，收尾停在可见帧
- 两块反向做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 展示窗口 RUN 写死 1.8s，绝不用起始秒数推算时间轴长度
- onUpdate 里只写 textContent，不做任何 DOM 测量
- 排空用 fromTo，生长才用 B.in.grow
- 硬切闪烁后必须回到可见帧，收尾不允许停在 opacity 0
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `label` | string | 倒计时标签（4–8 字） | `距本场结束` |
| `start` | number | 起始秒数（1–60，只决定显示值） | `5` |
| `unit` | string | 单位（1 字） | `秒` |
| `note` | string | 底部 mono 说明（6–14 字） | `结束整点自动抽奖` |
| `accent` | color | 强调色（倒计时块底 / 剩余条） | `#FF5FA2` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
