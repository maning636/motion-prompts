# 优惠码贴视觉规范

## 方向

优惠码贴要在观众伸手截图的那一秒把码看全。所以码是全画面最大的 mono 文字，竖条与虚线撕口把它框成一个券的形状，按钮单独成块放在右边。

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

- 券面 left 96 / bottom 200，1000×300，白底 + 3px 黑边
- 左侧 128px 强调色竖条，恒 ink 底字，竖排单字
- 券面右段四段：26px mono 券类型、84px mono 900 优惠码、3px 虚线撕口、24px mono 说明
- 按钮块 left 1132 / bottom 200，568×300，绿色底 + 3px 黑边
- 按钮内两段：76px 900 文字 + 52px 裸字符箭头（文字硬投影）
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 券面自左 80px 拍入（0.28s，power4.out），压 2 帧阴影
- 券类型 / 优惠码 / 撕口 / 说明 / 竖排单字错峰自左装上
- 撕口用 scaleX 0.3→1 画出（0.26s，power4.out）
- 按钮块自右 80px 拍入（0.26s，power4.out），文字与箭头错峰装上
- 模 3 按下反馈：位移 6px + 阴影 2px，1 帧完成再弹回原档
- 按钮底色按固定节奏 tl.set 硬切换一次并停在绿色
- 两块反向做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 竖排单字不能挂 x 轴 data-fit，否则字会被切；改挂 data-fit-axis=y 且不裁剪
- 撕口是 3px 虚线元素，不依赖 border-style 的默认值
- 按下反馈的位移量恒等于阴影偏移量
- 绿色是「正向状态」专用色，只用在转化动作上
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `label` | string | 左侧竖条上的 mono 字（2–4 字） | `券` |
| `kind` | string | 券类型（2–6 字） | `限时优惠券` |
| `code` | string | 优惠码（6–12 字，建议大写） | `BB2026` |
| `hint` | string | 使用说明（8–18 字） | `结算页输入即可抵扣` |
| `btn` | string | 按钮文字（2–6 字） | `立即使用` |
| `accent` | color | 强调色（按钮块底 / 左侧竖条） | `#FFD429` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
