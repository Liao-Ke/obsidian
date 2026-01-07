---
来自: "https://www.aloxaf.com/2025/04/how_to_use_geosite/"
收藏时间: 2025年12月29日 一 22:13:14
tags:
  - "网页收藏"
---
> [!note] 摘要
> Clash 中 GeoSite 分流的正确使用方式：本文介绍了 GeoSite 的使用方法，包括流量分流、DNS 分流和引入其他规则等。通过正确配置 GeoSite，可以实现大部分的分流需求，提高网络访问效率。


· · 约 3.3k 字

---

因为觉得写 ruleset 太麻烦，研究了一下 GeoSite，发现其实在「正确的配置」下，只靠 GeoSite 就能满足绝大部分的分流需求。这方面的文章好像很少，写一篇分享一下折腾经验。

## GeoSite 是啥

GeoSite 也是一组规则列表，很多配置文件中都有用到它，只不过用的不多。

随便找了个例子，下面的 `geosite:cn,private` 和 `GEOSITE,cn` 都是在引用 GeoSite 规则。

```yaml
dns:

  nameserver-policy:

    "geosite:cn,private":

      - https://223.5.5.5/dns-query

rules:

  - GEOSITE,private,DIRECT

  - GEOSITE,cn,DIRECT
```

和普通的规则集相比，GeoSite 有哪些不同呢？

**1\. 使用简单**

绝大多数工具都内置了对 GeoX 系列的支持，有些工具甚至不用特地引入，默认就给你带上了，直接写就行，就像上面的配置一样。

**2\. 树形规则**

GeoSite 底层是一系列小规则，这些小规则又组成更大的规则，最终汇总到几个大分组上，因此可以通过指定不同的分组来实现灵活的分流。

```
cncategory-gamescategory-bankmihoyotencent-gamesmihoyo.commihoyogift.com
```

相比之下，ruleset 只有一个层级，只能作为一个整体进行分流。

**3\. 属性过滤**

GeoSite 支持 @attr 来进一步筛选分组中的规则，灵活程度更上一层楼。

比如 `steam@cn` 可以过滤出国内直连的 steam 域名。

又比如 `jd@!cn` 可以过滤出 jd 的国际域名。

## GeoSite 规则现状及问题

### v2fly/domain-list-community

这是目前 GeoSite 最上游的项目，由 v2fly 进行维护。

它的问题在于分组规则迷惑，很多域名会同时归属两个截然相反的规则（我也说不好算是 bug 还是 feature）。

比如 `geolocation-cn` 和 `geolocation-!cn` ，从字面意思上看，应该分别是国内和国外域名，但实际上里面有大量重叠域名。

大部分人更常用的是 cn 规则，它由 geolocation-cn 和 tld-cn 组成。我喜欢拆开写，这样看起来整齐一点（

如 `steampowered.com.8686c.com` 这个应该 **直连** 的域名，同时归属这两个分组，一旦你这么写规则，就会因为匹配到 `geolocation-!cn` 而走代理浪费流量。

```yaml
- GEOSITE,geolocation-!cn,PROXY

- GEOSITE,geolocation-cn,DIRECT
```

那是不是把 `geolocation-cn` 规则放到前面就行了呢？也不行， `tiktok.com` 也归属这两个分组，但是它应该走代理，如果先匹配到 `geolocation-cn` 就会变成直连。

这个看起来无解（其实并不）的问题导致很多人，甚至官方维护者，都建议使用下游规则 <sup><a href="https://www.aloxaf.com/2025/04/how_to_use_geosite/#user-content-fn-1">1</a></sup> 。

### Loyalsoldier/v2ray-rules-dat

这应该是目前使用最广泛的 GeoSite 分支了，其他分支基本上都是在这上面小修小补，它有两大特点：

1. 修复了原始项目的分组问题，从 `geolocation-cn` 和 `geolocation-!cn` 剔除了 `@!cn` 和 `@cn` 域名，防止冲突。
2. 引入了大量其他规则作为补充。

相比 **默认配置** 的 GeoSite，这个版本绝大多数情况下确实工作得更好，但是，仍然存在一定的问题，而且恰恰也是上述两点导致的。

**域名分组缺失**

首先，剔除掉 `@cn` 和 `@!cn` 后，确实不会「误分流」了，但是变成「漏分流」了。因为这些域名既不在 `geolocation-cn` 中也不在 `geolocation-!cn` 中，如果你不用 cn 分组就匹配不到它们，很难说究竟和原版相比哪个更符合直觉。

在这个分支中，由于混入了其他规则，cn 分组不再等同于 geolocation-cn + tld-cn

比如域名 `gstore.val.manlaxy.com` ，既不在 `geolocation-cn` 也不在 `geolocation-!cn` ，只能用 `steam@cn` 来引用它 。但问题就在于——我不知道究竟哪些域名是漏网之鱼，总不能把所有 `category-x@cn` 分类都写一次吧……

**过于宽泛的 CN 规则**

可能是为了弥补第一点造成的问题，项目额外引入了 [dnsmasq-china-list/accelerated-domains.china.conf](https://github.com/felixonmars/dnsmasq-china-list/blob/master/accelerated-domains.china.conf) 补充到了 CN 规则中。

乍一看很好，但实际上这是对 dnsmasq-china-list 的一个 **典型误用** ——这是一个用于 DNS 分流的项目，它所谓的「加速域名」收录标准（之一）是 **是否有中国 NS 服务器** ，而不是域名解析结果是否在中国。如果使用它进行流量分流，就会导致出现错误的分流结果 <sup><a href="https://www.aloxaf.com/2025/04/how_to_use_geosite/#user-content-fn-2">2</a></sup> 。

甚至在 dnsmasq-china-list 2023 年的一个 issue <sup><a href="https://www.aloxaf.com/2025/04/how_to_use_geosite/#user-content-fn-3">3</a></sup> 中，有人使用脚本进行筛选，发现这个列表中有 43% 的域名解析结果都不在中国。虽然不在中国并不意味着不能直连，但肯定是起不到到加速效果的。

**仍然存在的冲突分组**

继上面的问题，由于 cn 分组中添加了其他规则，又再次导致了某些域名同时出现了两个冲突的分组中。（得，又回到原点了）

比如 `vscode.download.prss.microsoft.com` ，既在 `geolocation-!cn` 分组，也在 `cn` 分组中，如果没用 `microsft@cn` 指定它直连，就会走代理浪费流量。

## 正确用法

### 流量分流

说了这么多，到底该用哪个呢？经过一番研究之后，我认为最好还是使用原版 GeoSite 作为基础，在此之上搭配其他规则进行分流。

原版规则存在的分组冲突问题，其实是可以规避的。使用 `@cn` 和 `@!cn` 属性搭配如下写法，就能正确地处理冲突，实现完美分流：

```yaml
# 注意，下面的写法必须搭配原版的 geosite 规则

# 如果你使用的是其他分支，需要清除缓存后重新下载

geox-url:

  geosite: "https://testingcf.jsdelivr.net/gh/v2fly/domain-list-community@release/dlc.dat"

rules:

  - GEOSITE,geolocation-!cn@cn,DIRECT # DIRECT 为直连分组，可以改为你自己的分组

  - GEOSITE,geolocation-!cn,PROXY # PROXY 为代理分组，可以改为你自己的分组

  - GEOSITE,geolocation-cn@!cn,PROXY

  - GEOSITE,geolocation-cn,DIRECT

  - GEOSITE,tld-cn,DIRECT
```

这个写法的巧妙之处在于——

- geolocation-!cn 整体是国外网站，但存在一些国内加速域名，那就先使用 @cn 筛选出这些域名进行直连，剩下的再走代理。如 alibaba.cdn.steampipe.steamcontent.com 之于 steam 分组。
- geolocation-cn 整体是国内网站，但存在一些只能在国外访问的域名，那就先使用 @!cn 筛选出这些域名进行代理，剩下的走直连。如 jd.hk 之于 jd 分组。

更妙的是， `geolocation-!cn@cn` 已经包含了 `steam@cn` 等子分组规则，所以不需要一个个把子分组单独列出来了，劣势瞬间变成了优势。但 **Loyalsoldier 等其他分支就无法这么写，因为它们不存在 `geolocation-cn@!cn` 和 `geolocation-!cn@cn` 分组** ，必须手动写 `steam@cn` 这样的子分组名称。

Note

steam 直连其实还需要额外设置 steamserver.net 为直连，否则 steam 进行测速后还是会从国外 CDN 下载游戏，此时还是会走代理。 <sup><a href="https://www.aloxaf.com/2025/04/how_to_use_geosite/#user-content-fn-5">4</a></sup>

### fake-ip-filter

众所周知，fake-ip 模式有个问题，就是域名 ping 不通，这会导致一些程序错误地认为自己没有联网（比如 Windows）。

常见的解法是把 msftconnecttest.com 和 msftncsi.com 加入 fake-ip-filter，但这只解决了 Windows 的问题。

其实 geosite 提供了一个 connectivity-check 分组，包含了安卓、苹果、Windows、华为、KDE、Arch Linux ……的连通性检查域名，一网打尽。

```yaml
dns:

  fake-ip-filter:

    - "geosite:connectivity-check"

    - "geosite:private"
```

### DNS 分流

完美了吗？还没有。除了流量分流以外，DNS 分流也很重要。像 fonts.googleapis.com 这样的域名，虽然没有被墙，但是如果使用国外 DNS 解析，也会造成访问非常缓慢。

如果发现「明明设置了直连，但是反而更慢了？」，大概率就是没有配置好 DNS 分流，使用国外 DNS 解析了本该直连的域名。

Clash 中的 DNS 配置有很多流派，这里只采用最简单的一种：

```yaml
dns:

  enable: true

  ipv6: false

  enhanced-mode: fake-ip

  fake-ip-range: 198.18.0.1/16

  fake-ip-filter:

    - "geosite:connectivity-check"

    - "geosite:private"

  default-nameserver:

    - 223.5.5.5

  proxy-server-nameserver:

    - 223.5.5.5

  direct-nameserver:

    - https://doh.pub/dns-query

    - https://223.5.5.5/dns-query

    - https://doh.360.cn/dns-query

  nameserver:

    - "https://8.8.8.8/dns-query#PROXY&ecs=120.76.0.0/14&ecs-override=true"
```

解释一下这一堆 nameserver 的作用：

**default-nameserver**

用来解析「DNS 服务器域名」的 DNS，需要填 IP 地址

**proxy-server-nameserver**

用来解析「代理服务器域名」，防止 nameserver 无法访问导致连不上代理。 比如上个月国外 DoH 大规模被墙，很多 nameserver 设置为国外 DoH，又没有设置 proxy-server-nameserver 的人就连不上代理了（我自己就是）。

**direct-nameserver**

「直连」域名的解析，这里用了 DoH 来防止劫持。直接用运营商的 DNS 也行，愿意自建 smartdns / adgurad home 等服务效果更好。

**nameserver**

用来解析没有匹配到任何「域名规则」的域名，通常是国外域名，建议使用国外 DoH 防止污染。但这个解析结果并不会用来发起连接，所以为了追求速度不使用 DoH 或直接使用国内 DNS 也行。

这里我配置得比较复杂：

- PROXY - 查询时使用的代理接口，如果使用能直连的国外 DoH 也可以省略。
- `ecs=120.76.0.0/14&ecs-override=true` - 使用 ECS 来查询，这样可以尽量避免能直连的网站解析出国外 IP。但是需要注意不是所有 DNS 都支持 ECS。

nameserver + direct-nameserver 的解析流程非常清晰，没有弯弯绕——

```
域名匹配到直连IP 匹配到直连IP 匹配到代理域名匹配到代理匹配规则匹配到域名规则匹配到目标 IP 规则使用 nameserver 查询使用 direct-nameserver 重新解析发送域名给代理使用 IP 直接连接
```

另一种常见方案是使用 nameserver-policy，它很强大，但是也复杂，没配置好反而会适得其反。

举例来说，如果你发现 download.org 有国内节点，想让它直连，使用 nameserver-policy 的正确写法应该是：

```yaml
rules:

  - DOMAIN,download.org,DIRECT

  - GEOSITE,geolocation-!cn,PROXY

  - GEOSITE,cn,DIRECT

dns:

  nameserver:

    - 8.8.8.8

  nameserver-policy:

    "geosite:cn,private":

    "geosite:cn,private,download.org":

      - 223.5.5.5
```

但实际操作中，很多人只更新了 rules，没有更新 dns 部分。这就导致一个潜在问题——如果 `geosite:cn` 没有匹配到 `download.org` ，这个域名就会使用 nameserver 来解析，结果通常是一个国外 IP，效果适得其反。

相比之下 direct-nameserver 就简单多了，只要是直连规则，一定会使用它来解析，免去手动配置的麻烦。

### 引入其他规则

使用 GeoSite 并不意味着就不用其他规则了，像 Loyalsoldier/v2ray-rules-dat 引入的很多规则确实很强大，比如去广告就比原版分支强多了。幸运的是 Loyalsoldier 提供了 [txt](https://github.com/Loyalsoldier/v2ray-rules-dat?tab=readme-ov-file#%E8%A7%84%E5%88%99%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80) 格式的域名集合，可以直接在 Clash 中导入。

引入额外的去广告规则的例子：

```yaml
# 使用锚点简化配置编写

domain_rule: &domain_rule

  type: http

  behavior: domain

  format: text

  interval: 86400

ruleset:

  reject-list:

    <<: *domain_rule

    url: https://cdn.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/reject-list.txt

    path: ./v2ray-rules-dat/reject-list.txt

rules:

  - RULE-SET,reject-list,REJECT
```

### 尽量避免使用 classical 规则

clash 支持的 ruleset 根据 behavior 不同分为 domain、ipcidr 和 classical 三种，上面引入的就是一个 domain 规则。

在引入第三方规则时，尽量避免使用 behavior 为 classical 的规则，尤其是在软路由等资源受限环境中。为什么呢？

**性能**

domain/ipcidr 专门进行域名/IP 的匹配，在 clash 内部是高度优化的；但 classical 规则支持完整的 clash 匹配语法，资源消耗更大。对于大型规则， **domain/ipcidr 格式可以显著降低资源占用** 。

**DNS 查询**

在正常情况下，我们期望一个匹配到域名规则的网站直接走直连/代理，不需要进行额外的 DNS 解析。但是，如果在域名规则之前存在不带 no-resolve 的 IP 规则，clash 就会立即进行 DNS 查询。这不仅浪费时间，根据不同的配置也可能出现 **DNS 泄漏风险甚至分流错误** 。

很多人会有意识地按照 domain、classical、ipcidr 的顺序排列规则，保证 IP 规则在最后匹配。但这里还有个隐藏坑点——classical 规则里也可能包含 IP 规则，甚至大概率包含了。

这也是为什么 ios\_rule\_script 这种大型规则集会把规则分成 [多个变体](https://github.com/blackmatrix7/ios_rule_script/blob/master/rule/Clash/ChinaMax/README.md#%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E) 。

- ChinaMax\_Classical.yaml 这种变体是「大杂烩」，包含了所有类型规则，用起来简单，但是存在上述问题
- ChinaMax.yaml、ChinaMax\_Domain.yaml、ChinaMax\_IP.yaml 则是将规则拆分为 （剔除掉域名和 IP 的）classical、domain、ipcidr 三类，可以用它们按顺序组合实现完美分流，但是代价就是 1 个规则变成 3 个规则了！如果你引入了 10 规则，就会变成 30 个……

## GeoSite Viewer

[https://geoviewer.aloxaf.com](https://geoviewer.aloxaf.com/)

这是一个用于查看和搜索 GeoSite 文件的工具，有效解决「这个域名在哪个分组」和「这里面究竟有哪些分组」的问题。

如 BT 下载时发现 `tracker.opentrackr.org` 在走代理，查询可以得知它归属 category-public-tracker 分组，这是一个「顶级」分组，不包含在 geolocation-xx 中，那么就可以手动加上这一条来补充分流规则。

本文作者： Aloxaf

发布日期：

许可协议： [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)

39 评论

- 按正序
- 按倒序
- 按热度

[Se7entny](https://github.com/Se7entny) 2025-12-09

分享一下我这些天折腾的各种踩坑：

1. geolocation-!cn和geolocation-cn并没有包含全部，其中geolocation-cn和tld-cn是被包含在cn里的，可以直接用cn，但按国家地区这个样代理还是很浪费代理流量的，很多国内可以直连的网站也在geolocation-!cn里，并且不是geolocation-!cn@cn，尤其是steam，下载之类的都会走代理，推荐用category-games，category-game-platforms-download单独设置规则，category-public-tracker与category-pt也是需要单独设置规则，并不在geolocation中
2. rule-providers:中，format是text还是yaml要选好，如果是clash/mihomo，选的text，这里不要用Loyalsoldier/v2ray-rules-dat的链接，因为它里面的域名都没有通用符，几乎匹配不上，应该使用Loyalsoldier/clash-rules的内容，里面域名都有通用符，并且用format: yaml才能正常使用

[nini](https://t.me/NiNiShare/) 2025-11-06

很好，收藏了~

[FuSheng](https://github.com/Ukiyo-dev) 2025-09-26

这里提供一个不依赖 GeoSite 的版本

```yml
domain_rule_text: &domain_rule_text
  type: http
  behavior: domain
  format: text
  interval: 86400

domain_rule_yaml: &domain_rule_yaml
  type: http
  behavior: domain
  format: yaml
  interval: 86400

rule-providers:
  reject-list:
    <<: *domain_rule_text
    url: https://cdn.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/reject-list.txt
    path: ./ruleset/reject-list.txt
  fake-ip-filter:
    <<: *domain_rule_text
    url: https://cdn.jsdelivr.net/gh/juewuy/ShellCrash@dev/public/fake_ip_filter.list
    path: ./ruleset/fake_ip_filter.list
  geolocation-!cn:
    <<: *domain_rule_yaml
    url: https://raw.githubusercontent.com/zydou/domain-list-community-converter/clash/geolocation-!cn.yml
    path: ./ruleset/geolocation-!cn.yml
  geolocation-!cn@cn:
    <<: *domain_rule_yaml
    url: https://raw.githubusercontent.com/zydou/domain-list-community-converter/clash/geolocation-!cn@cn.yml
    path: ./ruleset/geolocation-!cn@cn.yml
  geolocation-cn:
    <<: *domain_rule_yaml
    url: https://raw.githubusercontent.com/zydou/domain-list-community-converter/clash/geolocation-cn.yml
    path: ./ruleset/geolocation-cn.yml
  geolocation-cn@!cn:
    <<: *domain_rule_yaml
    url: https://raw.githubusercontent.com/zydou/domain-list-community-converter/clash/geolocation-cn@!cn.yml
    path: ./ruleset/geolocation-cn@!cn.yml
```

Anonymous 2025-09-25

非常感谢解除了我很久以来的疑惑

Anonymous 2025-08-17

非常感谢作者的分析和分享。有几个问题想讨论下：

1. 1.Clash mihomo 中规则匹配，使用 Geosite 或者 Ruleset ，哪一个性能更好？准确率更高？我在 [手把手教你定制自己的 YAML 文件 - 七尺宇](https://www.youtube.com/watch?v=eUqf3lOhFSw) 视频中看到作者明确说明 Rulset 会更节省内存、更快速。（但我查找了一些说法，只有 Genmini AI 告知 Geosite 更好，并且没有提供信息源）
2. 2.引入其他规则中，使用 `format: mrs` 二进制文件，会比其他格式的更节省性能。
3. 3.推荐一个 自认为更合理的 Geosite: [https://github.com/DustinWin/ruleset\_geodata](https://github.com/DustinWin/ruleset_geodata) ，某些想法和你不谋而合了
4. 4.我和 评论区 he11o 仁兄看法接近，使用 nameserver-policy 貌似更合理。参见： [关于 Clash 等现代代理软件的规则和 DNS 配置问题 - Linux.do](https://linux.do/t/topic/155121)

Anonymous 2025-08-17

[@Anonymous](https://www.aloxaf.com/2025/04/how_to_use_geosite/#68a1e9509bb2173e656a4c90):

关于问题1. 在 Sing-Box 的官方文档中提到 [1.8.0 版本开始弃用 Geosite](https://sing-box.sagernet.org/zh/deprecated/#tun) 。

> Geosite 已废弃且将在 sing-box 1.12.0 中被移除。  
> Geosite，即由 V2Ray 维护的 domain-list-community 项目，作为早期流量绕过解决方案， 存在着包括缺少维护、规则不准确和管理困难内的大量问题。  
> sing-box 1.8.0 引入了规则集， 可以完全替代 Geosite，参阅 迁移指南。

匿名 2025-10-08

[@Anonymous](https://www.aloxaf.com/2025/04/how_to_use_geosite/#68a1e9509bb2173e656a4c90):

1.我也看了七尺宇的视频就一直是用的Ruleset，但是我问ai说只是启动时间（规则写入内存）长几秒，内存占用多几十M，查询的速度是一样的。  
3.我去看了还真是，他cn、proxy基本就是作者的思路，我现在正在用，而且rules写得极简哈哈，用两天看看效果。

[Aloxaf](https://www.aloxaf.com/) 博主 2025-10-10

[@Anonymous](https://www.aloxaf.com/2025/04/how_to_use_geosite/#68a1e9509bb2173e656a4c90):

格式和准确率没有关系。

ruleset 中的 classical 匹配慢，domain/ipcidr 速度快，但启动时生成相关数据结构需要更多资源，mrs 就没有什么缺点了，甚至更好。geosite 主要优势是按需加载，也就是引用少量规则不需要加载整个 geosite，但是大部分人的规则都会加载整个 geosite，也没啥优势。

其实我一开始也说了，我嫌弃 ruleset 主要是一个个引用太麻烦。你推荐的这个 geosite 倒是不错，把 ruleset 也整合进来，倒是很符合我这种懒人需求。

[妮妮薅羊毛](https://t.me/NiNiShare/) 2025-11-06

[@Anonymous](https://www.aloxaf.com/2025/04/how_to_use_geosite/#68a1f0c087754e1f6118bc23):

经过我的对比，Geosite确实更消耗性能，速度更慢，打算换回 Ruleset 去了。

he11o 2025-06-22

实际使用还是nameserver-policy更合理，我也曾想过只用direct-nameserver和nameserver，国内域名用direct-nameserver，剩余的域名用走了代理的nameserver，简洁明了，但是使用fake-ip时不用nameserver-policy的话，fake-ip-filter内的域名会默认发给走了代理的nameserver解析，打个比方cloud.tencent.com实际是应该由本地应答一个国内真实ip的，但是走了代理解析返回一个国外ip。虽然会到了rule阶段会被direct-nameserver兜回来重新用本地dns解析然后直连，但是实际发生了两次解析，而且不是同一个结果，不知对一些其他的需要真实ip的域名会不会影响，因为首次应答和真实连接ip不一致。当然如果是只按你举例的规则只检测连通性的域名应该问题不大。

Anonymous 2025-06-07

geosite 下并没有geolocation-!cn@cn分表，没人建表，这种方法实现不了

Anonymous 2025-05-26

优化手机上 Meta 的规则，搜索 “geosite dns 规则” 直接排在第二:laugh and cry:  
看上去使用 geosite 和合理配置 dns 就可以免去导入大量 ruleset 和瞎配 dns 导致的莫名其妙的问题……

Dk 2025-05-26

使用geolocation-!cn规则的话，是不是相当于只能用单节点访问这里面的域名了，没法做到极致分流  
比如，美洲geoip的用美国节点，欧洲的geoip用欧洲节点  
最理想的状态应该是有全球cdn的站，把cdn域名和ip分流到最近的节点，剩下的按照geoip来分配节点，最后再用一个节点兜底

Anonymous 2025-05-21

[https://github.com/felixonmars/dnsmasq-china-list/blob/master/accelerated-domains.china.conf](https://github.com/felixonmars/dnsmasq-china-list/blob/master/accelerated-domains.china.conf) 里面的规则适用于 dns.rules，而不是 route.rules，不要再说人家是错误分流，明明是下游错误引用。

Anonymous 2025-05-21

[@Anonymous](https://www.aloxaf.com/2025/04/how_to_use_geosite/#682d8cb766feef6bbffeba09):

我觉得你有必要补充这个规则。 [https://github.com/blackmatrix7/ios\_rule\_script](https://github.com/blackmatrix7/ios_rule_script)

[Aloxaf](https://www.aloxaf.com/) 2025-07-16

[@Anonymous](https://www.aloxaf.com/2025/04/how_to_use_geosite/#682d8cb766feef6bbffeba09):

我的意思就是不应该用它来分流。我修正了一下文章中的说法，避免误解。

Sayu 2025-11-27

[@Anonymous](https://www.aloxaf.com/2025/04/how_to_use_geosite/#682d90485904895a9ee1fc8c):

这个规则的China规则域名太少，而Chinamax也错误的引用了dnsmasq-china-list。

Powered by [Waline](https://github.com/walinejs/waline) v3.6.0

[^1]: [tiktok.com为什么归到cn? · Issue #1585 · v2fly/domain-list-community · GitHub](https://github.com/v2fly/domain-list-community/issues/1585)

[^2]: [accelerated-domains.china.conf 不应作为 geosite:cn 的上游 · Issue #399 · Loyalsoldier/v2ray-rules-dat · GitHub](https://github.com/Loyalsoldier/v2ray-rules-dat/issues/399)

[^3]: [存在多条冗余域名，筛除脚本可能有 bug · Issue #483 · felixonmars/dnsmasq-china-list · GitHub](https://github.com/felixonmars/dnsmasq-china-list/issues/483)

[^4]: [是否可以添加steam@cn对下载时的支持 · Issue #254 · Loyalsoldier/v2ray-rules-dat · GitHub](https://github.com/Loyalsoldier/v2ray-rules-dat/issues/254)