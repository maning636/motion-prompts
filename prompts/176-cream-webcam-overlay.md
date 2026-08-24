# 摄像头叠加框（奶油贴纸）

> 分类：奶油贴纸 ｜ 时长：6s ｜ 在线预览：https://motion.maning789link.top

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】摄像头叠加框（奶油贴纸）
【分类】奶油贴纸
【用途】奶油纸面贴纸版界面拟物：圆形画框 + 细边框呼吸动画，可叠加在屏幕录制或 B-roll 之上的真人出镜角标。
【标签】摄像头 / 叠加 / 角标 / 真人出镜 / 奶油贴纸
【画幅】1920×1080（16:9 横屏）
【时长】6 秒，动画确定性、首尾可循环

【视觉与设计规范】
# cream-webcam-overlay

- 构图：Canvas 底 + 10px Ink 外框；角落一枚 Paper 圆形摄像头贴纸（4px Ink 描边 + 硬投影），四角可选（top-right 默认），遵守 120/74/168 安全区；mono 角标 CAM 01。
- 动效：外框淡入 → 圆形 back.out(1.4) 弹性落位 → 一次 1.035 强调 → Lime 小三角指示器最后弹出锁定 → 5.5s 整体淡出 0.28s。
- 变量：position / size / borderWidth / showPip（已丢弃 accent/background/foreground 颜色变量，奶油调色板固定）。
- 字体：camera mask 与角标用 IBM Plex Mono 20px 元数据层级；无 @font-face、无本地 ttf。

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
