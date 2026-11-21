# 下节预告条视觉规范

## 方向

预告条的任务是让人不要划走。所以左端一枚大号 NEXT 色块先回答「还有下一节」，中间给标题与一句承诺，右侧箭头方块收口给出「往这边走」的暗示。

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

- 预告标签 left 96 / bottom 352，420×76，ink 底黄字
- 预告条 left 96 / bottom 152，1456×176，ink 底
- 预告条左端 240px 强调色 NEXT 色块，恒 ink 底字
- 条内两段：54px 900 white 标题 + 24px mono yellow 副行
- 箭头方块 right 96 / bottom 152，176×176，强调色底 + 3px 黑边
- 四档硬阴影只挂 sh-l 一档
- 画布：1920×1080，`#stage` 显式锁死 `width/height/position:relative/overflow:hidden`

## 动画

- 预告条自左分八格擦出（0.34s，steps(8)），压 2 帧阴影
- NEXT 色块 / 标题 / 副行错峰自左装上（0.22–0.40s，power4.out）
- 标签条自上方 34px 落位（0.24s，power4.out），压 2 帧阴影
- 箭头方块自右 60px 拍入（0.24s，power4.out），压 2 帧阴影
- 箭头裸字符自右 26px 装上（0.20s，power4.out）
- 三块错峰做匀速往返位移（ease:none）
- 时长 5 秒，尾部留静止 hold

## Avoid

- 预告条长度要让开右侧箭头方块，不许压在一起
- NEXT 色块恒 ink 底字，不随强调色变
- 箭头是裸字符件 + 文字硬投影，不加 3px 描边
- ink 底上的文字恒用 white / yellow
- 透明底贴片：不靠 `--paper` 底色，靠不透明高饱和填充 + 3px ink 描边撑可读性
- 深底变体：每个字都压在不透明色块上，叠在 `#1a1d24` 深底 footage 上仍然读得清
- 不使用 `back.out` / `elastic.out` / `bounce.out` / `sine.inOut`，不用 `repeat:-1`

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `label` | string | 上方 mono 标签（4–12 字） | `NEXT / 下一节` |
| `title` | string | 下节标题（6–16 字，单行） | `下一节：怎么定价才不亏` |
| `sub` | string | 副行（8–20 字） | `讲完这节你就能自己开价` |
| `accent` | color | 强调色（NEXT 色块 / 箭头方块） | `#FFD429` |
| `duration` | number | 时长（秒） | `5` |
| `exportMode` | enum | Format | `transparent` |
