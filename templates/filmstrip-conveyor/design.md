# filmstrip-conveyor · 净室自研

## 设计意图
横向胶片齿孔条作为传送带叙事模板。画面中线放一个「高亮槽」（带强调色
描边 + 顶部绿色小三角 + 引线），一条长胶片带（顶/底两条带齿孔的轨道 +
N 个内容帧）从屏幕左向右推进，每格胶片经过高亮槽时，胶片槽的中央特征
信息（年份 / 标题 / 简述）随之切换，底部计数器 `01 / 07` 同步刷新。

适用场景：历程叙事（团队年表 / 项目里程碑 / 产品迭代 / 城市变化）、
合集叙事（十本书 / 十个客户 / 十张专辑）。

## 视觉语言
- 深色数据风：`background #12100E`、`foreground #F4EFE7`、`accent #00FF00`
  （三变量必须 JS `setProperty` 接线 + CSS `var()` 消费带原值兜底）
- 字体：`MEBHeiHeiTi` 作正文、`MiSans SemiBold` 作数字与 chip 加粗
- 图形语言：胶片带顶/底轨道用 `repeating-radial-gradient` 打孔形成齿孔
  节奏；齿孔底部再叠一道极淡的荧光绿长条（`background-size: 180px`），
  模拟「齿孔与底片之间的光线」；中央高亮槽用 1.5px 内嵌 `inset` 边 + 外
  发光，营造「锁孔」感；左右两侧 96px 羽化遮罩，让胶片带像滑入/滑出
  视野。
- 安全边距 ≥72px（左右 96px、顶 56px eyebrow + 110px title-block、底 64px）

## 动效说明（自建运动语法）
- 入场（0–1.0s）：
    - eyebrow `y -8 → 0` 0.45s `power2.out`
    - 标题 `y 24 → 0` 0.55s `power3.out`、副标题 `y 18 → 0` 0.45s `power2.out`
    - 中央高亮槽 / 顶部 pip 各自淡入 0.4s
    - 底部脚注 / 计数器错峰（stagger 0.06s）入场
    - 当前帧特征信息 `fYear / fTitle / fCap` 错峰（stagger 0.08s）入场
    - 每帧胶片以 `scale 0.96 → 1.0 + opacity 0 → 1`、stagger 0.04s 入场
- 主轴滚动（1.4–5.4s，4.0s）：
    - strip 整体 `translateX(768 → -2304)`（对 7 帧数据），`power1.inOut`
    - onUpdate 实时计算当前落在中线的帧 idx（基于 960 中线 + frameStep
      384px 反推），给该帧加 `.active`（accent 边 + 外发光）
    - 切换 `fYear / fTitle / fCap` 与底部 `nowIdx`（与 onUpdate 解耦：
      `lastIdx` cache，仅在 idx 变化时改 DOM）
    - 时间进度线 `--p` 从 0% → 100%，accent 高亮 + 外发光
- 结尾（5.55–6.0s）：strip 再轻微 `translateX(-60)`（`power2.in`），营造
  「胶片还没拍完、继续走」的余韵

总时长 6s（meta.json `duration = 6`），符合 §2.4 停留 ≥0.8s 可读。

## schema 字段
| id | type | 默认 | 说明 |
|---|---|---|---|
| title | string | 一条胶片里的城市演变 | 主标题 |
| subtitle | string | 十年，十帧，十个路口 | 副标题 |
| frames | string (JSON 数组) | 7 帧示例 | 每帧 `{year, title, caption}`；最少 2 帧，少于 3 自动用 fallback 凑齐 |
| accent | color | #00FF00 | 强调色（高亮槽边 / pip / 当前帧边 / 进度线 / 年份） |
| background | color | #12100E | 背景色 |
| foreground | color | #F4EFE7 | 文字色 |
| exportMode | enum（hidden） | transparent | 透明/webm/mp4 |

## 净室自查记录
1. **功能理解来源**：仅依 `CLEAN-ROOM-DEV-PLAN.md` §3 C 类中卡名
   `filmstrip-conveyor` 的功能意图「胶片条传送带式横向滚动叙事」与本任务
   一句话意图，未访问任何外部仓库源码。
2. **与任何外部实现无代码可比**：
   - DOM 结构（`.conveyor / .strip / .rail / .frame / .highlight / .pip /
     .feature / .counter / .foot-row / .timeline-rail`）为本模板自创
   - CSS 关键帧、缓动函数、时长编排按本项目 §2.4 运动语法重新设计
   - 齿孔使用 `repeating-radial-gradient` + 顶/底双轨道，是项目内通用
     图形语言（与 `bar-chart-grow` 等模板的点阵底纹风格同源，但用途不同）
3. **视觉自建过程**：
   - 中央高亮槽造型：`360×280` 圆角矩形 + 内嵌 1.5px accent 边 + 外发光
     —— 是「锁孔」通用视觉语义
   - 顶部小三角 pip + 上下引线，把高亮槽和特征信息绑成一组，是项目
     「强调目标元素」的通用做法
   - 胶片带使用 flex 排列 + GSAP 滚动主轴，每帧 `360px + 24px margin`，
     是项目内「序列推进」的通用节奏单位
   - 当前帧特征信息（`.feature`）放在 conveyor 外的兄弟节点，避免被
     `overflow:hidden` 裁剪，是排版细节处理
4. **命名与曲线**：class 命名遵循 kebab-case + 语义英文；缓动 `power2.out /
   power3.out / power1.inOut / power2.in` 全部 GSAP 内置；总时长 6s 与
   meta.json `duration` 一致。
5. **结论**：clean-room implementation。功能与「胶片条传送带式横向滚动
   叙事」等价 —— 观众能识别这是一条胶片条在横向推进、每格承载一个画面；
   但 DOM 结构、CSS 曲线、时长编排、字段定义均为本项目自有体系，不复刻
   任何外部实现。无上游 attribution，license 为 `Proprietary - FDE`。