# 碟片播放器场景（模式特效）

> 分类：纪录片皮影·封面与卡片 ｜ 时长：5s ｜ 在线预览：https://maning789link.top/station.html

把下面整段提示词粘贴给任意 AI（Claude Code / Codex / 豆包 / DeepSeek……）即可生成同款动效。

---
你是一位顶级前端动效工程师。请用 HTML + CSS + GSAP（CDN 引入）实现下面这个视频动效，输出一个自包含的单文件 HTML。

【动效名称】碟片播放器场景（模式特效）
【分类】纪录片皮影·封面与卡片
【用途】短视频引流场景的封面与卡片：碟片播放器场景（模式特效）。
【标签】vinyl-disc-player
【画幅】1920×1080
【时长】5 秒，动画确定性、首尾可循环

【视觉与设计规范】
- ID: vinyl-disc-player
- 风格：皮影档案风：牛皮纸底色 + 黑/暗红双色 + 皮影剪影元素；标题用衬线大字，数字用等宽字体；动效以淡入/滑移/描边为主，节奏稳。
- 动效：深底 #0d0f0d + 金 #f3d394 + 纸白（原型 acceptance/vinyl-prototype-ref.html 移植）。同封面四用：放大铺底（brightness .76 + tint + vignette）、底部 scaleY(-1) 镜面倒影（blur 2.5 + 横向细纹 + mask 渐隐）、556px 方形封面、556px 半透明碟（opacity .82 + repeating-radial 同心纹 + conic 高光）。hub 为多层 radial 透明 CD 环 + backdrop blur 2.4 + 非对称乳白高光（mix-blend screen）。0.6.x 契约禁 CSS infinite：全部运动挂主 paused timeline 的 master onUpdate 按 t 确定性求值——碟 14s/圈匀速、歌词 2s/行上滚当前句金色 36px 光晕（cur/near 类切换）、56 柱 scaleY 确定性周期相位、倒影细纹 4.8s 往返；6s 约推进 3 行后定格末帧，无 fade-out。

【可改文案】歌名（默认「第 57 次取消发送」）、歌手/副标（默认「AI COVER · LO-FI」）、歌词（默认「凌晨的站台还没有人,风把车票吹成了船,我把再见练习了很多遍,第 57 次取消发送,月亮蹲在铁轨尽头,数我没说出口的晚安,如果告别有回程票,你会不会也回头看」）、总时长（默认「5」）

【技术要求】
1. 先画出动画最完整时刻的静态布局，再编写 GSAP 时间线；动画必须是确定性的（同一时刻刷新，画面一致）。
2. 文案、数字、颜色集中定义为 JS 常量放在文件顶部，方便二次修改。
3. 只输出 HTML 代码，不要解释，不要省略。
