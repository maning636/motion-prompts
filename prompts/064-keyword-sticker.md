# 关键词贴纸

> 分类：透明叠加 ｜ 时长：4s ｜ 在线预览：https://motion.maning789link.top

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】关键词贴纸
【分类】透明叠加
【用途】A-roll 边角弹出的关键词贴纸，用于在口播讲到关键概念时做视觉强调，不遮挡主体。
【标签】关键词 / 贴纸 / A-roll / 弹出
【画幅】1920×1080（16:9 横屏）
【时长】4 秒，动画确定性、首尾可循环

【视觉与设计规范】
# 关键词贴纸视觉规范

## 方向

A-roll 边角弹出的关键词贴纸，用于在口播讲到关键概念时做视觉强调，不遮挡主体。

## Palette

- Transparent background
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Sticker background: `rgba(18,16,14,0.85)`
- Border: 2px solid accent

## Typography

- 关键词：36px，800
- 小标签：14px，700，opacity 0.6

## Layout

- 默认右上角，距边缘 96px
- 圆角胶囊或圆角矩形
- 左侧带 accent 竖条

## Motion

- 从画面外弹入，带轻微回弹
- 停留后整体淡出

## Avoid

- 不超过 4 个字
- 不放在人脸区域

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
