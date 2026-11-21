# 逐字弹入大标题视觉规范

## 方向

标题先于画面出现：把一句口播里最该被记住的话，用 JS 切成一串单字，逐字硬位移落定。适合知识口播的开场定帧、章节点题，以及任何「这一期只讲一句话」的封面帧。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，152px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，152px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部 20px 强调色横带 + 上下 3px 黑边
- 眉标行位于 y=44，左对齐 88px，右侧一枚 mono 期号胶囊
- 标题区占满剩余高度并垂直居中，一行 152px，行高 1.08
- 标题右侧留 14px 空隙挂 22×120px 强调色光标块
- 底部 3px 实线 + 22px mono 注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 顶栏斜纹色带分 8 格从左推出（0.34s，steps(8)）
- 眉标与期号上下硬着陆（0.22–0.24s，power4.out）
- 标题逐字自 +30px 落位，0.045s 错峰（0.22s，power4.out）
- 光标块落定瞬间阴影压 2 帧再弹回（0.08s，steps(2)）
- 底部规则从左画出（0.26s，power4.out）
- 斜纹带匀速滚动 60px（1.2s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 中文不用负字距
- 逐字错峰不小于 0.04s，避免读成一串抖动
- 标题一行放不下时靠 B.fit() 缩，不手动换行
- 不做淡入当主入场

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `TITLE / 逐字大标题` |
| `idx` | string | 右上角期号（mono） | `EP.012` |
| `title` | string | 逐字弹入的大标题（一行，建议 8–12 字） | `写得慢，多半是想得少` |
| `note` | string | 底部 mono 注脚（出处 / 口径） | `口播 · 第 12 期 · 讲稿第 3 段` |
| `accent` | color | 强调色（左侧竖条 + 斜纹带） | `#FF5FA2` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
