# 章节大标题·皮影档案

> 类别：docu / title ｜ use-case：demo
> 时长：6.0s ｜ 帧率：30fps ｜ 分辨率：1920×1080
> 主素材：无主播视频（皮影档案静态素材）

## 设计意图
老电影纪录片章节大标题。米白纸底 + 细网格 + 胶片噪点 + 角落暗影。顶部"第 一 章"序号 → 巨型宋体标题（拉幕式入场）→ 朱砂红细线 → 衬线斜体副标题 → 右下朱砂圆形印章。

## 6 层结构
- L1 背景：paper-base 米白 + paper-grid 48px 网格 + grain-layer 胶片噪点 + paper-age 角落暗影
- L2 内容：顶部 chapter-no（"第 一 章"+" — — "装饰线）+ 中央 chapter-title（220px 宋体巨号）+ subtitle（28px 衬线斜体）
- L4 强调：朱砂红 accent-line 600px + 右下圆形 stamp（旋转 -8°）
- L5 装饰：左 corner-mark "DOCU · 001" + 右 date-mark "2026 / 08 / 31"
- L6 环境：vignette 渐暗

## 关键参数
| 参数 | 默认值 | 调节手感 |
|---|---|---|
| accent | #b91c1c（朱砂红） | 换成 #1e3a8a 藏蓝更肃穆 |
| chapter-title 字号 | 220px | 调到 280 让标题更"压" |
| grain 不透明度 | 0.25 | 调到 0.4 让胶片感更重 |
| 印章文字 | "纪录片 2026" | 用作变量传"机密/绝密/已核实"等 |

## 已知坑
- ⚠️ **无 `<video>` 元素**——B族纯静态素材为主，符合契约（bgVideo 变量未声明）
- ⚠️ 主标题用 `clip-path: inset(0 0 100% 0)` 拉幕入场（0→100%），需保证 z-index 顺序：grid < grain < title
- ⚠️ 印章 HTML 里用 `<br/>` 分两行（"纪录片"+"2026"），想换文字改 index.html L4 块

## 复用指引
- B01-B06（docu-title-*）共用同一 paper-bg/grain 资源 + 相同的米白+朱砂强调色体系
- 适合场景：纪录片/口播中的"章节开头"/"主题大标题"