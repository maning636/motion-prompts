# API 调用

> 分类：产品演示 ｜ 时长：6s ｜ 在线预览：https://motion.maning789link.top

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】API 调用
【分类】产品演示
【用途】左右分栏展示 API 请求与响应 JSON，适合演示 REST/JSON 接口调用。
【标签】API / Mock / JSON / 接口
【画幅】1920×1080（16:9 横屏）
【时长】6 秒，动画确定性、首尾可循环

【视觉与设计规范】
# API 调用 Mock 视觉规范

## 方向

左右分栏展示 API 请求与响应 JSON，适合演示 REST/JSON 接口调用。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Panel background: `rgba(244,239,231,0.04)`
- Border: `rgba(244,239,231,0.12)`
- Code string: `#A8C9BF`
- Code key: `#F4EFE7`

## Typography

- 标题：64px，700
- 方法标签：18px，800
- JSON：18px，monospace

## Layout

- 标题区 + 左右两栏
- 左侧 Request，右侧 Response
- 每栏顶部显示 method 与 endpoint

## Motion

- 标题入场
- 左右面板依次滑入
- 代码行打字机式出现
- 结束前淡出

## Avoid

- 不使用真实敏感数据
- 保持代码可读

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
