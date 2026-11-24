# _lib/sfx/ 采样来源与授权

> demo 运行时用的是 `sfx-samples.js` 里的 base64 内嵌版（由本地 mp3 生成）。
> 本文件保留来源与授权记录。

全部采样来自 **Mixkit 免费音效库**（Mixkit Sound Effects Free License：
免署名、可商用）。基础 11 个音色直接从 Mixkit 预览 CDN 下载并做归一化处理
（去头部静音 -45dB 阈 / 峰值 -3dB / 192k 44.1kHz 重编码）；
`pk:*` 为 Mixkit 同名类别采样，经本地归一化重编码后内嵌。

| 本库音色 | Mixkit 原名 | URL |
|---|---|---|
| whoosh | Fast small sweep transition | https://assets.mixkit.co/active_storage/sfx/166/166-preview.mp3 |
| swipe | Short transition sweep | https://assets.mixkit.co/active_storage/sfx/175/175-preview.mp3 |
| pop | Dry pop up notification alert | https://assets.mixkit.co/active_storage/sfx/2356/2356-preview.mp3 |
| click | Camera shutter click | https://assets.mixkit.co/active_storage/sfx/1133/1133-preview.mp3 |
| tick | Clock ticker single | https://assets.mixkit.co/active_storage/sfx/1061/1061-preview.mp3 |
| slam | Short bass hit | https://assets.mixkit.co/active_storage/sfx/2299/2299-preview.mp3 |
| ding | Crystal chime | https://assets.mixkit.co/active_storage/sfx/3108/3108-preview.mp3 |
| typekey（双样本） | Mechanical typewriter single hit / Typewriter soft hit | https://assets.mixkit.co/active_storage/sfx/1382/1382-preview.mp3 · https://assets.mixkit.co/active_storage/sfx/1366/1366-preview.mp3 |
| scratch | Pen marker line | https://assets.mixkit.co/active_storage/sfx/2998/2998-preview.mp3 |
| paper | Paper quick movement | https://assets.mixkit.co/active_storage/sfx/2380/2380-preview.mp3 |

无采样、仍走 sfx.js 合成的音色：**riser / ping / lowpad**。

typekey 是双样本（hard/soft），引擎连打时自动交替（防机枪感）。
