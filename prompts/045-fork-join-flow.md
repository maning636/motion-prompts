# 并行 / 汇合流程

> 分类：流程图 ｜ 时长：6s ｜ 在线预览：https://motion.maning789link.top

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】并行 / 汇合流程
【分类】流程图
【用途】顶部 Coordinator 同时分叉到多个并行 Worker，底部汇合为 Merge 节点，强调并发与同步等待。
【标签】并行 / 汇合 / 流程图 / 并发
【画幅】1920×1080（16:9 横屏）
【时长】6 秒，动画确定性、首尾可循环

【视觉与设计规范】
# 并行 / 汇合流程视觉规范

## 方向

顶部 Coordinator 同时分叉到多个并行 Worker，底部汇合为 Merge 节点，强调并发与同步等待。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Border: `rgba(244,239,231,0.18)`
- Link: `rgba(244,239,231,0.14)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 副标题：24px，opacity 0.55
- 节点名：22px，600

## Layout

- 标题区 + SVG 流程区
- Coordinator 居中顶部，Worker 横向等距排列，Merge 居中底部
- 节点框 200–280×72px，连线用 path 绘制

## Motion

- 标题入场
- 节点依次缩放弹出
- 连线从上游到下游依次生长
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、glow
- Worker 数建议 2–5，过多会拥挤

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
