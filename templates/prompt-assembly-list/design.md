# prompt-assembly-list · 提示词组装清单（教学外壳）

深色规范风。行格式「中文描述|EN TAG」，行 1360px 宽、顶部分隔线；入场 stagger 到 opacity .3（未点亮态），0.95s 起每 0.3s 点亮一行：opacity→1 + accent 左条 scaleY + chip backgroundColor 填 accent 文字转深（GSAP 颜色补间，seek-safe）。全部点亮后定格。

- 变量: title, rows, accent, duration
- 字体: MEBHeiHeiTi + MiSans SemiBold（本地硬链接）
- 动效: 动效段 1-3s，演完定格最后一帧，无收尾 fade-out
