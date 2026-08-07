# SWOT 四宫格

> 分类：信息卡片 ｜ 时长：6s ｜ 在线预览：https://motion.maning789link.top

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】SWOT 四宫格
【分类】信息卡片
【用途】2×2 战略分析网格，S/O 正向强调，W/T 中性呈现，适合产品/业务复盘。
【标签】SWOT / 战略 / 分析 / 网格
【画幅】1920×1080（16:9 横屏）
【时长】6 秒，动画确定性、首尾可循环

【视觉与设计规范】
# SWOT 四宫格视觉规范

## 方向

2×2 战略分析网格，S/O 用 accent 色传递正向，W/T 用中性色，整体保持编辑感。

## Palette

- Background: `#12100E`
- Foreground: `#F4EFE7`
- Accent: `#00FF00`
- Muted: `rgba(244,239,231,0.5)`
- Cell border: `rgba(244,239,231,0.12)`
- Positive cell border: accent 28% 透明度

## Typography

- 标题：`IBM Plex Mono` 700，64px
- 副标题：`IBM Plex Mono` 400，28px，Muted 色
- 字母 S/W/O/T：`IBM Plex Mono` 700，72px
- 象限名：`IBM Plex Mono` 500，18px，letter-spacing 0.16em，大写
- 列表项：`IBM Plex Mono` 400，24px

## Layout

- 顶部标题区 + 下方 2×2 网格
- 网格高度 720px，gap 24px
- 每个 cell 内边距 36px 40px
- S/O 字母用 accent 色，W/T 用 foreground

## Motion

- 标题先入场
- 四个 cell 依次从下方弹入，错位 0.15s
- 每格内部：字母 → 象限名 → 列表项依次淡入
- 结束前整体上移淡出

## Avoid

- 不用圆点列表，统一用短横线前缀
- 不用竖线分隔
- 每格不超过 4 条

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
