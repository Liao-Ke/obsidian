---
来自: https://blog.ibytebox.com/archives/0PORgCA1
收藏时间: 2026-04-10T23:09:00
tags:
  - 网页收藏
---
> [!note] 摘要
> 文章介绍了在 Arch Linux 系统上从 Docker 切换到 Podman 的过程，包括安装、配置、镜像源设置、自动重启和进阶玩法等内容。


[上一篇](https://blog.ibytebox.com/archives/8XrpGHWw) 已经折腾了 Arch Linux，就索性把折腾进行到底。

我们都知道 Docker 好用，但守护进程（Daemon）那套东西确实越来越重。Podman 无守护进程、更加轻量，而且就在 Linux 内核的命名空间里裸奔，这味道才符合 Arch 的“简致”哲学。

但习惯难改，我们想要的完美状态是： **底层全是 Podman，但命令依然敲** `docker` **，配置依然写** `docker-compose.yml` **，一切照旧，无缝切换。**

## 1\. 安装

我们需要安装 Podman 本体，加上一个很关键的包 `podman-docker` 。这个包的作用就是用来“欺骗”系统的，它会把 `docker` 命令重定向给 Podman。同时，我们直接装官方的 `docker-compose` 。

Bash

```
pacman -S podman podman-docker docker-compose
```

## 2\. 关键步骤：移花接木 (Socket 配置)

这是最重要的一步。Docker Compose 并不认识 Podman，它只认 `/var/run/docker.sock` 这个文件。

Podman 其实也有 Socket，只是位置不一样。我们要做的就是把 Podman 的 Socket 启动起来，然后给它做一个软链接，链接到 Docker 默认的位置。这样 Docker Compose 就会以为它连上了 Docker Daemon。

Bash

```bash
# 1. 让 Podman 的 Socket 开机自启
systemctl enable --now podman.socket

# 2. 建立软链接 (如果之前装过 Docker，先把原来的删了)
rm -f /var/run/docker.sock
ln -s /run/podman/podman.sock /var/run/docker.sock
```

做完这步，试一下 `docker version` ，如果看到 Server API 的输出，说明“欺骗”成功了。

## 3\. 治好 Podman 的“洁癖” (镜像源配置)

Podman 默认比较严谨，你 `pull nginx` 它会报错，因为它不知道你是要去 Docker Hub 还是别的什么私有库。为了像 Docker 一样“傻瓜式”拉取，我们需要改一下配置。

打开 `/etc/containers/registries.conf` ，把下面这段加进去或者取消注释，确保 Docker Hub 是默认搜索地：

Ini, TOML

```
unqualified-search-registries = ["docker.io"]

[[registry]]
prefix = "docker.io"
location = "docker.io"
```

## 4\. 搞定自动重启 (Restart Policy)

这可能是你最关心的。因为 Podman 没有后台守护进程，所以机器重启后，默认是没人管容器的。

Arch 官方源里提供了一个专门的 Systemd 服务叫 `podman-restart` 。它的工作原理很简单：开机时运行一次，检查数据库，把所有标记了 `restart: always` 或 `unless-stopped` 的容器全部拉起来。

只需要这一条命令，你的 `docker-compose.yml` 里的重启策略就生效了：

Bash

```
systemctl enable --now podman-restart.service
```

不用做其他任何配置，现在你可以直接去跑 `docker-compose up -d` 了。

---

## 5\. 验证一下

建个文件夹，丢个简单的 `docker-compose.yml` 进去试试：

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

运行 `docker-compose up -d` 。只要能跑起来，并且重启机器后 Nginx 还在，那就大功告成了。

---

## 进阶玩法：把容器变成 Systemd 服务

虽然上面的方法兼容性最好，但在 Arch Linux 的圈子里，还有一种更“原生”的玩法。

如果你跑的不是一堆微服务，而是一个核心的基础设施（比如家里的 DNS、数据库、或者一个 VPN 服务），你可能希望它像 `sshd` 一样稳定，完全由 Systemd 接管，而不是依赖 `docker-compose` 。

Podman 提供了一个生成器，可以把现有的容器变成 Systemd 的 `.service` 文件。

**怎么做？**

1. 先手动启动你的容器： `podman run --name my-db ...`
2. 生成服务文件：
	Bash
	```verilog
	cd /etc/systemd/system/
	# --new 的意思是每次启动都重新创建容器，保证环境干净
	podman generate systemd --new --name my-db --files
	```
3. 这时候你会得到一个 `container-my-db.service` 。
4. 停掉并删除原来的容器（防止冲突），然后启用服务：
	Bash
	```
	podman rm -f my-db
	systemctl enable --now container-my-db.service
	```

**这有什么好处？**

- **依赖管理** ：你可以设定这个容器必须在网络通了之后、或者在挂载了某个硬盘之后才启动。
- **统一日志** ：用 `journalctl -u container-my-db` 就能看日志，不用切到 docker 命令。

**注意** ：这招和 `docker-compose` 是互斥的。如果是简单的应用堆栈，老老实实维持方案 A (Compose + podman-restart) 最省心；如果是单体核心服务，方案 B (Systemd) 更稳健。

## 补充：让“每个 compose 项目自动拿一个 /24 子网

### 1) 推荐一个更不容易冲突的地址段

- Podman 已用 10.89.0.0/24

很多公司内网 / VPN 常用 10.0.0.0/8（很容易撞），所以我更倾向于把 Podman 的“compose 项目地址池”挪到 **172.16.0.0/12 里的中间段** ，比如：

### ✅ 推荐：

### 172.24.0.0/13

### 作为地址池（覆盖 172.24.0.0 ~ 172.31.255.255）

- 避开 Docker 常见默认 172.17.0.0/16
- 比 10.x 段更少和公司网段撞（不是绝对，但概率低一些）
- 够大：/13 切 /24，能切出 **2048 个 /24 网络**
	⇒ **约 2048 个 compose 项目** （每项目一个网络）

> 如果你明确知道你公司/VPN 用的是 172.24~172.31，那就换成别的 RFC1918 段（比如 192.168.0.0/16 里挑一段大的 /18 或 /17 作为池）。

---

### 2) 先在你机器上确认是否冲突（强烈建议做）

跑下面命令，看看系统已经在用哪些私网段：

```
ip route | egrep '^(10\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[0-1]\.|192\.168\.)'
```

如果输出里 **没有** 172.24. ~ 172.31. 相关路由，那这个段一般就安全。

---

### 3) 配置方式：让“每个 compose 项目自动拿一个 /24 子网”

你用的是 **netavark** ，要改的是 Podman 的地址池：default\_subnet\_pools

### 3.1 配置文件放哪？

rootful（你是 root 在跑）常用：

- /etc/containers/containers.conf（建议用这个，覆盖默认）

> 如果这个文件不存在，可以创建；Podman 会合并系统默认配置 + 你的覆盖项。

### 3.2 写入完整配置（示例）

编辑 /etc/containers/containers.conf，加入/修改这段（没有就新增）：

```
[network]
# 这是“podman 默认桥 podman”那张网用的子网（可选）
# 如果你不想动默认 bridge，可以不改这一行
default_subnet = "10.88.0.0/16"

# 这是“自动创建网络（比如 compose 项目默认网络）”从哪里分配子网
# base=地址池，size=每张网络的掩码
default_subnet_pools = [
  { base = "172.24.0.0/13", size = 24 }
]
```

含义解释：

- base = "172.24.0.0/13"：给 Podman 一个“大池子”
- size = 24：每个新网络从池子里切一块 /24（一个 compose 项目一个子网，项目内共享）

### 4) 配完怎么生效？（重点：只影响“新建网络”）

- **已存在的网络** 不会自动改地址
- **新创建的网络** （新的 compose 项目、或你删掉旧网络再 up）会从新池子里分配

### 推荐的迁移步骤（尽量不影响线上）

1. 先别动正在跑的项目
2. 新项目直接用新地址池
3. 旧项目如果也要迁移：
	- 先停项目（会断网）
		- 删除该项目的 network
		- 再 up 让它自动创建新网络

常用命令（以 podman-compose 为例）：

```bash
podman-compose down
podman network ls
podman network rm <该项目的网络名>
podman-compose up -d
```

---

### 5) 如何验证确实在用新网段

创建一个新项目（或新建一个网络）后看子网：

```
podman network ls
podman network inspect <网络名> | egrep -i 'subnet|gateway'
```

你应该能看到类似 172.24.x.0/24 的分配结果。

---

### 6) 这样默认能支持多少个 compose 项目？

按我给的配置：

可切数量：

✅ **大约 2048 个 compose 项目** （每个项目一个 /24 子网）

每个项目里：

- /24 总 256
- 理论可用 254
- bridge 场景通常扣掉网关 ⇒ 容器 IP 约 **253 个** （每项目）

---

**本文为原创文章，转载请注明出处** ：

[**原文链**](https://blog.ibytebox.com/archives/8XrpGHWw) [**接**](https://blog.ibytebox.com/archives/0PORgCA1)