# 仪表盘 Mock（奶油贴纸）

> 分类：奶油贴纸 ｜ 时长：6s ｜ 在线预览：https://motion.maning789link.top

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】仪表盘 Mock（奶油贴纸）
【分类】奶油贴纸
【用途】奶油纸面贴纸版界面拟物：模拟数据仪表盘界面，含顶部 KPI 卡片与底部迷你趋势图，适合演示实时指标监控。
【标签】仪表盘 / Mock / KPI / 数据 / 奶油贴纸
【画幅】1920×1080（16:9 横屏）
【时长】6 秒，动画确定性、首尾可循环

【视觉与设计规范】
# cream-dashboard-mock · 仪表盘 Mock（奶油贴纸版）

奶油纸面贴纸工作台风格，原型: window（界面拟物）。

- 变量: title,subtitle,kpi1,label1,kpi2,label2,kpi3,label3,chartLabel
- 字体: Noto Sans SC / Fredoka / IBM Plex Mono（渲染时由 hyperframes 从 Google Fonts 嵌入）
- 动效: back.out 弹性落位，Lime 最后锁定，5.5s 淡出

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
