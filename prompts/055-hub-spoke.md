# Hub & Spoke

> 分类：知识讲解 ｜ 时长：6s ｜ 在线预览：https://motion.maning789link.top

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】Hub & Spoke
【分类】知识讲解
【用途】中心 Hub 圆环，外围 6 个 Spoke 辐射分布，重点 Spoke 用 accent 连线与圆点高亮，适合展示中心化系统与工具集成。
【标签】Hub / Spoke / 中心化 / 工具集成
【画幅】1920×1080（16:9 横屏）
【时长】6 秒，动画确定性、首尾可循环

【视觉与设计规范】
# Hub & Spoke 视觉规范

## 方向

中心 Hub 圆环，外围 6 个 Spoke 辐射分布，重点 Spoke 用 accent 连线与圆点高亮，适合展示中心化系统与工具集成。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Spoke dot default: `rgba(244,239,231,0.18)`
- Line default: `rgba(244,239,231,0.12)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- Hub 名：32px，700
- Spoke 名：26px，500

## Layout

- 标题区 + 辐射图
- Hub 居中，Spoke 均匀分布在圆周
- 连线从 Hub 指向每个 Spoke

## Motion

- 标题入场
- Hub 从中心弹出
- 连线依次从中心向外生长
- Spoke 依次弹出
- 结束前整体上移淡出

## Avoid

- 不使用 3D、阴影、曲线
- Spoke 数建议 4–6

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
