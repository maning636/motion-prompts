# 进度条贴片视觉规范

## 方向

进度条贴片比进度角标更轻：一条细长横条加一枚跟着走的游标，适合贴在画面底部长期存在。游标的位置在搭建时量一次算好，运行期只做 x 补间，不在 onUpdate 里测量。

## Palette

- Background: `transparent`（透明底贴片，默认导出带透明通道；`--paper` 全程不出现）
- Foreground: `#0F0F0F`（描边 / 中文正文 / 深色块上的文字）
- Accent: `#3D7BFF`（强调色，JS 走 `setProperty('--accent', v.accent)`）
- Muted: `#6B6B6B`（只用于小字号次级信息，不做描边、不做色块）
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽，描边恒 ink 永不翻白）
- Shadow: `#FFFFFF`（透明底默认切白，走 §7.2 规则 A 的 `--shadow` 变量）

## Typography

- 中文大字 / 数值：`Noto Sans SC`，字重 900，字号比标签 ≥1.6×，letter-spacing 0（中文不收紧）
- 数字 / 编号 / 英文 / 状态标签：`Sarasa Gothic SC`，字重 700–900，letter-spacing .06–.18em
- 次级说明：`Noto Sans SC` 或 `--mono`，字重 700，20–30px，letter-spacing 0–.06em

## 布局

- 长条 left 96 / bottom 300，1728×180，白底 + 3px 黑边
- 条内三段：标题 44px / 阶段说明 26px / 百分比 48px 同一行
- 底槽高 48px，白底 + 3px 黑边，填充块初始 width:0
- 游标方块 44×44，强调色底 + 3px 黑边，压在填充条右端
- 游标初始 left/top 由脚本按轨道实测写入，位移量在搭建时算好
- 四档硬阴影：长条 sh-l，游标 sh-s
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 长条自左 90px 拍入（0.26s，power4.out），压 2 帧阴影
- 标题自左、阶段说明自右错峰装上（0.18–0.24s，power4.out）
- 游标自上方 30px 落位（0.24s，power4.out）
- 填充条用 B.in.grow 匀速生长（ease:none），展示窗口写死 1.5s
- 游标 x 与填充条同步平移，位移量在搭建时算好
- 百分比 steps(12) 整数跳数，与填充条同一条时间轴
- 两层反向做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 游标位移量在搭建时量一次算好，onUpdate 里绝不做 DOM 测量
- width:0 的填充条一律用 B.in.grow，不用 B.in.wipe
- 百分比只决定显示值，绝不参与时间轴长度计算
- 游标与填充条必须共用同一条时间轴，不能各走各的
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `label` | string | 进度名（4–12 字） | `本期内容进度` |
| `pct` | number | 完成百分比（0–100） | `62` |
| `step` | string | 右侧阶段说明（6–14 字） | `正在讲第 3 节` |
| `accent` | color | 强调色（填充条 / 游标块） | `#3D7BFF` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
