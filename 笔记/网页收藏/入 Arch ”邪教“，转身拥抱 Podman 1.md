---
来自: https://www.nodeseek.com/post-563868-2
收藏时间: 2026-04-10T23:09:00
tags:
  - 网页收藏
---
> [!note] 摘要
> 该网页讨论了如何将 Arch Linux 与 Podman 结合使用，以实现轻量级容器化。文章介绍了安装 Podman、配置 Docker Compose 以使用 Podman、设置镜像源、自动重启策略以及将容器转换为 Systemd 服务等步骤。此外，还提到了将容器转换为 Systemd 服务的进阶玩法。


in [技术](https://www.nodeseek.com/categories/tech)

[#0](#0)

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

- edited 101days ago
	[#8](#8)
	[@lidem](https://www.nodeseek.com/member?t=lidem) [#0](https://www.nodeseek.com/post-563868-1#0)
	多个服务也可以的。比如下面这个 compose 文件
	```
	cat pod.yml
	name: rsshub
	services:
	    app:
	        image: docker.io/diygod/rsshub
	        restart: always
	        userns_mode: 'keep-id'
	        ports:
	            - '127.0.0.1:1200:1200'
	        environment:
	            NODE_ENV: production
	            CACHE_TYPE: redis
	            REDIS_URL: 'redis://systemd-rsshub-redis:6379/'
	            PUPPETEER_WS_ENDPOINT: 'ws://systemd-rsshub-redis:3000'  # marked
	        depends_on:
	            - rsshub-redis
	            - rsshub-browserless  # marked
	    browserless:  # marked
	        image: docker.io/browserless/chrome  # marked
	        restart: always  # marked
	        userns_mode: 'keep-id'
	        ulimits:  # marked
	          core:  # marked
	            hard: 0  # marked
	            soft: 0  # marked
	    redis:
	        image: docker.io/redis:alpine
	        restart: always
	        userns_mode: 'keep-id'
	        volumes:
	            - ./redis-data:/data:z
	```
	然后  
	`podlet --overwrite -a -i -u compose --pod $FN`  
	FN 就是 上面 compose的文件名。
	然后  
	`systemctl --user start rsshub-pod`
	每个容器的 日志  
	`journalctl --user -u rsshub-browserless -u rsshub-app -u rsshub-redis -f`
	podlet 下载地址  
	[https://github.com/containers/podlet](https://www.nodeseek.com/jump?to=https%3A%2F%2Fgithub.com%2Fcontainers%2Fpodlet)
- [#1](#1)
	podman确实不错，openwrt 24已经切换上了（docker会破坏系统的nat回流）
- [#2](#2)
	学习了, 昨天刚刚装了个docker
- [#3](#3)
	好文帮顶
- [#4](#4)
	帮顶，学习了
- [#5](#5)
	拥抱新技术
- [#6](#6)
	[@lidem](https://www.nodeseek.com/member?t=lidem) [#0](https://www.nodeseek.com/post-563868-1#0) 好文加鸡腿
- [#7](#7)
	podman 必要工具，podlet 哈哈哈 好用的很
- [#9](#9)
	podman可以用docker 的镜像么
- edited 101days ago
	[#10](#10)
	[@org600](https://www.nodeseek.com/member?t=org600) [#9](https://www.nodeseek.com/post-563868-1#9) 可以，常用的镜像不用加前缀
	其他的加上 `docker.io/` 前缀就行  
	看我上面回帖
- [#11](#11)
	谢谢@duyaoo [#10](https://www.nodeseek.com/post-563868-1#10) 能用docker 镜像 生态就兼容了
- [#12](#12)
	学习
- [#13](#13)
	为啥不用containerd+nerdctl呢？

[登录](https://www.nodeseek.com/signIn.html) 或者 [注册](https://www.nodeseek.com/register.html) 后评论.