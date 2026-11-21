# 用户证言卡视觉规范

## 方向

评价卡构图：画面正中一张 1340px 宽的大评价卡，顶部一枚大引号带文字硬投影，中部证言正文按换行逐行显现，下方星级与署名块撑住卡片底部。适合买家秀、追评、达人推荐的证言帧。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`（卡底 / 徽章 / 斜纹带）
- 引号: `#0F0F0F` 字 + `4px 4px 0` 白色文字硬投影
- 星级未点亮: `#6B6B6B`；已点亮: 卡底 ink 色 + `2px 2px 0` 白影
- 头像方块: `#0F0F0F` 底 + accent 字

## Typography

- 证言正文：`Noto Sans SC`，字重 900，46px，行高 1.5
- 引号：`Noto Sans SC`，字重 900，132px，行高 .7
- 署名：`Noto Sans SC`，字重 900，40px
- 身份行：`Sarasa Gothic SC`，字重 700，24px，letter-spacing .08em
- 星级：`Sarasa Gothic SC`，字重 900，60px

## 布局

- 画布 1920×1080，顶部反白条 70px，底部斜纹带 20px
- 评价卡定宽 1340px 居中，内边距 40/56/44，10px 硬阴影
- 卡内四段：引号（定高 96px）+ 正文 + 星级行 + 署名块（margin-top:auto 撑底）
- 署名块含 96px 头像方块 + 姓名与身份两行，上沿 3px 实线
- 口径说明 padding 0/72/22

## 动画

- 顶部反白条落下，眉标与注释错峰补位
- 大面积卡片以 scale .86 → 1 弹入（0.3s，power3.out）
- 引号斜向拍入
- 模 2 硬着陆：正文按换行拆出的行块逐行自左拍入（每行 0.14s），纯位移 opacity 恒为 1
- 星级逐颗自上落下，只换颜色档位不做 scale 弹入
- 卡片落定后阴影压 2 帧再弹回 10px 档，署名块自下拍入
- 口径说明与斜纹带收尾，斜纹带匀速滚动 60px
- 结尾定格最后一帧

## 变量

- `eyebrow` string 眉标（黑条上的 mono 字）
- `quote` string 证言正文（可多行，换行即分行块）
- `name` string 用户署名
- `role` string 身份 / 地区（mono 小字）
- `rating` number 评分（1–5）
- `headline` string 顶部注释
- `note` string 口径说明（一行 mono）
- `accent` color 强调色（卡底 / 引号 / 斜纹带）
- `duration` number 总时长（秒，5–6）
- `exportMode` enum 导出格式

派生值（只读显示，不进表单）：五颗星星的点亮状态由 `rating` 推出；头像方块文字取 `name` 的首字；正文的行块由 `quote` 按换行拆分（最多 4 行）。

## Avoid

- 星级只由评分变量推出，不单独再填一个星级变量
- 证言必须原文引用，不做润色改写
- 引号是文字硬投影件，不加 3px 描边、不加盒阴影
- 正文最多 4 行，超出由行块容器裁切并靠 fit() 缩放
- 不用 rotate / skew 入场，不用 back.out / elastic / bounce