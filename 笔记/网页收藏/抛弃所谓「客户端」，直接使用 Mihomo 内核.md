---
来自: "https://blog.l3zc.com/2025/07/switch-to-pure-mihomo-kernel/#%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A6%86%E5%86%99"
收藏时间: 2025年10月24日 五 19:52:26
tags:
  - "网页收藏"
---
> [!note] 摘要
> 需要的预备知识、安装 Mihomo 内核、配置文件、管理面板、自动维护、防火墙、本机代理怎么配置、这么折腾何必呢用客户端不香吗


自从开始使用 Clash/Mihomo，我和大多数人一样选择了基于其内核的图形化客户端——图方便。实际上，这些 Mihomo 客户端本质上都差不多：内核都是同一个，他们主要负责提供一个易用的界面、管理配置文件、订阅更新，以及 GUI 下的系统代理设置。基于这一点，我认为判断一个 Mihomo 客户端优劣的关键，便是看它的「覆写」功能做得如何。每一个通过客户端下载或者订阅的配置文件，都会经过一系列「覆写」过程，比如更换 `mixed-port` 、添加 `sniffer` 配置等，最后生成用于启动 Mihomo 内核的最终配置。

然而，并非所有客户端都能胜任这一核心工作。比如 ShellCrash，其覆写功能经常莫名其妙出岔子，说到底还是实现得太粗糙。如果连覆盖和修改配置都做不好，这种客户端实在难称合格。

与其依赖这些 ~~屎一样的~~ 不尽如人意的 Mihomo 客户端，不如自己动手，直接自己编写、管理配置文件交给内核启动，而不是依赖「黑箱」一般的各种「客户端」，不仅更纯净、更稳定，而且更可控。

## 需要的预备知识

- 基本的 Linux 操作
- 知道如何使用 CLI 编辑器，如 nano
- 已经搭建 Substore（可选）
- 默认使用 root 用户操作，非 root 用户请自行注意提权

## 安装 Mihomo 内核

对于基于 Debian 的分支，可以使用预编译的`.deb` 包安装，对于其他使用 `systemd` 的系统，下载 [编译好的二进制文件](https://github.com/MetaCubeX/mihomo/releases) ，重命名为 `mihomo` ，放到 `/usr/local/bin` ：

```
1
2
curl -o /usr/local/bin/mihomo <下载链接>

chmod +x /usr/local/bin/mihomo
```

然后新建 `/etc/systemd/system/mihomo.service` ：

```
1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
[Unit]

Description=mihomo Daemon, Another Clash Kernel.

After=network.target NetworkManager.service systemd-networkd.service iwd.service

[Service]

Type=simple

LimitNPROC=500

LimitNOFILE=1000000

CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_RAW CAP_NET_BIND_SERVICE CAP_SYS_TIME CAP_SYS_PTRACE CAP_DAC_READ_SEARCH CAP_DAC_OVERRIDE

AmbientCapabilities=CAP_NET_ADMIN CAP_NET_RAW CAP_NET_BIND_SERVICE CAP_SYS_TIME CAP_SYS_PTRACE CAP_DAC_READ_SEARCH CAP_DAC_OVERRIDE

Restart=always

ExecStartPre=/usr/bin/sleep 1s

ExecStart=/usr/local/bin/mihomo -d /etc/mihomo

ExecReload=/bin/kill -HUP $MAINPID

[Install]

WantedBy=multi-user.target
```

使用 `systemctl daemon-reload` 重新加载 `systemd` ，此时还没有配置文件，不能直接启动内核，但可以使用 `systemctl enable mihomo` 让内核开机自启，方便后续使用。

## 配置文件

内核启动时会加载 `/etc/mihomo/config.yaml` ，没有了黑箱一样的碍事「客户端」，配置文件可以随心所欲的定制。部分机场会下发完整的配置文件，直接用 `curl` 下载即可。

对于订阅的管理，我目前使用 Substore，我之前分享过 [「最速 Substore 订阅管理指南」](https://blog.l3zc.com/2025/03/clash-subscription-convert/) ，可以直接参考这篇文章来定制自己的订阅。为了实现纯内核启动，现在我的 Substore [JS 格式覆写](https://github.com/powerfullz/override-rules/blob/main/convert.js) 已经加入了 `full` 参数，可以生成完整的配置文件，包括各种端口设置、统一延迟和外部控制器等，开箱即用。

在 Substore 配置完成以后便可以下载配置文件并启动内核：

```
1
2
sudo curl -o /etc/mihomo/config.yaml 配置文件链接

sudo systemctl start mihomo
```

### 自定义覆写

我的配置文件不能满足你的所有需求？没问题！你可以自己添加覆写，想要什么加什么。

我用过各种覆写规则，后来也开始自己从零开始编写覆写规则，即使使用自己的覆写规则能满足 99% 的场景，但有极个别的域名还是会在规则中有遗漏，更不用说用别人写的覆写规则了。这些遗漏的规则大多是形如我服务器的非标准端口 SSH 的前置代理等相对隐私的规则，直接上传到 Github 公开显然不太合适，那么在自定义规则的基础上再添加覆写就成了唯一的选择。

好在 Substore 可以添加多个脚本操作，只需要在生成配置文件时额外添加一个脚本操作就能解决我们的问题。

```
1
2
3
4
function main(config) {

  config["rules"].unshift("DOMAIN-SUFFIX,xxx,DIRECT");

  return config;

}
```

需要注意的是覆写 `rules` 时必须要使用`.unshift()` 放在最前面，而不是用`.push()` 放到最后面，因为放在 `MATCH` 后面的规则是永远都匹配不到的。

### 自定义配置文件

完全不喜欢我的覆写规则？不会用/不喜欢用 Substore？没问题！你也可以参考 [Mihomo 文档](https://wiki.metacubex.one/config/) ，自己从头开始手搓配置文件：

```
1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
mode: rule

mixed-port: 7890

redir-port: 7892

tproxy-port: 7893

allow-lan: true

log-level: info

ipv6: true

external-controller: 127.0.0.1:8000

# secret: yoursecret

unified-delay: true

routing-mark: 7894

tcp-concurrent: true

disable-keep-alive: true # 推荐在给移动设备代理时启用，可以解决待机异常耗电的问题

dns:

  # 你的 DNS 配置

sniffer:

  # 你的域名嗅探配置

geodata-mode: true

geox-url:

  # 自定义 Geodata 文件 URL

proxy-providers:

  # 你的机场订阅

rule-providers:

  # 外部规则

rules:

  # 分流规则

proxy-groups:

  # 自定义代理分组
```

## 管理面板

管理面板可以根据个人喜好选择，以 Zashboard 为例，我在使用 mihomo 自带的 `external-ui` 时遇到了一些莫名其妙的问题，所以干脆直接运行一个 Docker 容器，毕竟这东西就真的只是一个 Web 面板，只要确保内核 API 使用 HTTP 时，Web 面板也使用 HTTP 即可，如果此时 Web 面板使用 HTTPS，则会因为 CORS 策略问题无法连接。

```
1
2
3
$ mkdir zashboard && cd zashboard

$ nano compose.yml

$ docker compose up -d
```

`compose.yml` 内容：

```
1
2
3
4
5
6
services:

  zashboard:

    image: ghcr.io/zephyruso/zashboard:latest

    ports:

      - "8899:80"

    restart: "unless-stopped"
```

## 自动维护

内核已经运行起来，自动更新订阅这种功能怎么实现？

答曰：自行编写一个 Shell 脚本，配合 Crontab 即可实现自动更新订阅的功能。例如我希望每天凌晨 3 点自动更新订阅并重启服务，遂编写 `/etc/mihomo/auto_update.sh` ：

```
1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
#!/bin/bash

# === 配置信息 ===

CONFIG_URL=""

CONFIG_PATH="/etc/mihomo/config.yaml"

BACKUP_DIR="/etc/mihomo"

BACKUP_PREFIX="config.yaml"

MAX_BACKUPS=7

TMP_PATH="/tmp/config.yaml.tmp"

LOG_FILE="/var/log/mihomo_update.log"

# === 日志 ===

log() {

    echo "$(date '+%F %T') $1" | tee -a "$LOG_FILE"

}

# === 备份现有配置，并自动清理旧备份 ===

backup_config() {

    if [ -f "$CONFIG_PATH" ]; then

        backup_file="$BACKUP_DIR/${BACKUP_PREFIX}.$(date '+%Y%m%d_%H%M%S').bak"

        cp "$CONFIG_PATH" "$backup_file"

        log "配置文件已备份到 $backup_file"

        # 清理多余的备份，只保留最新的 $MAX_BACKUPS 个

        old_backups=$(ls -1t $BACKUP_DIR/${BACKUP_PREFIX}.*.bak 2>/dev/null | tail -n +$(($MAX_BACKUPS+1)))

        for f in $old_backups; do

            rm -f "$f" && log "已删除旧备份 $f"

        done

    else

        log "未找到现有配置文件，无需备份"

    fi

}

# === 下载新配置 ===

download_config() {

    log "开始下载新配置..."

    curl -fsSL -o "$TMP_PATH" "$CONFIG_URL"

    if [ $? -ne 0 ]; then

        log "下载配置失败，请检查网络或地址"

        return 1

    fi

    # 基本校验：检测文件体积

    if [ ! -s "$TMP_PATH" ]; then

        log "下载文件为空，停止更新"

        return 2

    fi

    log "配置下载完成"

    return 0

}

# === 更新配置文件 ===

replace_config() {

    mv "$TMP_PATH" "$CONFIG_PATH"

    log "配置文件已更新"

}

# === 重启 mihomo 服务 ===

restart_service() {

    systemctl restart mihomo

    if [ $? -eq 0 ]; then

        log "mihomo 服务已重启"

    else

        log "mihomo 服务重启失败，请手动检查"

    fi

}

main() {

    backup_config

    download_config

    DL_STATUS=$?

    if [ "$DL_STATUS" -ne 0 ]; then

        log "操作终止：配置文件未更新，保留原有配置"

        exit 1

    fi

    replace_config

    restart_service

    log "=== 更新流程完成 ==="

}

main "$@"
```

使用 `crontab -e` 编辑 Crontab，设置如下 Crontab 即可在每天凌晨三点自动更新配置：

```
1
0 3 * * * /etc/mihomo/update_config.sh
```

## 防火墙

手动配置防火墙把流量劫持到 Mihomo 内核其实并不是什么难事，我之前在「 [从入门到进阶：Tailscale + ShellCrash 异地组网和科学上网](https://blog.l3zc.com/2025/04/tailscale-setup-recap/#%E5%9C%A8-exit-node-%E5%8A%AB%E6%8C%81%E6%B5%81%E9%87%8F) 」（以下简称「Tailscale 那篇文章」中的两个小节中提到过具体的操作方法，这里只提操作，不做解说。

根据我的情况，我需要把 `tailscale0` 上的网卡的所有流量劫持到 Mihomo 内核，其它的情况（例如本机代理）操作也大同小异。如果只是想劫持 TCP 流量，那么用 `iptables` 的 REDIRECT 功能已经足够，但若还想劫持 UDP、QUIC 等流量，则必须用到 Tproxy。 **最后，不要忘了 IPV6。**

以下是我的防火墙配置：

```
1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
# 创建自定义链

iptables -t mangle -N MIHOMO

# 根据自己的需要忽略本地流量

iptables -t mangle -A MIHOMO -d 127.0.0.1/8 -j RETURN

iptables -t mangle -A MIHOMO -d 100.64.0.0/10 -j RETURN

iptables -t mangle -A MIHOMO -d 192.168.1.0/24 -j RETURN

iptables -t mangle -A MIHOMO -d 172.17.0.0/16 -j RETURN

# mark UDP 和 TCP 到代理

iptables -t mangle -A MIHOMO -p tcp -j TPROXY --on-port 7893 --tproxy-mark 233

iptables -t mangle -A MIHOMO -p udp -j TPROXY --on-port 7893 --tproxy-mark 233

# 接口跳转

iptables -t mangle -A PREROUTING -i tailscale0 -j MIHOMO

# 路由表配置

echo "233 mihomo" | tee -a /etc/iproute2/rt_tables

ip rule add fwmark 233 lookup mihomo

ip route add local 0.0.0.0/0 dev lo table mihomo

# IPv6

# 创建链

ip6tables -t mangle -N MIHOMO6

# 跳过本地地址

ip6tables -t mangle -A MIHOMO6 -d ::1/128 -j RETURN

ip6tables -t mangle -A MIHOMO6 -d fd7a:115c:a1e0::/48 -j RETURN

# 标记 TCP/UDP

ip6tables -t mangle -A MIHOMO6 -i tailscale0 -p tcp -j TPROXY --on-port 7893 --tproxy-mark 233

ip6tables -t mangle -A MIHOMO6 -i tailscale0 -p udp -j TPROXY --on-port 7893 --tproxy-mark 233

# 接口跳转

ip6tables -t mangle -A PREROUTING -i tailscale0 -j MIHOMO6

# 路由表配置

echo "233 mihomo" | tee -a /etc/iproute2/rt_tables

ip -6 rule add fwmark 233 lookup mihomo

ip -6 route add local ::/0 dev lo table mihomo
```

大多数系统默认不会保存防火墙规则，关于规则持久化的内容我已经分别在 Tailscale 那篇文章的「 [路由规则持久化](https://blog.l3zc.com/2025/04/tailscale-setup-recap/#%E8%B7%AF%E7%94%B1%E8%A7%84%E5%88%99%E6%8C%81%E4%B9%85%E5%8C%96) 」和「 [iptables 规则持久化](https://blog.l3zc.com/2025/04/tailscale-setup-recap/#iptables-%E8%A7%84%E5%88%99%E6%8C%81%E4%B9%85%E5%8C%96) 」两小节做了详细说明，直接参考即可。

### 本机代理怎么配置？

大多数代理软件默认的配置（其实就是 ShellCrash 的默认配置）是 REDIRECT，用它也基本能满足大多数需求，REDIRECT 的示例如下：

```
1
2
3
4
5
# IPv4 劫持 eth0

iptables -t nat -A PREROUTING -i eth0 -p tcp -j REDIRECT --to-ports 7892

# IPv6 劫持 eth0

ip6tables -t nat -A PREROUTING -i eth0 -p tcp -j REDIRECT --to-ports 7892
```

其中 7892 要和 Mihomo 配置中的 `redir-port` 一致， `eth0` 就是想要劫持的 Interface，相比 Tproxy 那可真是简单太多了。

实际上我个人并不喜欢用把本机所有流量都劫持到防火墙，我更喜欢在需要时直接通过环境变量、 `proxy-chains` 和各种软件自带的代理配置把流量指向 Mihomo 内核，例如想让 Docker 走代理，则可以直接编辑 Docker 的 `/etc/docker/daemon.json` 来指定代理，而不是直接一股脑把网卡上的所有流量都劫持到代理：

```
1
2
3
4
5
6
7
{

  "proxies": {

    "http-proxy": "http://127.0.0.1:7890",

    "https-proxy": "http://127.0.0.1:7890",

    "no-proxy": "127.0.0.0/8"

  }

}
```

## 这么折腾，何必呢？用客户端不香吗？

别问，问就是玩虚空终端玩的。