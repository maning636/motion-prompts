# 第三方组件与授权说明（NOTICE）

本仓（Motion Prompts）包含或依赖以下第三方组件。
**本仓的许可协议不授予对下列任何第三方资源的权利**；
它们各自受其原始许可约束。

---

## 一、GSAP 动画库

- 组件：`templates/_lib/gsap.min.js`
- 版本：GSAP 3.12.7
- 版权：Copyright © 2025 GreenSock / Webflow, Inc.
- 许可：GSAP Standard License（https://gsap.com/standard-license/）

GSAP Standard License 授予全球范围、非独占的使用、复制、展示与实现许可，
用于在任何网站、Web 应用或数字界面上实现 GSAP 产品。

许可要点（截至 2025-05-30 版本）：
- 允许在各类网站与 Web 应用中使用、复制、实现；
- **不得**移除或篡改 GSAP 文件中的版权声明与品牌标识
  （本仓保留了 `gsap.min.js` 原始文件头的 `@license` 声明，未作改动）；
- **不得**将 GSAP 用于构建"允许用户无需代码即可制作视觉动画"的竞品工具；
- **不得**为逆向工程 GSAP 而制作上述竞品。

> 第三方组件不受本仓许可协议约束，使用者需自行确认其使用场景符合上述条款。

## 二、CustomEase（GSAP 插件）

- 组件：`templates/_lib/CustomEase.min.js`
- 版本：CustomEase 3.14.2
- 许可：同 GSAP Standard License。

## 三、Lottie（lottie-web）

- 组件：`templates/_lib/lottie.min.js`
- 许可：MIT License（lottie-web by Airbnb）

## 四、字体

以下字体文件**不随本仓分发**（受字体厂商许可限制）：

| 字体 | 用途 | 状态 |
|---|---|---|
| MiSans SemiBold | 模板正文/标题字体 | 未分发，模板改用系统字体回退栈 |
| 美呗嘿嘿体（MEBHeiHeiTi） | 手写/标题风格字体 | 未分发，模板改用系统字体回退栈 |

模板中的 `@font-face` 声明已改为系统字体回退栈，在 Windows / macOS 上
会使用 PingFang SC / Microsoft YaHei / 苹方 等系统字体正常显示。

如果你手上有授权，请自行在 `templates/_fonts/` 下放置字体文件——
模板会优先使用它们（未放置时自动走系统回退）。

## 五、示例音效

- 组件：`templates/_lib/sfx-samples.js`（如随仓分发）
- 来源：Mixkit 免费音效库
- 许可：Mixkit Sound Effects Free License（免署名、可商用）
- 逐条来源与原始链接见 `templates/_lib/sfx/ATTRIBUTION.md`

## 六、hyperframes 渲染器

- 用于把模板 HTML 离线渲染成 MP4
- **不在本仓分发**，见预览站首页说明
- 许可：MIT License

---

## 本仓自有内容

除上述第三方组件外，本仓的模板 HTML、提示词、样片、说明文档，
著作权归「老马AI研习社」所有，适用本仓 [LICENSE](LICENSE)。

---

## 素材分发状态更新（2026-11-25）

本仓此前公开分发过全部动效模板与可嵌入组件。自 2026-11-25 起：

- **公开内容**：600 个提示词（`prompts/`）、效果预览素材（`assets/`）、10 条样例模板（`templates/`）；
- **不再公开分发**：1047 个完整动效模板与 97 个可嵌入组件 —— 需联系作者获取（公众号「老马AI研习社」后台回复「微信」）；
- **LICENSE 中关于模板的条款对已公开分发过的历史版本继续有效**：此前已获取并使用的，不受本次调整影响；
- 本次调整后**新获取或二次分发**模板与组件，需联系作者授权。

第三方组件（GSAP、hyperframes 等）的授权条款见上方内容，不受本次调整影响。
