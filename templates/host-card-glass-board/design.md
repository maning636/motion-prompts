# host-card-glass-board · 净室自研

## 设计意图
左侧主讲人占位 + 右侧玻璃拟态信息板的开场卡模板。左半是「角色 chip + 圆环
首字头像 + LIVE 徽标 + 姓名 + 头衔」的人物卡；右半是一块 `backdrop-filter:
blur(24px)` 的玻璃面板，内部 3–4 条议程条目以 `stagger 0.15s` 从右向左错峰
浮现。适用场景：讲师介绍、直播 / 发布会开场、播客预告、会议 agenda。

## 视觉语言
- 深色数据风：`background #0E1116`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字、chip 与徽标加粗
- 图形语言：径向光斑（accent + fg 双色）+ 点阵底 + 圆环首字头像 +
  玻璃面板（`backdrop-filter` + `color-mix` 描边 + 内高光 + 深投影）
- 安全边距 ≥72px（实际左右 96px、顶 56、底 56）

## 动效说明（自建运动语法）
- 左半入场：`#host` `opacity 0→1 + y 28→0`，`power3.out` 0.6s（t=0.1）
- 头像：`back.out(1.4)` 0.6s（t=0.25）+ 双层圆环错峰淡入（stagger 0.1）+
  LIVE 徽标 `back.out(1.8)` 弹入
- 右半入场：`#board` `opacity 0→1 + y 32→0`，`power3.out` 0.65s（t=0.5）
- **板内条目错峰浮现**：`.boardItem` `opacity 0→1, x 20→0`，`power3.out`
  0.55s，`stagger 0.15s`（t=0.85 起）——四条条目在 1.7s 内依次浮出
- 结尾：`#board` 光晕轻微呼吸（`boxShadow` 增强，`sine.inOut` 0.6s，t=3.4），
  整体停留 ~2s 保持可读，总时长 6s

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| hostName | string | 林知远 | 姓名，首字进入头像 |
| hostTitle | string | AI 产品负责人 | 头衔 |
| hostRole | string | 主讲 | 角色 chip 文案 |
| boardTitle | string | 今天聊什么 | 玻璃板标题 |
| boardItems | string（换行分隔）| 4 条 | 条目，最多 4 行、最少 3 行 |
| accent | color | #00FF00 | 强调色（头像光晕 / chip / num / LIVE） |
| background | color | #0E1116 | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明 / webm / mp4 |

## 关键 id
- `#host`：左侧主讲人卡整体
- `#hostAvatar`：头像圆盘
- `#hostInitial`：首字
- `#hostName` / `#hostTitle` / `#hostRole`：文本节点
- `#board`：右侧玻璃板
- `#boardTitle` / `#boardIndex`：标题与索引
- `.boardItem`：板内条目
- `#footLeft` / `#footRight`：脚注

## 净室自查记录
1. **功能理解来源**：仅依本任务卡的功能意图描述
   「左侧主讲人占位+右侧玻璃拟态信息板，板上条目错峰浮现」；未访问任何
   外部仓库源码或公开动效模板。
2. **与任何外部实现无代码可比**：DOM 结构（`.host / .avatar-wrap / .board /
   .boardItem`）为本模板自创；CSS 变量、关键帧、缓动函数全部按本项目运动
   语法重新编排。
3. **视觉自建过程**：
   - 头像造型为「圆环 + 首字」—— 通用「身份识别」符号，不带任何既有模板特征；
     圆环用 `color-mix` 半透明描边，光晕通过 `box-shadow` 与 `radial-gradient`
     生成。
   - 玻璃面板使用 `backdrop-filter: blur(24px) saturate(140%)` + 半透明
     `linear-gradient` 底 + `color-mix` 描边 + 内高光 `::after` 分割线，
     与项目内其他玻璃拟态风格（`before-after-stat` / `bed-echo-blur`）
     一致。
   - 条目错峰用 `stagger 0.15s + x 20→0` 实现，方向与「条目向右滑入」直觉
     一致，与左侧主讲人的 `y` 位移方向解耦。
4. **命名与曲线**：class 命名 `host / avatar-wrap / board / boardItem`，
   缓动 `power3.out / power2.out / back.out / sine.inOut` 全部 GSAP 内置；
   时长 6s 与 meta.json `duration` 字段一致。
5. **合同一致性**：
   - `data-composition-variables` 单引号 JSON 数组 + 三颜色 + hidden `exportMode`；
   - GSAP `3.14.2` CDN；字体 `../_fonts/MiSansSemiBold.ttf` +
     `../_fonts/MEBHeiHeiTi.ttf`；
   - 1920×1080、`#root` + `#scene`、`__timelines.main` paused 注册；
   - 三变量 JS `setProperty` + CSS `var()` 双端接线；
   - 总时长 6s。
6. **结论**：clean-room implementation；功能与「讲师开场卡 + 玻璃议程板」
   等价，任何一帧的 DOM/CSS/曲线/时长都不是外部实现的复刻；无上游
   attribution，license 为 `Proprietary - FDE`。
