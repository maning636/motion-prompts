# 提示词组装清单（教学外壳）

> 分类：教学外壳·图解与流程 ｜ 时长：5s ｜ 在线预览：https://maning789link.top/station.html

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】提示词组装清单（教学外壳）
【分类】教学外壳·图解与流程
【用途】知识口播场景的图解与流程：提示词组装清单（教学外壳）。
【标签】prompt-assembly-list
【画幅】1920×1080
【时长】5 秒，动画确定性、首尾可循环

【视觉与设计规范】
- ID: prompt-assembly-list
- 风格：深色设计规范文档风 #0E100F + 荧光绿 #00FF00：顶部 mono 导航节点 + 幽灵大序号 + 演示窗取景框；元素依序入场后定格。
- 动效：深色规范风。行格式「中文描述|EN TAG」，行 1360px 宽、顶部分隔线；入场 stagger 到 opacity .3（未点亮态），0.95s 起每 0.3s 点亮一行：opacity→1 + accent 左条 scaleY + chip backgroundColor 填 accent 文字转深（GSAP 颜色补间，seek-safe）。全部点亮后定格。

【可改文案】标题（默认「把原理拼成提示词」）、行（默认「舞台·深色底加星空|SCENE,排列·离中心决定一切|DISTANCE,轮转·先快后慢|POWER4.OUT,定格·中心放大加光晕|FOCUS LOCK,声音·经过中心敲一下|POSITION→TICK,交付·单文件直接跑|DELIVER」）、眉题（默认「STEP 03 · ASSEMBLE THE PROMPT」）、右上角码（默认「00:56 → 01:12
逐行点亮」）、总时长（默认「5」）

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
