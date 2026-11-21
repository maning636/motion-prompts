# step-breakdown-card · 步骤拆解卡（教学外壳）

深色规范风。左 820×540 截图框（image 槽），标注点/引线用 SVG（dot accent 圆 + line stroke-dashoffset 描画 0.5s），标注签 3 个预设槽位；底部暗卡「先提出 N 个问题」+ chip 阵列；右侧 380px 竖排目录（行 opacity .42，当前步 1 + accent 左条 scaleY）。右上 SCENE 编号+时间码 mono 小字。演完定格。

- 变量: stepNo, title, img1, notes, questions, toc, timeRange, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
