# 斜角展示台（3D Hero）

> 分类：3D 大字·镜头与转场 ｜ 时长：5s ｜ 在线预览：https://maning789link.top/station.html

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】斜角展示台（3D Hero）
【分类】3D 大字·镜头与转场
【用途】企业宣传场景的镜头与转场：斜角展示台（3D Hero）。
【标签】hero3d-tilt-showcase
【画幅】1920×1080
【时长】5 秒，动画确定性、首尾可循环

【视觉与设计规范】
- ID: hero3d-tilt-showcase
- 风格：3D Hero：纯黑底 #0A0A0B + 正绿强调 + 点阵底；perspective 1400px，卡片沿 Z 轴散布并叠 translateZ，运镜后定格。
- 动效：3D hero token（#0A0A0B + 正绿 + 点阵底）。与 float-cards 的中心散布构图区分：左 720x860 大卡 rotationY 64→16° 翻入 + 底部椭圆投影，右侧文字栏，world rotationX 7→2 / rotationY -7→-2 运镜 2.4s 定格。

【可改文案】标题（默认「一条管线跑完整个发布日」）、要点列表（默认「脚本到成片全自动,模板库随取随用,数据次日自动复盘」）、总时长（默认「5」）

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
