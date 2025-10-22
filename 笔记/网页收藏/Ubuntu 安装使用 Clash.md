---
来自: "https://blog.thatcoder.cn/Clash%20For%20Linux/#%E6%B3%A8%E5%86%8C%E4%B8%BA%E7%B3%BB%E7%BB%9F%E6%9C%8D%E5%8A%A1"
收藏时间: 2025年10月19日 日 21:23:13
tags:
  - "网页收藏"
---
> [!note] 摘要
> Ubuntu 安装使用 Clash 教程，介绍 Clash 安装、配置和系统服务注册过程，并提供在线管理选项。文章还提到了配置文件和系统服务文件的创建方法。


AI摘要

GPT

介绍自己

推荐文章

生成摘要

## 前言

适用范围建立在使用过 window IOS 下的 Clash 为基础的半安装教程

## 步骤

1. 取出之前设备配置
2. 安装配置Clash
3. 注册为系统服务
4. 在线管理Clash

## 取出配置

备好两个文件

1. Country.mmdb
2. profiles/xxxxxxxx.yml
![打开目录找到两个文件](https://upyun.thatcdn.cn/myself/typora/202307301651854.png)

打开目录找到两个文件

## 安配 Clash

### 安装 Clash

下载解压并命名为 clash

- 解压
- 重命名
- 移动到 /usr/local/bin/ 目录下 (方便在任何位置调用Clash)
- 查看版本
- [下载地址](https://github.com/Dreamacro/clash/releases)

### 配置 Clash

1. 首次启动  
	命令行输入clash即可, 一般会提示失败(不重要), 目的是生成配置文件
2. 找到配置目录一般在 /用户/.config/clash/ 即 /root/.config/clash
3. 放置全球IP库  
	把之前准备的 Country.mmdb 放进去
4. 写配置文件  
	创建一个 config.yaml
```yaml
config.yaml# port of HTTP
# port: 7890  ## 解释掉该行，使用mixed-port

# port of SOCKS5
# socks-port: 7891 ## 解释掉该行，使用mixed-port
mixed-port: 52443 ## 提供统一的端口

authentication: ## 增加配置，设置账号和密码
  - "username:password"

# web ui 配置
external-controller: 0.0.0.0:52444  # web ui 监听地址
secret: "xxxxxxxxxxxxx"  # web ui 密钥

# allow-lan: false
allow-lan: true ## 允许局域网连接

# Rule / Global/ DIRECT (default is Rule)
mode: rule

# external-ui: dashboard ## 关闭external

## 以下贴订阅的配置
```

接着把之前准备的 /profiles/xxxxxxxx.yml 的文件dns开始到结尾的配置贴到 config.yaml 后面.  
window与linux配置不同的是前者读取profiles下的列表, 后者直接读取 config.yaml.

## 注册为系统服务

在/etc/systemd/system目录下创建clash.service文件

```yaml
clash.service[Unit]
Description=Clash Service
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/clash
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

以后就能直接使用熟悉的服务命令

```shell
systemctl enable clash  # 开机自启
systemctl start clash
systemctl restart clash
systemctl status clash
systemctl stop clash
```

## 在线管理

有两个选择, 根据config文件的 web ui 配置, 使用在线网站管理

1. yacd
		[yacd http://yacd.haishan.me/](http://yacd.haishan.me/ "yacd")
	![](https://upyun.thatcdn.cn/myself/typora/202307301742787.png)

如果你不用IP,已经反向代理使用域名并且使用Https, 也可以使用下面的https的yacd[博主的搭建的yacd https://clash.thatcoder.cn/](https://clash.thatcoder.cn/ "博主的搭建的yacd")

1. razord
	")
	[razord提供的(也许要科学上网) http://clash.razord.top/](http://clash.razord.top/ "razord提供的(也许要科学上网)")
	![](https://upyun.thatcdn.cn/myself/typora/202307301744235.png)

## 结语

**注意端口自行定义与放行**

本文为 撰写, 采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议, 转载请注明出处。