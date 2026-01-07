---
来自: "https://www.nodeseek.com/post-563868-1"
收藏时间: 2025年12月30日 二 12:43:57
tags:
  - "网页收藏"
---
> [!note] 摘要
> 本文介绍了在Arch Linux中使用Podman替代Docker的过程，包括安装、配置Socket、镜像源设置、自动重启策略以及将容器转换为Systemd服务等内容。


### 原文链接：https://blog.ibytebox.com/archives/0PORgCA1

上一篇已经折腾了 Arch Linux，就索性把折腾进行到底。

我们都知道 Docker 好用，但守护进程（Daemon）那套东西确实越来越重。Podman 无守护进程、更加轻量，而且就在 Linux 内核的命名空间里裸奔，这味道才符合 Arch 的“简致”哲学。

但习惯难改，我们想要的完美状态是：底层全是 Podman，但命令依然敲 docker，配置依然写 docker-compose.yml，一切照旧，无缝切换。

1. 安装

我们需要安装 Podman 本体，加上一个很关键的包 podman-docker。这个包的作用就是用来“欺骗”系统的，它会把 docker 命令重定向给 Podman。同时，我们直接装官方的 docker-compose。

Bash

`pacman -S podman podman-docker docker-compose`

1. 关键步骤：移花接木 (Socket 配置)

这是最重要的一步。Docker Compose 并不认识 Podman，它只认 /var/run/docker.sock 这个文件。

Podman 其实也有 Socket，只是位置不一样。我们要做的就是把 Podman 的 Socket 启动起来，然后给它做一个软链接，链接到 Docker 默认的位置。这样 Docker Compose 就会以为它连上了 Docker Daemon。

Bash

## 1\. 让 Podman 的 Socket 开机自启

```
# 2. 建立软链接 (如果之前装过 Docker，先把原来的删了)
rm -f /var/run/docker.sock
ln -s /run/podman/podman.sock /var/run/docker.sock
```

做完这步，试一下 docker version，如果看到 Server API 的输出，说明“欺骗”成功了。

1. 治好 Podman 的“洁癖” (镜像源配置)

Podman 默认比较严谨，你 pull nginx 它会报错，因为它不知道你是要去 Docker Hub 还是别的什么私有库。为了像 Docker 一样“傻瓜式”拉取，我们需要改一下配置。

打开 /etc/containers/registries.conf，把下面这段加进去或者取消注释，确保 Docker Hub 是默认搜索地：

```
Ini, TOML

unqualified-search-registries = ["docker.io"]

[[registry]]
prefix = "docker.io"
location = "docker.io"
```
1. 搞定自动重启 (Restart Policy)

这可能是你最关心的。因为 Podman 没有后台守护进程，所以机器重启后，默认是没人管容器的。

Arch 官方源里提供了一个专门的 Systemd 服务叫 podman-restart。它的工作原理很简单：开机时运行一次，检查数据库，把所有标记了 restart: always 或 unless-stopped 的容器全部拉起来。

只需要这一条命令，你的 docker-compose.yml 里的重启策略就生效了：

Bash

`systemctl enable --now podman-restart.service`

不用做其他任何配置，现在你可以直接去跑 docker-compose up -d 了。

1. 验证一下

建个文件夹，丢个简单的 docker-compose.yml 进去试试：

YAML

```
version: "3"
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    restart: always
```

运行 docker-compose up -d。只要能跑起来，并且重启机器后 Nginx 还在，那就大功告成了。

进阶玩法：把容器变成 Systemd 服务

虽然上面的方法兼容性最好，但在 Arch Linux 的圈子里，还有一种更“原生”的玩法。

如果你跑的不是一堆微服务，而是一个核心的基础设施（比如家里的 DNS、数据库、或者一个 VPN 服务），你可能希望它像 sshd 一样稳定，完全由 Systemd 接管，而不是依赖 docker-compose。

Podman 提供了一个生成器，可以把现有的容器变成 Systemd 的.service 文件。

怎么做？

先手动启动你的容器：podman run --name my-db...

生成服务文件：

Bash

```
cd /etc/systemd/system/
# --new 的意思是每次启动都重新创建容器，保证环境干净
podman generate systemd --new --name my-db --files
```

这时候你会得到一个 container-my-db.service。

停掉并删除原来的容器（防止冲突），然后启用服务：

Bash

```
podman rm -f my-db
systemctl enable --now container-my-db.service
```

这有什么好处？

依赖管理：你可以设定这个容器必须在网络通了之后、或者在挂载了某个硬盘之后才启动。

统一日志：用 journalctl -u container-my-db 就能看日志，不用切到 docker 命令。

注意：这招和 docker-compose 是互斥的。如果是简单的应用堆栈，老老实实维持方案 A (Compose + podman-restart) 最省心；如果是单体核心服务，方案 B (Systemd) 更稳健。