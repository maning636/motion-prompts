# 对比两行字视觉规范

## 方向

左右两张同宽卡片，各带一枚 64×64 符号方块与一行 76px 大字，左 ✕ 右 ✓ 两栏相向撞入。适合「以前 / 现在」「是 / 否」这类二选一的判断句。

## Palette

- Background: `#FFF6E5`
- Foreground: `#0F0F0F`
- Accent: `#FF5FA2`
- Muted: `#6B6B6B`
- Border: `#0F0F0F`（3px 硬描边，全文件唯一线宽）
- Stripe: `repeating-linear-gradient(45deg, #0F0F0F 0 10px, #FF5FA2 10px 20px)`

## Typography

- 主标题 / 大字：`Noto Sans SC`，字重 900，76px，letter-spacing 0（中文不收紧）
- 数字：`Sarasa Gothic SC`，字重 900，120px，font-variant-numeric tabular-nums
- 说明 / 正文：`Noto Sans SC`，字重 700，28–46px，letter-spacing 0
- 眉标 / 标签 / 编号：`Sarasa Gothic SC`，字重 700，20–26px，letter-spacing .06–.14em

## 布局

- 顶部眉标 + 3px 规则
- 对比区 871px 高，两栏等宽，栏间共享一条 3px 竖边
- 每栏内：64px 符号方块 + 24px mono 标签 + 76px 大字 + 28px 说明
- 左栏白底 + ink 符号块，右栏白底 + 强调色符号块
- 底部规则 + 22px 注脚；最底 20px -45° 斜纹带
- 画布：1920×1080，#stage 锁定尺寸并 overflow:hidden

## 动画

- 眉标与顶部规则自左进入（0.24–0.28s，power4.out）
- 左右两栏自相反方向各 80px 撞入（0.28s，power4.out）
- 两枚符号方块斜向拍入并压阴影（0.24s，power4.out）
- 两行大字自相反方向错峰进入（0.24s，power4.out）
- 两条说明行自相反方向错峰进入（0.22s，power4.out）
- 底部规则从右画出（0.28s，power4.out）
- 斜纹带分 8 格推出后匀速滚动 40px（1.0s，ease:none）
- 时长 5.5 秒，尾部留静止 hold
- 演完定格最后一帧，无收尾 fade-out

## Avoid

- 两栏同宽同字号，只换内容
- 符号方块只用纯字符
- 说明每栏不超过 18 个字
- 两栏之间用共享黑边，不留 80px 白

## 变量

| id | type | label | default |
| --- | --- | --- | --- |
| `eyebrow` | string | 眉标（mono + 大字距） | `YES NO / 两行对比` |
| `leftLab` | string | 左侧列头（mono + 中文，2–8 字） | `以前 / BEFORE` |
| `leftMark` | string | 左侧符号（1 字） | `✕` |
| `leftBig` | string | 左侧大字（一行，4–7 字） | `先剪画面` |
| `leftNote` | string | 左侧说明（一行，10–18 字） | `素材齐了才开始想说什么` |
| `rightLab` | string | 右侧列头 | `现在 / NOW` |
| `rightMark` | string | 右侧符号（1 字） | `✓` |
| `rightBig` | string | 右侧大字（一行，4–7 字） | `先写句子` |
| `rightNote` | string | 右侧说明（一行，10–18 字） | `写完一句话，剩下的画面才有取舍标准` |
| `note` | string | 底部 mono 注脚 | `两栏同宽同字号 · 只换内容不换版式` |
| `accent` | color | 强调色（斜纹带） | `#FF5FA2` |
| `duration` | number | 总时长（秒，5–8） | `5.5` |
| `exportMode` | enum | Format | `mp4` |
