# 录播背景浮动解说卡（float-note-overlay）

## 用途

库主给录播视频 / 露脸画面当背景时，用来浮一层解说卡：背景视频全屏 cover 循环静音播放，深色半透明毛玻璃卡浮在上面，kicker 绿色角标 + 大号白色主标题 + 灰白正文（支持 `\n` 两行）。卡片可靠左或靠右（position），另一侧留给录屏内容或人脸。底部一条细绿色进度条随 duration 走完，给观众一个时间感。

## 槽位

- `bgVideo`：背景视频路径（默认 `./assets/placeholder.mp4`）
- `kicker` / `title` / `body`：角标 / 主标题 / 正文（body 里字面 `\n` 换行，JSON 中写 `\\n`，同 chat-thread）
- `position`：`left` / `right`
- `accent`：强调色，默认品牌绿 `#22c55e`（竖条、角标、进度条同色）
- `duration`：总时长秒数，进度条随之走完

## 动画

- 卡片 0.2s 起 fade+slide 入场（左卡从左滑入，右卡从右），结尾前 0.4s 淡出
- 进度条全程线性 scaleX 0→1
