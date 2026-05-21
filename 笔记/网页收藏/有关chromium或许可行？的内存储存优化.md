---
来自: "https://forum.archlinuxcn.org/t/topic/15951"
收藏时间: 2026年05月08日 星期五 10:46:42
tags:
  - "网页收藏"
---
> [!note] 摘要
> 这是一篇Arch Linux中文论坛的帖子。作者发现Chromium浏览器在`~/.config/chromium/`下生成了本地AI模型和语音识别相关文件（如`OptGuideOnDeviceModel`、`SODA`等），删除这些文件后体验到了更低的内存占用和更快的响应速度。作者提供了具体的删除命令及防止重新生成的权限设置方法，以释放约3-4GB的磁盘空间。


我翻系统硬盘占用的时候，发现chromium文件夹莫名有一些奇怪的东西，我问了一下AI，发现没用，因为有电子洁癖，所以把它删了，然后发现，浏览器内存占用变低了，也比以前快了。所以想着把我的发现告诉给大家，顺便讨论下是否真的有用。  
ps：我没有统计和比较两者的内存占用和浏览器响应速度，只是体验感受。

---

以下是我的整理：

- `~/.config/chromium/OptGuideOnDeviceModel`  
	是 Chromium 浏览器的**设备端 AI 模型目录**，存放 **Gemini Nano 本地模型权重（weights.bin）**，用于浏览器本地优化与实验性功能。
- `~/.config/chromium/SODALanguagePacks/`  
	这个文件夹存储的是 Chromium 浏览器**本地语音识别 / 合成的语言包**（比如离线语音转文字、TTS 文字转语音的语言数据
- `~/.config/chromium/SODA`  
	是 Chromium 用于存放 **Speech On-Device API（SODA，设备端语音 API）** 核心引擎与数据的目录
- `~/.config/chromium/WasmTtsEngine`  
	是 Chromium 的**WebAssembly 版 TTS 引擎**配置 / 数据文件，用于浏览器内的文字转语音功能（比如朗读网页内容）

我用不到这些功能，以下是删除步骤

1. 删除目标文件，并阻止重新生成
```bash
# 删除所有文件
rm -rf ~/.config/chromium/OptGuideOnDeviceModel
rm -rf ~/.config/chromium/WasmTtsEngine
rm -rf ~/.config/chromium/SODALanguagePacks/
rm -rf ~/.config/chromium/SODA
```
2. 修改文件夹权限，防止被再次创建文件
```bash
# 先创建一个空目录占位
mkdir -p ~/.config/chromium/OptGuideOnDeviceModel
mkdir -p ~/.config/chromium/WasmTtsEngine
mkdir -p ~/.config/chromium/SODALanguagePacks/
mkdir -p ~/.config/chromium/SODA

# 用户可读 + 可执行，所有人都不可写。
sudo chmod 0555 ~/.config/chromium/OptGuideOnDeviceModel
sudo chmod 0555 ~/.config/chromium/WasmTtsEngine
sudo chmod 0555 ~/.config/chromium/SODALanguagePacks/
sudo chmod 0555 ~/.config/chromium/SODA

# 将目录的所有者从当前用户改为 root 用户和 root 组
sudo chown root:root ~/.config/chromium/OptGuideOnDeviceModel
sudo chown root:root ~/.config/chromium/WasmTtsEngine
sudo chown root:root ~/.config/chromium/SODALanguagePacks/
sudo chown root:root ~/.config/chromium/SODA
```

如果发现bug，或者想要**撤销修改**，只需把原文件夹删除即可。  
因为**浏览器会在下次使用这些功能时自动重新下载并重建目录**

```bash
# 撤销修改
sudo rm -rf ~/.config/chromium/OptGuideOnDeviceModel
sudo rm -rf ~/.config/chromium/WasmTtsEngine
sudo rm -rf ~/.config/chromium/SODALanguagePacks/
sudo rm -rf ~/.config/chromium/SODA
```

删除完大概会清理3～4G的文件，目前用了一个半月，无任何问题。  
如有遗漏，还请补充。

---
```bash
for dir in ~/.config/chromium/OptGuideOnDeviceModel ~/.config/chromium/SODALanguagePacks ~/.config/chromium/SODA ~/.config/chromium/WasmTtsEngine; do [ -d "$dir" ] && echo "✔ 存在: $dir" || echo "✘ 缺失: $dir"; done
```