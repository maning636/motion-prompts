# 复杂流程

> 分类：知识讲解 ｜ 时长：6s ｜ 在线预览：https://motion.maning789link.top

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】复杂流程
【分类】知识讲解
【用途】6-9 步线性 pipeline 流程图，可标注每步耗时并高亮核心 cluster，适合技术架构讲解。
【标签】流程 / pipeline / 架构 / 耗时
【画幅】1920×1080（16:9 横屏）
【时长】6 秒，动画确定性、首尾可循环

【视觉与设计规范】
# 复杂流程视觉规范

## 方向

6-9 步线性 pipeline 流程图，可标每步耗时并高亮核心 cluster。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `rgba(244,239,231,0.5)`
- Track / border: `rgba(244,239,231,0.10~0.18)`

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 节点名：`IBM Plex Mono` 700，24px，大写
- 耗时：`IBM Plex Mono` 500，16px
- 步骤编号：`IBM Plex Mono` 500，14px，letter-spacing 0.12em

## Layout

- 标题区 + 流程区
- 节点横向等距分布，节点框 220×120px
- 节点之间用基线连接
- 高亮节点边框和背景用 accent 色

## Motion

- 标题入场
- 基线从左到右生长
- 节点依次从下方弹入
- 高亮节点保持 accent 状态
- 结束前整体上移淡出

## Avoid

- 步骤数建议 5-7，过多会拥挤
- 不使用 3D 管道、弯曲连线
- 不添加图标装饰

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
