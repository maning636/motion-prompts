# neon-question-cards 荧光绿四角问题卡

- 定位：口播 overlay，顶部居中标题 + Q01–Q04 四角问题卡，中间留空给真人出镜。
- 基底：imgBg 有图则 cover 铺满 + 55% 黑色压暗；空则深黑蓝 #0A0D12 + 径向暗角。
- 卡片：#12161C 填充，16px 圆角，1px 主色描边 rgba(16,185,129,.85)，外发光 box-shadow。
- 编号：Q01–Q04，MiSans SemiBold 26px，主色 #10B981 + 字距 + 发光。
- 问题：白色 MiSans SemiBold 34px 单行，超出省略号防破版。
- 标题：MiSans SemiBold 60px 白色整句，titleAccent 命中子串染 #34D399 发光绿 + 下划发光条。
- 动画：标题淡入上移 → 四卡 stagger（0.18s）从各自侧方滑入（左列从左、右列从右）→ 定格。
- 字体：MiSans SemiBold（标题/编号/问题）+ MEBHeiHeiTi（兜底字族，font-weight 100 1000 声明）。
- 禁用：琥珀橙、repeat:-1、系统字体回退、<br> 强制换行。
