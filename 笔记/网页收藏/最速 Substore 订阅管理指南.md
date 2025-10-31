---
来自: "https://blog.l3zc.com/2025/03/clash-subscription-convert/#%E7%94%9F%E6%88%90%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5"
收藏时间: 2025年10月24日 五 19:31:08
tags:
  - "网页收藏"
---
> [!note] 摘要
> 该网页介绍了如何利用Sub-Store从多个订阅中抽取节点信息，通过正则表达式或JS整理它们，生成整合了所有节点信息的订阅。文章还包含了Sub-Store的部署方法、配置示例以及如何生成Clash配置和下载链接的详细步骤。


当我趁着春节各家机场的促销订阅多个机场之后，如何充分利用每个节点就变成了说难不难说简单也不简单的问题，我当然可以订阅各家机场提供的配置文件，然后在他们之间切换，但这样未免也太麻烦了。更何况我还有自建节点，我可不想为了这一个节点专门去开一个新的配置。

Sub-Store 很好的解决了这个问题，它可以从多个订阅中抽取节点信息，通过正则表达式或者 JS 整理它们，最后输出一个整合了所有节点信息的订阅。

部署它可以直接使用 xream 打包好的镜像，这个镜像整合了前后端，如果在公网部署，记得更改一下后端路径，否则你的配置文件很可能会被盗用。

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
services:

  sub-store:

    image: xream/sub-store

    container_name: substore

    restart: always

    environment:

      - SUB_STORE_CRON=55 23 * * *

      - SUB_STORE_FRONTEND_BACKEND_PATH=/super-random-path

    ports:

      - "3001:3001"

    volumes:

      - ./data:/opt/app/data
```

反代 3001 端口即可访问 Substore 的前端，这里以 Caddy 为例：

```
1
2
3
sub-domain.example.com {

        reverse_proxy :3001

}
```

当然，初次进入前端别忘了新增后端地址，这时的后端地址取决于之前 compose file 里的设置，在本文的例子中，后端地址为 `https://sub-domain.example.com/super-random-path` 。

## 组合订阅的管理

添加所有机场上游和自建节点之后，就可以开始把它们全都加进单个组合订阅，但各个机场对节点的命名五花八门，默认情况下看起来非常杂乱，甚至不同机场之间的节点还有重名的可能。好在 Sub-Store 有通过脚本对节点进行批量重命名操作的功能，这里推荐 [一个脚本](https://github.com/Keywos/rule/blob/main/rename.js) ，能够帮我们为所有的机场节点重命名。

欲使用这个脚本，只需在编辑订阅时将以下地址粘贴到脚本操作处即可。

```
1
https://raw.githubusercontent.com/Keywos/rule/main/rename.js
```

![节点操作](https://blog.l3zc.com/2025/03/clash-subscription-convert/image_hu_ddb6d8af23e5d18c.png)

节点操作

![整理完成的节点列表](https://blog.l3zc.com/2025/03/clash-subscription-convert/image-1_hu_5f9fd84bbac5f007.png)

整理完成的节点列表

最后再进行一些你喜欢的节点操作，可以整理出一个统一规范的节点列表。

## 生成 Clash 配置

现在虽然已经有了节点列表，但现在生成的配置文件并不包含任何规则，需要自行编写或者拉取第三方规则。

![脚本操作](https://blog.l3zc.com/2025/03/clash-subscription-convert/image-6_hu_ee00be4480eb3fc7.png)

脚本操作

转到 Substore 的文件管理，创建一份新的 Mihomo 配置：

- 「来源」选择组合订阅，并在订阅名称上选择你的订阅组
- 在脚本操作中填入自己的覆写配置

这是我自己的覆写规则 [powerfullz/override-rules](https://github.com/powerfullz/override-rules) ，以 [mihomo-party-org/override-hub](https://github.com/mihomo-party-org/override-hub) 内的 ACL4SSR 规则为灵感，几乎完全重新编写，具有以下优点：

- 集成 SukkaW/Surge 和 Cats-Team/AdRules 规则集，优化广告拦截、隐私保护及流量分流精度
- 新增 Truth Social、E-Hentai、TikTok、加密货币等实用分流规则
- 移除冗余规则集
- 引入 Loyalsoldier/v2ray-rules-dat 完整版 GeoSite/GeoIP 数据库
- 针对 IP 规则添加 no-resolve 参数，避免本地 DNS 解析，提升上网速度，无 DNS 泄露
- JS 格式覆写现已实现节点国家动态识别与分组，自动为实际存在的各国家/地区节点生成对应代理组，节点变动时分组自动变化，省心省力。例如：你的订阅没有韩国的节点，则最终生成的配置中「韩国节点」这个代理组就不会出现。

### JavaScript 格式覆写

复制 JavaScript 格式覆写文件的 raw 链接 `https://raw.githubusercontent.com/powerfullz/override-rules/refs/heads/main/convert.js` ，并根据需要在后面附加参数，格式如下：

```
1
https://raw.githubusercontent.com/powerfullz/override-rules/refs/heads/main/convert.js#参数1=true&参数2=true
```

目前支持如下参数：

| 参数 | 功能 |
| --- | --- |
| `loadbalance` | 启用国家/地区节点组的负载均衡 |
| `landing` | 启用落地节点功能 |
| `ipv6` | 启用 IPv6 支持 |
| `full` | 生成针对纯内核使用场景的完整配置 |
| `keepalive` | 启用 TCP KeepAlive |

例如，若有负载均衡和 IPv6 需求，最终的覆写脚本链接为：

```
1
https://raw.githubusercontent.com/powerfullz/override-rules/refs/heads/main/convert.js#loadbalance=true&ipv6=true
```

将最终的覆写脚本链接粘贴到脚本操作处，使用 Substore 的生成预览功能确认没有问题后即可保存。

![新建一个脚本操作并粘贴最终的订阅链接](https://blog.l3zc.com/2025/03/clash-subscription-convert/image-7_hu_bde7fccbbd6ae329.png)

新建一个脚本操作并粘贴最终的订阅链接

### YAML 格式覆写

~~YAML 格式覆写我自己已经不用了，随缘维护，但欢迎 PR~~

写了个 Github Actions 自动根据 JS 格式覆写生成 YAML 格式覆写，所以现在 YAML 格式又开始维护了。

除了直接引用 convert.js 动态覆写，你也可以使用仓库中预先生成好的 32 份 YAML 格式覆写——它们都放在 yamls/ 目录里，由 GitHub Actions 在每次推送后自动重新生成、覆盖。适用于诸如 Clash Verge 等不支持 JS 覆写的客户端和转换服务。

文件命名规则：

```
1
config_lb-{0|1}_landing-{0|1}_ipv6-{0|1}_full-{0|1}_keepalive-{0|1}.yaml
```

示例（开启 full，其余关闭）：

```
1
https://raw.githubusercontent.com/powerfullz/override-rules/refs/heads/main/yamls/config_lb-0_landing-0_ipv6-0_full-1_keepalive-0.yaml
```

CI 只是套用一份假的 `fake_proxies.json` 来生成覆写，所以不可能实现 JS 覆写自动根据节点匹配生成对应代理组的功能，只能把所有地区节点组都放进去。如果你已经搭建 Substore，并且想要「动态识别国家 + 传参」的灵活性，还是推荐使用 JS 覆写。

![填入对应的 RAW 链接](https://blog.l3zc.com/2025/03/clash-subscription-convert/image-6_hu_ee00be4480eb3fc7.png)

填入对应的 RAW 链接

## 生成下载链接

保存成功后点击分享按钮生成分享链接，设置分享有效期后点击「创建分享」，生成的链接即最终成型的 Mihomo 配置文件，将其作为订阅链接在你的代理软件内订阅就大功告成了。

![最终效果](https://blog.l3zc.com/2025/03/clash-subscription-convert/image-5_hu_6b80dd0f5c67794a.png)

最终效果