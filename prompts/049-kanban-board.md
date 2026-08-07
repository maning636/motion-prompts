# Kanban 看板

> 分类：信息卡片 ｜ 时长：6s ｜ 在线预览：https://motion.maning789link.top

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】Kanban 看板
【分类】信息卡片
【用途】四列任务看板，每列显示任务卡片数，焦点列用 accent 边框高亮，适合展示 Sprint 状态和 workflow 可视化。
【标签】Kanban / 看板 / Sprint / 任务状态
【画幅】1920×1080（16:9 横屏）
【时长】6 秒，动画确定性、首尾可循环

【视觉与设计规范】
# Kanban 看板视觉规范

## 方向

四列任务看板，每列显示任务卡片数，焦点列用 accent 边框高亮，适合展示 Sprint 状态和 workflow 可视化。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Column border: `rgba(244,239,231,0.12)`
- Card border: `rgba(244,239,231,0.10)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 列名：18px，700，letter-spacing 0.12em
- 卡片：20px，500
- 计数：16px，opacity 0.45

## Layout

- 标题区 + 四列网格
- 列等宽，间距 24px
- 卡片纵向堆叠，间距 14px

## Motion

- 标题入场
- 列从左到右依次弹入
- 每列卡片依次下落
- 焦点列最后微强调
- 结束前整体上移淡出

## Avoid

- 不使用拖拽动效、阴影、头像
- 列数建议 4，卡片每列 2–4 张

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
