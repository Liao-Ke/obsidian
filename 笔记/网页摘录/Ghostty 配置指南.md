---
来自: "https://blog.axiaoxin.com/post/ghostty-config-guide/"
摘录时间: 2025年11月29日 六 20:34:47
网页标题: "Ghostty 终端配置指南"
tags:
  - "网页摘录"
---
> [!note] 摘要
> Ghostty 配置文件说明


Ghostty 的配置主要通过配置文件进行，也可以通过命令行参数进行设置。本指南详细介绍了 Ghostty 终端的各项配置选项，帮助您根据个人喜好和需求定制终端体验。Ghostty 提供了丰富的配置项，涵盖字体、颜色、快捷键、窗口行为等多个方面，允许您对终端进行精细化调整。

## Ghostty 配置文件说明

Ghostty 的配置文件使用键值对格式，例如 `font-family = "Monaco"`。配置文件中的路径是相对于包含 `config-file` 指令的文件的，命令行参数的路径是相对于当前工作目录的。配置文件可以嵌套使用，使用 `config-file` 配置项来加载其他配置文件。配置文件的加载顺序是它们被定义的顺序，也就是说在当前配置项后面的 `config-file` 会覆盖前面的设置。可以使用 `?` 前缀来表示可选的配置文件，例如 `?config-file = "optional.conf"`，如果文件不存在，则不会报错。

## Ghostty 字体配置

- **`font-family`**: 设置**首选字体系列**。可以多次使用此配置，指定当主要字体中没有所需字符时，使用的备用字体。在 macOS 上，默认使用 Apple Color Emoji；在 Linux 上，默认使用 Noto Emoji，但您可以通过此配置覆盖此行为.
- **`font-family-bold`**, **`font-family-italic`**, **`font-family-bold-italic`**: 分别设置**粗体**、**斜体**和**粗斜体**的字体系列。如果未设置特定样式，则会搜索常规样式（`font-family`）的变体。如果找不到样式变体，Ghostty 会使用常规样式。
- **`font-style`**, **`font-style-bold`**, **`font-style-italic`**, **`font-style-bold-italic`**: 指定用于终端字体样式的**命名字体样式**。例如，“Iosevka Heavy”的样式为“Heavy”。 可以使用这些字段完全禁用字体样式，将配置值设置为 `false` 即可。
- **`font-synthetic-style`**: 控制是否合成字体样式。Ghostty 可以合成粗体、斜体和粗斜体。可以将此项设置为 `false` 或 `true` 来完全禁用或启用合成样式，也可以使用 “no-bold”, “no-italic”, 和 “no-bold-italic” 来禁用特定样式。
- **`font-feature`**: 应用字体特性，可以多次重复以启用多个字体特性，例如 `ss20` 或 `-ss20`（禁用）。要禁用编程连字，请使用 `-calt`。
- **`font-size`**: 设置**字体大小**（以磅为单位）。可以使用非整数值，Ghostty 将选择最接近的整数像素大小。
- **`font-variation`**, **`font-variation-bold`**, **`font-variation-italic`**, **`font-variation-bold-italic`**: 为可变字体设置字体**变体值**。格式为 `id=value`，例如 `wght=700`。
- **`font-codepoint-map`**: 将一个或多个 Unicode **码位**映射到特定的**字体名称**，例如 `U+ABCD=fontname`。
- **`font-thicken`**: 使用更粗的笔画绘制字体，目前仅在 macOS 上支持。

### 字体微调

- **`adjust-cell-width`**, **`adjust-cell-height`**: 调整**单元格**的**宽度和高度**。这些值可以是整数或百分比。
- **`adjust-font-baseline`**: 调整文本**基线**与单元格底部的距离。
- **`adjust-underline-position`**, **`adjust-underline-thickness`**: 调整**下划线**的位置和粗细。
- **`adjust-strikethrough-position`**, **`adjust-strikethrough-thickness`**: 调整**删除线**的位置和粗细。
- **`adjust-overline-position`**, **`adjust-overline-thickness`**: 调整**上划线**的位置和粗细。
- **`adjust-cursor-thickness`**: 调整**光标**的粗细。
- **`adjust-cursor-height`**: 调整**光标**的高度。
- **`adjust-box-thickness`**: 调整**框线字符**的粗细.
- **`grapheme-width-method`**: 设置用于计算字形簇的单元格宽度的方法。可以使用 `unicode` 或 `legacy`.
- **`freetype-load-flags`**: 启用 FreeType 加载标志，例如 `hinting`, `force-autohint`, `monochrome` 和 `autohint`。

## Ghostty 主题和颜色配置

- **`theme`**: 设置**主题**。可以是内置主题名称、自定义主题名称或自定义主题文件的绝对路径。可以使用 `ghostty +list-themes` 命令查看可用主题列表。可以使用 `light:theme-name,dark:theme-name` 的语法，为浅色和深色模式指定不同的主题.
- **`background`**: 设置**窗口背景颜色**。
- **`foreground`**: 设置**窗口前景色**。
- **`selection-foreground`**, **`selection-background`**: 设置**选中文本**的前景色和背景色。
- **`selection-invert-fg-bg`**: 交换选中文本的单元格前景色和背景色。
- **`minimum-contrast`**: 设置前景色和背景色之间的**最小对比度**。
- **`palette`**: 设置 **256 色调色板**。格式为 `N=HEXCODE`，其中 `N` 为 0 到 255。
- **`cursor-color`**: 设置**光标颜色**。
- **`cursor-invert-fg-bg`**: 交换光标下单元格的前景色和背景色。
- **`cursor-opacity`**: 设置**光标不透明度**。
- **`cursor-style`**: 设置**光标样式**，如 `block`、`bar`、`underline` 或 `block_hollow`.
- **`cursor-style-blink`**: 设置**光标闪烁状态**。
- **`cursor-text`**: 设置**光标下文本的颜色**.

## Ghostty 鼠标和剪贴板配置

- **`cursor-click-to-move`**: 启用通过 `alt+click`（Linux）或 `option+click`（macOS）在提示符处**移动光标**的功能。
- **`mouse-hide-while-typing`**: 在输入时**隐藏鼠标**。
- **`mouse-shift-capture`**: 确定是否捕获鼠标点击的**Shift 键**.
- **`mouse-scroll-multiplier`**: 设置鼠标**滚轮滚动距离**的乘数。
- **`clipboard-read`**: 控制是否允许从系统**剪贴板读取**内容，可以选择 `ask`, `allow`, 或 `deny`.
- **`clipboard-write`**: 控制是否允许向系统**剪贴板写入**内容，可以选择 `ask`, `allow`, 或 `deny`.
- **`clipboard-trim-trailing-spaces`**: 裁剪复制到剪贴板的数据的**尾随空格**.
- **`clipboard-paste-protection`**: 启用**粘贴保护**，防止粘贴不安全文本.
- **`clipboard-paste-bracketed-safe`**: 设置带**括号的粘贴**是否被认为是安全的。
- **`copy-on-select`**: 设置是否在选择文本时**自动复制到剪贴板**.
- **`click-repeat-interval`**: 设置**重复点击**的时间间隔.

## Ghostty 窗口和界面配置

- **`background-opacity`**: 设置**背景不透明度**。
- **`background-blur-radius`**: 设置**背景模糊半径**，仅在 macOS 上支持。
- **`unfocused-split-opacity`**: 设置**未聚焦分割窗格的不透明度**。
- **`unfocused-split-fill`**: 设置**未聚焦分割窗格的颜色**。
- **`window-padding-x`**: 设置**窗口水平内边距**。
- **`window-padding-y`**: 设置**窗口垂直内边距**。
- **`window-padding-balance`**: 平衡窗口**多余的内边距**。
- **`window-padding-color`**: 设置**窗口内边距颜色**.
- **`window-vsync`**: 启用**垂直同步**，仅在 macOS 上支持。
- **`window-inherit-working-directory`**: 新窗口和标签是否继承**工作目录**。
- **`window-inherit-font-size`**: 新窗口和标签是否继承**字体大小**。
- **`window-decoration`**: 启用或禁用**窗口装饰**（标题栏和边框）。
- **`window-title-font-family`**: 设置**窗口标题**和**标签**使用的字体.
- **`window-theme`**: 设置**窗口主题**，例如 `auto`, `system`, `light`, `dark`, 或 `ghostty`.
- **`window-colorspace`**: 设置**窗口颜色空间**, 例如 `srgb` 或 `display-p3`.
- **`window-width`**, **`window-height`**: 设置**初始窗口大小**（以单元格为单位）。
- **`window-save-state`**: 设置是否**保存和恢复窗口状态**, 可以选择`default`, `never` 或 `always`。
- **`window-step-resize`**: 以**单元格大小**为增量**调整窗口大小**, 仅在 macOS 上支持。
- **`window-new-tab-position`**: 设置新标签的创建位置, 可以是 `current` 或 `end`.
- **`resize-overlay`**: 设置**调整大小覆盖层**的显示方式，例如 `always`, `never` 或 `after-first`.
- **`resize-overlay-position`**: 设置**调整大小覆盖层**的位置.
- **`resize-overlay-duration`**: 设置**调整大小覆盖层**的持续时间.
- **`focus-follows-mouse`**: 设置窗口**焦点是否跟随鼠标**.
- **`confirm-close-surface`**: 关闭**标签页/窗口**前是否需要**确认**.
- **`quit-after-last-window-closed`**: 在**最后一个窗口关闭后**是否**退出** Ghostty.
- **`quit-after-last-window-closed-delay`**: 设置在最后一个窗口关闭后，Ghostty 保持运行的**时间**.
- **`initial-window`**: 是否在启动时**创建初始窗口**.
- **`quick-terminal-position`**: 设置**快速终端窗口**的位置, 例如 `top`, `bottom`, `left`, `right` 或 `center`.
- **`quick-terminal-screen`**: 设置**快速终端窗口**出现的**屏幕**, 例如 `main`, `mouse`, 或 `macos-menu-bar`.
- **`quick-terminal-animation-duration`**: 设置快速终端的**进入和退出动画持续时间**。
- **`quick-terminal-autohide`**: 设置**快速终端**在失去焦点时是否**自动隐藏**.

## Ghostty 终端行为配置

- **`command`**: 设置要运行的**命令**，通常是 shell。
- **`initial-command`**: 设置**初始终端**启动时运行的命令。
- **`wait-after-command`**: 设置在命令退出后是否**保持终端打开**。
- **`abnormal-command-exit-runtime`**: 设置进程**异常退出的最短运行时**。
- **`scrollback-limit`**: 设置**回滚缓冲区大小**（以字节为单位）。
- **`link-url`**: 启用或禁用 **URL 匹配**.
- **`fullscreen`**: 设置是否以**全屏模式**启动新窗口.
- **`title`**: 设置**窗口标题**.
- **`class`**: 设置**应用程序类**的值.
- **`x11-instance-name`**: 设置在 X11 下运行时的 **X11 实例名称**.
- **`working-directory`**: 设置**启动命令后更改的目录**.
- **`enquiry-response`**: 设置接收到 `ENQ` (`0x05`) 时发送的**响应字符串**.
- **`term`**: 设置 **TERM 环境变量**.

## Ghostty 快捷键配置

- **`keybind`**: 设置**快捷键绑定**。格式为 `trigger=action`。可以使用 `ghostty +list-actions` 命令查看可用操作列表。
	- **触发器（trigger）** 可以是 `+` 分隔的键和修饰符列表，例如 `ctrl+a` 或 `ctrl+shift+b`。
	- 可以使用 `physical:` 前缀来指定物理按键映射，例如 `ctrl+physical:a`.
	- 可以使用 `>` 分隔的多个触发器来定义**组合快捷键**，例如 `ctrl+a>n`.
	- **`all:` 前缀**将快捷键应用于**所有终端**.
	- **`global:` 前缀**使快捷键在**系统全局**生效（仅限 macOS）.
	- **`unconsumed:` 前缀**使快捷键**不消耗输入**.
	- **`action`** 是要执行的操作，例如 `new_window`、`copy_to_clipboard` 或 `csi:A`。

相关阅读： [Ghostty 终端默认快捷键列表](https://blog.axiaoxin.com/post/ghostty-default-keybinds/ "Ghostty 终端默认快捷键列表")

## Ghostty 其他设置

- **`config-file`**: 指定要读取的**其他配置文件**，可以重复使用.
- **`config-default-files`**: 控制是否加载**默认配置文件路径**.
- **`auto-update`**: 设置**自动更新**功能，例如 `off`、`check` 或 `download`.
- **`auto-update-channel`**: 设置**自动更新通道**，例如 `stable` 或 `tip`.
- **`shell-integration`**: 设置是否启用**shell 集成**，可以选择 `none`、`detect`、`bash`、`elvish`、`fish` 或 `zsh`.
- **`shell-integration-features`**: 设置要启用的**shell 集成功能**，例如 `cursor`, `sudo` 和 `title`.
- **`osc-color-report-format`**: 设置 **OSC 颜色报告格式**，可以选择 `none`, `8-bit`, 或 `16-bit`.
- **`vt-kam-allowed`**: 设置是否允许使用 **KAM 模式**.
- **`custom-shader`**: 设置要运行的**自定义着色器**的文件路径，可以重复使用.
- **`custom-shader-animation`**: 设置是否在**使用自定义着色器**时**运行动画循环**.
- **`macos-non-native-fullscreen`**: 设置 macOS 是否使用**非原生全屏模式**，可以选择 `visible-menu`, `true` 或 `false`.
- **`macos-titlebar-style`**: 设置 macOS **标题栏样式**，例如 `native`, `transparent`, `tabs` 或 `hidden`.
- **`macos-titlebar-proxy-icon`**: 设置 macOS 标题栏中的**代理图标是否可见**，可以选择 `visible` 或 `hidden`.
- **`macos-option-as-alt`**: 设置 macOS 的 **Option 键是否作为 Alt 键**处理.
- **`macos-window-shadow`**: 设置是否启用 macOS **窗口阴影**.
- **`macos-auto-secure-input`**: 设置是否**自动启用安全输入**.
- **`macos-secure-input-indication`**: 设置是否显示**安全输入指示**.
- **`macos-icon`**: 设置 macOS **应用图标**，例如 `official` 或 `custom-style`.
- **`macos-icon-frame`**: 设置 macOS 应用图标的**框架材质**, 例如 `aluminum`, `beige`, `plastic`, 或 `chrome`.
- **`macos-icon-ghost-color`**: 设置 macOS 应用图标中**幽灵的颜色**.
- **`macos-icon-screen-color`**: 设置 macOS 应用图标中**屏幕的颜色**.
- **`linux-cgroup`**: 设置是否将**每个终端界面放入一个专用的 Linux cgroup**，可以选择 `never`、`always` 或 `single-instance`.
- **`linux-cgroup-memory-limit`**: 设置**单个终端进程的内存限制**.
- **`linux-cgroup-processes-limit`**: 设置**单个终端进程的进程数限制**.
- **`linux-cgroup-hard-fail`**: 设置 cgroup 初始化失败是否会导致 Ghostty 退出.
- **`gtk-single-instance`**: 设置 GTK 应用是否以**单实例模式**运行.
- **`gtk-titlebar`**: 设置是否显示**完整的 GTK 标题栏**.
- **`gtk-tabs-location`**: 设置 GTK **标签栏**的位置.
- **`adw-toolbar-style`**: 设置 Adwaita 标签栏**工具栏的样式**, 例如 `flat`, `raised` 或 `raised-border`.
- **`gtk-wide-tabs`**: 设置 GTK 标签是否为**宽标签**.
- **`gtk-adwaita`**: 设置是否启用 Adwaita **主题支持**.
- **`desktop-notifications`**: 设置是否允许终端应用程序显示**桌面通知**.
- **`bold-is-bright`**: 设置**粗体文本**是否使用**亮色调色板**.

## 结语

请注意，一些配置项仅在特定的操作系统或构建版本上有效。在修改配置文件后，通常需要重启 Ghostty 才能使更改生效，或者至少需要打开新的终端窗口或标签页。

希望这份配置指南对您有所帮助！