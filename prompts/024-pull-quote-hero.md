# 引用块

> 分类：标题与开场 ｜ 时长：5s ｜ 在线预览：https://motion.maning789link.top

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】引用块
【分类】标题与开场
【用途】全屏引用名人/论文/文档原话，杂志质感的节奏镜头，适合权威背书与金句呈现。
【标签】引用 / 金句 / 权威 / 杂志
【画幅】1920×1080（16:9 横屏）
【时长】5 秒，动画确定性、首尾可循环

【视觉与设计规范】
# 引用块视觉规范

## 方向

全屏引用名人 / 论文 / 文档原话，杂志质感的节奏镜头。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `rgba(244,239,231,0.55)`

## Typography

- 来源标签：`IBM Plex Mono` 500，18px，letter-spacing 0.22em，大写
- 巨型引号：`IBM Plex Mono` 700，220px，opacity 0.10
- 引用正文：`IBM Plex Mono` 500，72px，line-height 1.25
- 强调词：`IBM Plex Mono` 500 italic，accent 色
- 作者名：`IBM Plex Mono` 500，24px
- 作者身份：`IBM Plex Mono` 400，20px，Muted 色

## Layout

- 左侧 160px 安全边距，引用正文最大宽度 1400px
- 来源标签置顶
- 巨型引号装饰位于正文左上方
- 作者信息底部，左侧 accent 短杠 + 两行文字

## Motion

- 来源标签先入场
- 巨型引号缩放淡入
- 正文从下方滑入
- 作者短杠伸长，姓名、身份依次滑入
- 结束前整体上移淡出

## Avoid

- 引用不超过 4 行
- 不添加头像、logo、装饰线框
- 不使用衬线字体（统一 IBM Plex Mono）

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
