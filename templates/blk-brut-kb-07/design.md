# 关键词高亮扫过视觉规范

## 方向

一段口播正文里只高亮一个词：高亮块用真实 div 元素做，从左逐格扫过压在关键词下面。适合讲定义、讲误区、讲结论的段落，用一个词把观众的注意力钉在句子上。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FFD429`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FFD429 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，76px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 76px 主标题同行排布
- 主标题下方 3px 实线，线距 34px
- 正文区垂直居中，正文 52px / 行高 1.62
- 高亮块比文字左右各外扩 10px，高 0.66em，底距 0.10em
- 底部规则 + 22px mono 口径注脚；最底 20px 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与标题自左硬着陆（0.24s，power4.out）
- 3px 分隔线从左画出（0.26s，power4.out）
- 正文区自下压入（0.28s，power4.out）
- 高亮块分 6 格从左扫过（0.36s，steps(6)）
- 底部规则从左画出 + 注脚自下进入（0.22–0.26s）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 高亮关键词不超过 2 处
- 高亮块只做 scaleX，不做位置与颜色渐变
- 关键词本身不做缩放，避免和高亮块打架
- 正文最多三行，超过就拆条

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `KEYWORD / 关键词` |
| `title` | string | 主标题（两行拼一段，不超 22 字） | `先把话说清楚，再把画面做满` |
| `pa` | string | 正文 · 关键词之前 | `口播视频最容易翻车的地方不是剪辑，是观众` |
| `kw` | string | 被高亮的关键词（2–6 字） | `没听懂` |
| `pb` | string | 正文 · 关键词之后 | `就已经划走了，后面做得再认真也没人看。` |
| `note` | string | 底部 mono 注脚（口径 / 出处） | `关键词高亮不超过 2 处 · 本片 1 处` |
| `accent` | color | 高亮色 + 斜纹带 | `#FFD429` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
