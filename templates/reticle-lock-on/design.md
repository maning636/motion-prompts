# reticle-lock-on · 净室自研

## 设计意图
科技感瞄准镜叙事模板。四个 L 形取景框线（corner brackets）从画面
四外的对角方向同时冲入、错峰 0.05s 落位到中央目标卡（target）四角，
到位后超调回弹`咔`地咬合；同时一条半透明扫描线在目标区域横扫一次
作为"搜索→锁定"的过渡。锁定帧：目标卡 + 内圈环 + 中心十字微标
同时点亮，参数标签（4 条，含距离/方位/俯仰/速度 + 4 项指标）从
画外四向错峰弹出，底部状态条确认`LOCK ACQUIRED`。

适用场景：科技/AI 仪表盘、HUD 锁定叙事、关键指标点名、镜头式
聚焦镜头。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字与 chip 加粗
- 图形语言：细线 L 形取景框（stroke-width 4，圆角 0）+
  内层淡线（stroke-width 1，opacity 0.35）+ 中心十字微标 +
  圆角目标卡（radius 14）+ 引线 + 圆点 + 点阵底
- 安全边距 ≥72px（eyebrow top 56 / left+right 96、状态条 bottom 56），
  符合 §2.3

## 动效说明（自建运动语法）
- 入场（角标）：`fromTo({x±380, y±380, scale 1.4, opacity 0})` →
  `{x 0, y 0, scale 1, opacity 1, 0.55s, power3.in}` 错峰 0.05s
- 落位回弹：`to(scale 1.0, 0.32s, back.out(1.7), stagger 0.05)`
- 扫描线：`fromTo({opacity 0, y -160, scaleX 0.4})` →
  `{opacity 1, y +160, scaleX 1, 0.7s, power2.inOut}`，再 `to(opacity 0, 0.18s)`
- 目标入场：`fromTo({opacity 0, scale 0.94})` →
  `{opacity 1, scale 1, 0.45s, power3.out}`
- 目标环：`fromTo({opacity 0, borderColor 透明})` →
  `{opacity 1, borderColor + box-shadow, 0.45s, power2.out}`
- 中心十字：`fromTo({opacity 0, scale 1.4})` →
  `{opacity 1, scale 1, 0.35s, back.out(2)}`（强过冲）
- 锁定闪一下：`to(scale 1.03, 0.22s, power2.out, yoyo, repeat 1)`
- 参数标签：`fromTo({opacity 0, scale 0.92})` →
  `{opacity 1, scale 1, 0.42s, back.out(1.6), stagger 0.10}`
- 状态条：`fromTo({opacity 0, y 12})` → `{opacity 1, y 0, 0.4s, power2.out}`
- 锁定后呼吸：角标 `to(scale 1.05, 1.2s, sine.inOut, yoyo, repeat 1)`，
  目标环 `to(opacity 0.55, 1.1s, sine.inOut, yoyo, repeat 1)`
- 结尾：呼吸 ≈4.6s 结束，剩 1.9s 可读；最后给状态条文字加
  `text-shadow 0 0 18px` 强调一次，再 yoyo 回 10px，保留 ≥1s
  可读时长

总时长 6.5s，与 `meta.json duration` 字段一致。

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| eyebrow | string | LOCK ON · 准星聚焦 | 顶头小眉标右侧 |
| targetLabel | string | 核心命中率 | 目标卡的副标（eyebrow 行） |
| targetValue | string | 92.4 | 目标主数字 |
| targetUnit | string | % | 目标单位 |
| targetSub | string | SYSTEM TARGET · 已锁定 | 目标副标（底行） |
| p1Key | string | 响应时延 | 参数 1 名称（左上） |
| p1Val | string | 38 ms | 参数 1 数值（hot） |
| p2Key | string | 回传频率 | 参数 2 名称（右上） |
| p2Val | string | 240 Hz | 参数 2 数值 |
| p3Key | string | 追踪置信度 | 参数 3 名称（左下） |
| p3Val | string | 0.987 | 参数 3 数值（hot） |
| p4Key | string | 信号强度 | 参数 4 名称（右下） |
| p4Val | string | -42 dBm | 参数 4 数值 |
| accent | color | #00FF00 | 强调色（角标/扫描线/十字/参数引线） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 中的一行意图
   「瞄准镜/取景框锁定目标的科技感聚焦」与本任务卡的功能意图描述
   「取景框线从四角收拢锁定中央目标，锁定后目标高亮、参数标签弹出」，
   未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：DOM 结构
   （`target-wrap / target / target-ring / target-cross / bracket.tl.tr.bl.br /
   scanline / params / param.p1-p4 / status-bar`）为本模板自创；CSS
   变量、关键帧、缓动函数、时长编排全部按本项目 §2.4 运动语法
   重新编排。
3. **视觉自建过程**：
   - L 形取景框用 SVG `path d="M0 36 L0 0 L36 0"` 4 段，
     `stroke-width 4`，并加 `drop-shadow` 发光层；这是常见
     「corners bracket」通用图形语言，不带任何既有模板特征。
   - 中央目标卡 = 圆角矩形 + 主数字 + 单位 + 副标；保留 `MEBHeiHeiTi`
     + `MiSans SemiBold` 字系，与项目内其他动效一致。
   - 中心十字微标（cross + 点）= 标准 HUD 锁定符号，不含任何
     上游实现特征。
   - 参数引线用「细线 + 小圆点 + 关键词 + 数值」，左/上/下/右
     四个对称位置，是通用信息密集型动效的常见排版。
4. **命名与曲线**：class 命名 `bracket / scanline / params /
   param / status-bar / target-ring / target-cross`，
   缓动 `power3.in / power2.inOut / power3.out / back.out / sine.inOut`
   全部 GSAP 内置，时长 6.5s 与 `meta.json duration` 字段一致。
5. **结论**：clean-room implementation，功能与「瞄准镜/取景框
   锁定目标」等价；任何一帧的 DOM/CSS/曲线/时长都不是外部实现
   的复刻；无上游 attribution，license 为 `Proprietary - FDE`。