# neon-terminal-type 荧光终端打字卡

荧光绿口播包装族的"自有签名"模板：macOS 风终端窗口内逐字打字 → 绿色高光横扫（回车执行）→ 输出行 cascade → 状态行弹入，光标闪 3 次后定格。

## 视觉
- 背景近黑蓝 `#0A0D12`；终端体 `#0D1117`；标题栏 `#12161C`；圆角 16px。
- 主色 `#10B981`，发光高亮 `#34D399`，浅色点缀 `#A7F3D0`，辅助灰 `#9CA3AF`。禁琥珀橙。
- 终端窗：1px 主色描边 + `rgba(16,185,129,...)` 外发光 + 极轻扫描线（alpha 0.035）。
- 标题组左上：英文小标签（主色/全大写/加字距/前缀短横）+ 白色粗体中文标题，`titleAccent` 子串染绿带下划线辉光。
- 命令行：绿色 `❯` 提示符 + MEBHeiHeiTi（Consolas 兜底声明）命令文本 + 绿色方块光标。
- 输出行绿色 `▸` + 灰白文字；状态行 `✓` + 绿色发光文字。

## 动画节奏（默认 6s）
0.3s 标题淡入上移 → 0.7s 终端升入 → 1.2s 逐字打字（0.05s/字，光标在文本流内跟随）→ 打字毕横扫 0.3s → 输出行 0.25s 间隔 cascade（淡入+右移 8px）→ 状态行 back.out 弹入+发光脉冲 → 光标闪 3 次常亮 → 定格至 `duration` 结束。

## 技术要点
- 命令文本 JS 同步拆逐字 span（空格转 NBSP 防 inline-block 塌宽），`tl.set(display)` + opacity 淡入排进 paused 时间线，可寻帧。
- 时间线末端 `tl.set('#root',...,DUR)` 占满 data-duration，防超出末端 seek 黑帧。
- MEBHeiHeiTi 的 @font-face 带 `font-weight: 100 1000`（防合成粗体实心块）。
- duration 改写在渲染管线层生效（复制 index.html 改 data-duration）。
