---
来自: "https://busyogg.github.io/article/687e4eb8a728/#%E9%A2%84%E5%88%B6%E8%8F%9C"
收藏时间:
tags:
  - "网页收藏"
---
> [!"note":"摘要":null]
> 本网页主要介绍了niri疑难解答，包括预制菜、图标黑紫方块问题、xdg-desktop-portal、dolphin默认文件打开方式、剪贴板同步、quickshell托盘等内容。


## 预制菜

### niri

[niri](https://github.com/akass-org/niri) 提供多种额外功能，包括 blur 和离屏强制渲染。

### xwayland-satellite

[xwayland-satellite](https://github.com/akass-org/xwayland-satellite) 提供多显示器 HiDPI 支持，以及调整一些 pop-up 的判断。

## 图标黑紫方块问题

应用需要读取环境变量，在 environment 设置即可（以 KDE 为例）。

```shell
environment{

    QT_QPA_PLATFORMTHEME "kde"

}
```

## xdg-desktop-portal

### 全局门户

niri 的窗口捕获依赖于 GNOME 的 portal，因此默认的 portal 只能以 GNOME 的 portal 为主。不过我们可以通过单独设置 `/usr/share/xdg-desktop-portal/niri-portals.conf` 里的值来指定需要的内容。

我在此处指定为 KDE 的文件选择器和密码管理器：

```shell
[preferred]

default=gnome;gtk;

org.freedesktop.impl.portal.FileChooser=kde;

org.freedesktop.impl.portal.Access=gtk;

org.freedesktop.impl.portal.Notification=gtk;

org.freedesktop.impl.portal.Secret=kwallet;
```

### Firefox

Firefox 需要额外设置启用系统门户

进入 `about:config` 启用以下配置：

1. `widget.use-xdg-desktop-portal.file-picker 1`
2. `widget.use-xdg-desktop-portal.location 1`
3. `widget.use-xdg-desktop-portal.mime-handler 1`
4. `widget.use-xdg-desktop-portal.native-messaging 1`
5. `widget.use-xdg-desktop-portal.open-uri 1`
6. `widget.use-xdg-desktop-portal.settings 1`

如果你不想用 nautilus 打开下载文件，请 `pacman -Rdd nautilus` 卸载，否则 Firefox 会强制用 nautilus 打开。

### KDE 主题变量

KDE 主题变量不会自动传递到 portal 中，因此我们需要额外的手段传递变量。

```shell
systemctl --user import-environment QT_QPA_PLATFORMTHEME

systemctl --user restart plasma-xdg-desktop-portal-kde
```

你可以保存为脚本，设为 niri 启动的时候执行。

## dolphin 默认文件打开方式

如果不进行以下设置的话，dolphin 在 niri 下打开文件的时候每次都需要手动选择打开方式。

```shell
ln -sf /etc/xdg/menus/plasma-applications.menu ~/.config/menus/applications.menu
```

通过软连接让 niri 读取 plasma 的默认文件打开设置。

## 剪贴板同步

niri 不会同步 x11 和 Wayland 的剪贴板内容，因此在使用 linuxqq 的时候会导致无法复制剪贴板，这时候我们就需要一个脚本来手动进行同步。

绑定特性

```shell
!/bin/bash

SELF_PID=$$

ps -ef | grep clipboard_sync | grep -v grep | grep -v "$SELF_PID" | awk '{print $2}' | xargs -r kill

下面放原来的脚本内容

--------------------

防抖变量

last_text=""

last_img_hash=""

temp_file_path="/tmp/sync-img"

ext=""

rm_temp_file(){

    if [[ -f "$temp_file_path" ]]; then

        rm $temp_file_path

    fi

}

temp_file(){

    echo "$temp_file_path.$ext"

}

X11 → Wayland 同步

x11_to_wayland() {

    while true; do

        # ------- 判断wayland是否复制图片，是则删除x11复制的临时图片 -------

        if [[ -f "$temp_file_path" ]]; then

            clip_types=$(wl-paste --list-types 2>/dev/null || true)

            if [[ "$clip_types" == *"image/png"* ]] || [[ "$clip_types" == *"image/jpeg"* ]]; then

                rm_temp_file

            fi

        fi

        # -------- 图片 --------

        if xclip -selection clipboard -t TARGETS -o 2>/dev/null | grep -q "image/png"; then

            if [[ $(xclip -selection clipboard -t image/png -o 2>/dev/null | wc -c) -gt 0 ]]; then

                x11_img_hash=$(xclip -selection clipboard -t image/png -o | sha256sum | awk '{print $1}')

                if [[ -f "$temp_file_path" ]]; then

                    img_file_hash=$(sha256sum "$temp_file_path" | awk '{print $1}')

                else

                    img_file_hash=""

                fi

                if [[ -n "$x11_img_hash" && "$x11_img_hash" != "$img_file_hash" ]]; then

                    xclip -selection clipboard -t image/png -o > $temp_file_path

                    magic=$(head -c 12 "$temp_file_path" | xxd -p)

                    case "$magic" in

                        89504e470d0a1a0a*) ext="png" ;;

                        474946383761*|474946383961*) ext="gif" ;;

                        ffd8ff*) ext="jpg" ;;

                        52494646*) ext="webp" ;;

                        *) ext="bin" ;;

                    esac

                    path=$(temp_file)

                    echo  "$path"

                    mv "$temp_file_path" "$path"

                    echo -n "file://$path" | wl-copy -t text/uri-list

                fi

                xclip -selection clipboard  -i /dev/null

            fi

        fi

        # -------- 文本 --------

        current_text=$(wl-paste --type text/plain 2>/dev/null || true)

        x11_text=$(xclip -selection clipboard -o 2>/dev/null || true)

        if [[ -n "$x11_text" && "$x11_text" != "$last_text" && "$x11_text" != "$current_text" ]]; then

            echo -n "$x11_text" | wl-copy --type text/plain

            last_text="$x11_text"

            current_text=$(wl-paste --type text/plain 2>/dev/null || true)

            echo "copy to wl $(wl-paste)"

        fi

        if [[ -n "$current_text" && "$current_text" != "$last_text" && "$x11_text" != "$current_text" ]]; then

            echo "$current_text" | xclip -selection clipboard -t UTF8_STRING -i

            last_text="$current_text"

            echo "copy to x11 $(xclip -selection clipboard -o)"

        fi

        sleep 0.5

    done

}

启动同步服务

x11_to_wayland

rm_temp_file
```

## quickshell 托盘

有时候我们需要重启 quickshell，但是这时候却发现托盘图标不见了，这是因为后台有托盘进程抢占了。

已知的情况是 kded6 会自己启动抢占托盘图标，kill 掉就好了。

下面的脚本运行一次即可，通过写入特定的 dbus 文件来禁止 kded6。该脚本生成的脚本会在每次登录时自动运行，根据不同桌面环境执行对应的任务。

绑定特性

```shell
!/bin/bash

KDED6="[D-BUS Service]

Name=org.kde.kded6

Exec=/bin/false"

KDED6_PATH="$HOME/.local/share/dbus-1/services"

KDED6_FULL_PATH="$KDED6_PATH/org.kde.kded6.service"

SH="#!/bin/bash

CURRENT_DESKTOP=\$XDG_CURRENT_DESKTOP

if [[ \$CURRENT_DESKTOP == \"KDE\" ]]; then

    systemctl --user unmask plasma-kded6.service

    if [[ -f \"$KDED6_FULL_PATH\" ]]; then

        rm $KDED6_FULL_PATH

    fi

else

    killall kded6

    mkdir -p $KDED6_PATH

    echo \"$KDED6\" > $KDED6_FULL_PATH

    systemctl --user mask plasma-kded6.service

fi

"

mkdir -p "$HOME/.config/niri/script/"

echo "$SH" > $HOME/.config/niri/script/mask_kded6.sh

chmod +x $HOME/.config/niri/script/mask_kded6.sh

AUTOSTART="[Desktop Entry]

Comment[zh_CN]=

Comment=

Exec=$HOME/.config/niri/script/mask_kded6.sh

GenericName[zh_CN]=

GenericName=

Icon=

MimeType=

Name[zh_CN]=mask_kded6

Name=mask_kded6

Path=

StartupNotify=true

Terminal=false

TerminalOptions=

Type=Application

X-KDE-SubstituteUID=false

X-KDE-Username="

echo "$AUTOSTART" > "$HOME/.config/autostart/mask_kded6.desktop"
```

## 更新日志

1. 图标黑紫方块问题。
2. xdg-desktop-portal
3. dolphin 默认文件打开方式。

1. 更新门户相关内容。
2. 新增剪贴板同步。
3. 新增 quickshell 托盘。

1. 修复 quickshell 托盘脚本。
2. 修复 x11 剪贴板同步脚本。

1. 新增预制菜。