# 碟片播放器场景（模式特效）

> 分类：产品演示 ｜ 时长：6s ｜ 在线预览：https://motion.maning789link.top

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】碟片播放器场景（模式特效）
【分类】产品演示
【用途】同封面放大铺底 + 底部镜面水波倒影 + 半露旋转碟片（透底图同心纹 + conic 高光）+ 透明 CD hub，右侧《》金字标题与上滚歌词当前句金色放大，底部 56 柱正弦频谱 + SVG 播放控件。音乐可视化、歌单视频用。
【标签】碟片 / 播放器 / 歌词高亮 / 频谱
【画幅】1920×1080（16:9 横屏）
【时长】6 秒，动画确定性、首尾可循环

【视觉与设计规范】
深底 #0d0f0d + 金 #f3d394 + 纸白（原型 acceptance/vinyl-prototype-ref.html 移植）。同封面四用：放大铺底（brightness .76 + tint + vignette）、底部 scaleY(-1) 镜面倒影（blur 2.5 + 横向细纹 + mask 渐隐）、556px 方形封面、556px 半透明碟（opacity .82 + repeating-radial 同心纹 + conic 高光）。hub 为多层 radial 透明 CD 环 + backdrop blur 2.4 + 非对称乳白高光（mix-blend screen）。0.6.x 契约禁 CSS infinite：全部运动挂主 paused timeline 的 master onUpdate 按 t 确定性求值——碟 14s/圈匀速、歌词 2s/行上滚当前句金色 36px 光晕（cur/near 类切换）、56 柱 scaleY 确定性周期相位、倒影细纹 4.8s 往返；6s 约推进 3 行后定格末帧，无 fade-out。
【可改文案】主视觉（一图四用）（默认「./placeholder-1.pn」）、歌名（默认「第 57 次取消发送」）、歌手/副标（默认「AI COVER · LO-FI」）、歌词（逗号分隔逐句）（默认「凌晨的站台还没有人,风把车票吹成了船」）、强调色（书名号/当前句/频谱）（默认「#f3d394」）、总时长(秒)（默认「6」）

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
