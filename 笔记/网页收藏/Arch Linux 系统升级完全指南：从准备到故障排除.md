---
来自: "https://geek-blogs.com/blog/arch-linux-upgrade/"
收藏时间: 2025年11月08日 六 17:06:38
tags:
  - "网页收藏"
---
> [!note] 摘要
> 本文介绍了 Arch Linux 系统升级的详细步骤，包括升级前准备、执行系统升级、升级后检查与维护、常见问题与解决方案等。文章强调了备份数据、更新软件包数据库、查阅官方新闻等关键步骤，并提供了针对常见问题的解决方案。


## 目录

1. [升级前准备](https://geek-blogs.com/blog/arch-linux-upgrade/#1-%E5%8D%87%E7%BA%A7%E5%89%8D%E5%87%86%E5%A4%87)
	- 1.1 [检查系统状态](https://geek-blogs.com/blog/arch-linux-upgrade/#11-%E6%A3%80%E6%9F%A5%E7%B3%BB%E7%BB%9F%E7%8A%B6%E6%80%81)
	- 1.2 [更新软件包数据库](https://geek-blogs.com/blog/arch-linux-upgrade/#12-%E6%9B%B4%E6%96%B0%E8%BD%AF%E4%BB%B6%E5%8C%85%E6%95%B0%E6%8D%AE%E5%BA%93)
	- 1.3 [查阅 Arch 官方新闻](https://geek-blogs.com/blog/arch-linux-upgrade/#13-%E6%9F%A5%E9%98%85-arch-%E5%AE%98%E6%96%B9%E6%96%B0%E9%97%BB)
	- 1.4 [备份关键数据](https://geek-blogs.com/blog/arch-linux-upgrade/#14-%E5%A4%87%E4%BB%BD%E5%85%B3%E9%94%AE%E6%95%B0%E6%8D%AE)
	- 1.5 [禁用非必要服务](https://geek-blogs.com/blog/arch-linux-upgrade/#15-%E7%A6%81%E7%94%A8%E9%9D%9E%E5%BF%85%E8%A6%81%E6%9C%8D%E5%8A%A1)
2. [执行系统升级](https://geek-blogs.com/blog/arch-linux-upgrade/#2-%E6%89%A7%E8%A1%8C%E7%B3%BB%E7%BB%9F%E5%8D%87%E7%BA%A7)
	- 2.1 [使用 Pacman 升级官方软件包](https://geek-blogs.com/blog/arch-linux-upgrade/#21-%E4%BD%BF%E7%94%A8-pacman-%E5%8D%87%E7%BA%A7%E5%AE%98%E6%96%B9%E8%BD%AF%E4%BB%B6%E5%8C%85)
	- 2.2 [处理软件包冲突与替换](https://geek-blogs.com/blog/arch-linux-upgrade/#22-%E5%A4%84%E7%90%86%E8%BD%AF%E4%BB%B6%E5%8C%85%E5%86%B2%E7%AA%81%E4%B8%8E%E6%9B%BF%E6%8D%A2)
	- 2.3 [升级 AUR 软件包](https://geek-blogs.com/blog/arch-linux-upgrade/#23-%E5%8D%87%E7%BA%A7-aur-%E8%BD%AF%E4%BB%B6%E5%8C%85)
3. [升级后检查与维护](https://geek-blogs.com/blog/arch-linux-upgrade/#3-%E5%8D%87%E7%BA%A7%E5%90%8E%E6%A3%80%E6%9F%A5%E4%B8%8E%E7%BB%B4%E6%8A%A4)
	- 3.1 [验证服务状态](https://geek-blogs.com/blog/arch-linux-upgrade/#31-%E9%AA%8C%E8%AF%81%E6%9C%8D%E5%8A%A1%E7%8A%B6%E6%80%81)
	- 3.2 [更新 initramfs（如必要）](https://geek-blogs.com/blog/arch-linux-upgrade/#32-%E6%9B%B4%E6%96%B0-initramfs-%E5%A6%82%E5%BF%85%E8%A6%81)
	- 3.3 [清理孤儿软件包](https://geek-blogs.com/blog/arch-linux-upgrade/#33-%E6%B8%85%E7%90%86%E5%AD%A4%E5%84%BF%E8%BD%AF%E4%BB%B6%E5%8C%85)
	- 3.4 [重启系统（如必要）](https://geek-blogs.com/blog/arch-linux-upgrade/#34-%E9%87%8D%E5%90%AF%E7%B3%BB%E7%BB%9F-%E5%A6%82%E5%BF%85%E8%A6%81)
4. [常见问题与解决方案](https://geek-blogs.com/blog/arch-linux-upgrade/#4-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E4%B8%8E%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88)
	- 4.1 [部分升级（Partial Upgrade）](https://geek-blogs.com/blog/arch-linux-upgrade/#41-%E9%83%A8%E5%88%86%E5%8D%87%E7%BA%A7partial-upgrade)
	- 4.2 [内核升级后无法启动（Kernel Panic）](https://geek-blogs.com/blog/arch-linux-upgrade/#42-%E5%86%85%E6%A0%B8%E5%8D%87%E7%BA%A7%E5%90%8E%E6%97%A0%E6%B3%95%E5%90%AF%E5%8A%A8kernel-panic)
	- 4.3 [AUR 软件包编译失败](https://geek-blogs.com/blog/arch-linux-upgrade/#43-aur-%E8%BD%AF%E4%BB%B6%E5%8C%85%E7%BC%96%E8%AF%91%E5%A4%B1%E8%B4%A5)
	- 4.4 [Pacman 锁文件冲突](https://geek-blogs.com/blog/arch-linux-upgrade/#44-pacman-%E9%94%81%E6%96%87%E4%BB%B6%E5%86%B2%E7%AA%81)
	- 4.5 [桌面环境功能异常](https://geek-blogs.com/blog/arch-linux-upgrade/#45-%E6%A1%8C%E9%9D%A2%E7%8E%AF%E5%A2%83%E5%8A%9F%E8%83%BD%E5%BC%82%E5%B8%B8)
5. [最佳实践总结](https://geek-blogs.com/blog/arch-linux-upgrade/#5-%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5%E6%80%BB%E7%BB%93)
6. [参考资料](https://geek-blogs.com/blog/arch-linux-upgrade/#6-%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99)

## 1\. 升级前准备

升级前的准备工作是避免系统故障的关键。切勿跳过此步骤！

### 1.1 检查系统状态

首先确保系统处于健康状态，避免在异常环境下升级：

- **检查磁盘空间** ：升级需要足够的临时空间和目标分区空间，使用 `df -h` 查看：
	```bash
	df -h  # 重点关注根分区（/）和 /var 分区的可用空间
	```
	若根分区空间不足（建议保留至少 5GB 空闲），可通过清理缓存（ `pacman -Sc` ）或删除无用文件释放空间。
- **检查电池电量** （仅笔记本用户）：确保电池电量充足（至少 50%），或连接电源，避免升级过程中意外断电。
- **检查网络连接** ：升级需要稳定的网络，建议使用有线连接；无线连接需确保信号良好。

### 1.2 更新软件包数据库

Arch 的软件包元数据（版本、依赖关系等）存储在本地数据库中，升级前需先同步数据库：

```bash
sudo pacman -Sy  # -S：同步软件包，-y：刷新数据库（等同于 --refresh）
```

> **注意** ：单独执行 `pacman -Sy` 仅更新数据库，不会升级软件包。若后续未立即升级，可能导致「部分升级」风险（见 4.1 节）。

### 1.3 查阅 Arch 官方新闻

**这是最重要的步骤之一！** Arch 官方会在重大变更（如软件包替换、配置文件修改、需手动干预的升级）前发布新闻公告。例如：内核升级可能需要更新 bootloader，或某个软件包被重命名需手动卸载旧版本。

- **查看方式** ：
	- 访问 [Arch Linux 新闻页面](https://archlinux.org/news/) （英文）；
	- 使用命令行工具 `archnews` （需安装 `archlinux-news` 包）：
		```bash
		sudo pacman -S archlinux-news  # 安装工具
		archnews  # 查看最近新闻
		```

**示例场景** ：若新闻提到「 `networkmanager 1.42.0-1` 需手动重启服务」，则升级后需执行 `sudo systemctl restart NetworkManager` 。

### 1.4 备份关键数据

尽管升级通常安全，但仍建议备份重要数据，尤其是以下内容：

- 用户文件（ `/home/<用户名>` ）；
- 系统配置文件（ `/etc/` 目录，可使用 `etckeeper` 版本控制）；
- 分区表和启动项（使用 `parted` 或 `gdisk` 备份）。

**简易备份示例** （使用 `rsync` 备份 `/home` 到外部存储）：

```bash
rsync -av --delete /home/<用户名> /mnt/external_drive/home_backup/
```

> **进阶工具** ：使用 Timeshift 或 Snapper 创建系统快照，支持一键回滚。

### 1.5 禁用非必要服务

升级过程中，后台服务（如数据库、Web 服务器）可能因文件更新导致冲突。建议临时禁用非必要服务：

```bash
sudo systemctl stop docker nginx  # 示例：停止 Docker 和 Nginx

sudo systemctl disable docker nginx  # 若需彻底禁用（升级后再重新启用）
```

升级完成后，记得重新启用并启动服务：

```bash
sudo systemctl enable --now docker nginx
```

## 2\. 执行系统升级

完成准备工作后，即可开始升级。Arch 的升级核心工具是 `pacman` ，针对官方仓库；AUR 包需用额外工具（如 `yay` 、 `paru` ）处理。

### 2.1 使用 Pacman 升级官方软件包

**完整升级命令** （强烈推荐）：

```bash
sudo pacman -Syu  # -S：同步并安装，-y：刷新数据库，-u：升级所有已安装包（--sysupgrade）
```

> **为什么必须用 `-Syu` ？**  
> `-Syu` 会先同步数据库（ `-y` ），再升级所有包（ `-u` ），确保所有包基于最新依赖关系升级，避免「部分升级」（见 4.1 节）。 **切勿单独使用 `-Su`** （仅升级已安装包，不刷新数据库，可能导致依赖不匹配）。

执行后， `pacman` 会列出待升级的包及其大小，询问是否继续（ `Proceed with installation? [Y/n]` ），输入 `Y` 确认。

### 2.2 处理软件包冲突与替换

升级过程中， `pacman` 可能提示以下冲突，需谨慎处理：

#### 2.2.1 软件包替换（Replacement）

当一个包被另一个包取代时（如 `python2` 被 `python` 取代）， `pacman` 会提示：

```
:: 软件包 A 将被 B 取代，是否继续？ [Y/n]
```

**处理方式** ：通常直接按 `Y` 确认，除非官方新闻特别说明需手动干预。

#### 2.2.2 文件冲突（File Conflict）

若升级时某个文件已被手动修改或由其他包占用， `pacman` 会报错：

```
错误：无法提交事务（文件冲突）
...
文件 /usr/share/example.conf 已存在于文件系统中（属于 包C）
```

**处理方式** ：

- 优先检查该文件是否为自定义配置：若为 `/etc/` 下的配置（如 `/etc/fstab` ），建议备份后删除冲突文件，再重试升级；
- 若确认是系统文件冲突，可使用 `--overwrite` 强制覆盖（ **谨慎使用！** ）：
	```bash
	sudo pacman -Syu --overwrite /usr/share/example.conf  # 仅覆盖指定文件
	# 或覆盖所有冲突文件（风险较高）：
	sudo pacman -Syu --overwrite '*'
	```
	> **警告** ： `--overwrite` 可能导致自定义配置丢失，仅在确认无重要数据时使用。

### 2.3 升级 AUR 软件包

AUR（Arch User Repository）是用户贡献的非官方仓库，需通过 AUR 助手（如 `yay` 、 `paru` ）管理。升级 AUR 包的步骤：

1. **确保 AUR 助手已更新** ：
	```bash
	yay -Syu yay  # 使用 yay 升级自身（部分助手需手动更新）
	```
2. **升级所有 AUR 包** ：
	```bash
	yay -Sua  # -Su：升级，-a：仅 AUR 包（不升级官方包，避免与 pacman 重复）
	# 或使用 paru：
	paru -Sua
	```
	> **注意** ：AUR 包由用户维护，可能存在兼容性问题。若编译失败，需检查 PKGBUILD 或查看 AUR 页面的评论区（见 4.3 节）。

## 3\. 升级后检查与维护

升级完成不代表结束，需执行一系列检查确保系统正常运行。

### 3.1 验证服务状态

升级可能导致服务启动失败（如配置文件格式变化），使用以下命令检查失败的服务：

```bash
systemctl --failed  # 列出所有启动失败的服务
```

若有失败服务（如 `nginx.service` ），查看日志定位问题：

```bash
journalctl -u nginx.service  # 查看 nginx 服务日志
```

根据日志修复配置后，重启服务：

```bash
sudo systemctl restart nginx.service
```

### 3.2 更新 initramfs（如必要）

initramfs 是启动时加载的临时文件系统，包含内核模块和启动脚本。 **内核升级后必须更新 initramfs** ，否则可能无法启动。

检查是否升级了内核：

```bash
uname -r  # 当前运行的内核版本

pacman -Q linux  # 已安装的内核版本
```

若两者版本不一致（即内核已升级但未重启），执行：

```bash
sudo mkinitcpio -P  # -P：为所有已安装内核生成 initramfs（--allpresets）
```

> **mkinitcpio 配置** ：若修改了 `/etc/mkinitcpio.conf` （如添加模块），也需执行 `mkinitcpio -P` 生效。

### 3.3 清理孤儿软件包

「孤儿包」指不再被任何已安装包依赖的多余包，可安全删除以节省空间：

```bash
pacman -Qdt  # 列出孤儿包（-Q：查询，-d：仅依赖包，-t：未被依赖）

sudo pacman -Rns $(pacman -Qdtq)  # 删除孤儿包及其配置文件（-Rns：删除、卸载依赖、删除配置）
```

### 3.4 重启系统（如必要）

以下情况建议重启：

- 内核升级（必须重启才能加载新内核）；
- 核心库升级（如 `glibc` 、 `systemd` ）；
- 桌面环境或显示服务器升级（如 `Xorg` 、 `Wayland` ）。

重启命令：

```bash
sudo reboot
```

重启后，验证系统是否正常启动，功能是否完整。

## 4\. 常见问题与解决方案

即使按流程操作，升级仍可能遇到问题。以下是高频问题及解决方法。

### 4.1 部分升级（Partial Upgrade）

**问题描述** ：仅升级部分包而未同步依赖，导致系统库版本不匹配，表现为程序崩溃、命令无法执行（如 `error while loading shared libraries: libxxx.so.2: cannot open shared object file` ）。

**原因** ：使用 `pacman -Su` 而非 `-Syu` ，或 `pacman -Sy` 后未立即升级。

**解决方案** ：

1. 强制同步数据库并完整升级：
	```bash
	sudo pacman -Syu --overwrite '*'  # 覆盖冲突文件（谨慎使用）
	```
2. 若升级失败，可能需要从 live CD 启动，挂载系统并修复：
	```bash
	# 从 live CD 启动后，挂载根分区（假设根分区为 /dev/sda2）
	mount /dev/sda2 /mnt
	# 绑定必要目录
	mount --bind /dev /mnt/dev
	mount --bind /proc /mnt/proc
	mount --bind /sys /mnt/sys
	# chroot 到系统
	arch-chroot /mnt
	# 执行完整升级
	pacman -Syu
	```

### 4.2 内核升级后无法启动（Kernel Panic）

**问题描述** ：重启后黑屏，显示 `Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)` 。

**原因** ：通常是 initramfs 未更新，或 bootloader（如 GRUB）未识别新内核。

**解决方案** ：

1. 从 live CD 启动，chroot 到系统（步骤同 4.1）；
2. 重新生成 initramfs：
	```bash
	mkinitcpio -P  # 生成所有内核的 initramfs
	```
3. 更新 GRUB 配置（若使用 GRUB）：
	```bash
	grub-mkconfig -o /boot/grub/grub.cfg
	```
4. 重启系统。

### 4.3 AUR 软件包编译失败

**问题描述** ：使用 `yay` 升级 AUR 包时，提示编译错误（如 `make: *** [Makefile:xx: target] Error 1` ）。

**原因** ：AUR 包源码未适配最新依赖，或缺少构建依赖。

**解决方案** ：

1. 检查构建依赖是否安装：
	```bash
	yay -Si 包名  # 查看 AUR 包的依赖
	sudo pacman -S 依赖名  # 手动安装缺失的依赖
	```
2. 重新编译并强制覆盖：
	```bash
	yay -S --rebuild 包名  # --rebuild：强制重新编译
	```
3. 若仍失败，查看 AUR 包页面（ [https://aur.archlinux.org/packages/包名）的「评论」或「Issues」，寻找其他用户的解决方案。](https://aur.archlinux.org/packages/%E5%8C%85%E5%90%8D%EF%BC%89%E7%9A%84%E3%80%8C%E8%AF%84%E8%AE%BA%E3%80%8D%E6%88%96%E3%80%8CIssues%E3%80%8D%EF%BC%8C%E5%AF%BB%E6%89%BE%E5%85%B6%E4%BB%96%E7%94%A8%E6%88%B7%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%E3%80%82)

### 4.4 Pacman 锁文件冲突

**问题描述** ：执行 `pacman` 命令时提示：

```
错误：无法获得 /var/lib/pacman/db.lck 的锁（已被进程 XXXX 持有）
```

**原因** ：上一次 `pacman` 操作异常中断（如断电），导致锁文件未释放。

**解决方案** ：删除锁文件：

```bash
sudo rm /var/lib/pacman/db.lck
```

### 4.5 桌面环境功能异常

**问题描述** ：升级后桌面环境（如 GNOME、KDE）卡顿、图标消失或应用无法启动。

**原因** ：桌面环境组件与系统库版本不匹配，或扩展/插件过时。

**解决方案** ：

- **GNOME 用户** ：禁用所有扩展，重启后逐个启用排查问题：
	```bash
	gnome-extensions disable --all  # 禁用所有扩展
	```
- **KDE 用户** ：删除缓存文件，重启 plasmashell：
	```bash
	rm -rf ~/.cache/plasma*
	kquitapp5 plasmashell && plasmashell &
	```
- 重新安装桌面环境核心包：
	```bash
	sudo pacman -S gnome  # 或 kde-plasma-desktop
	```

## 5\. 最佳实践总结

遵循以下习惯，可大幅降低升级风险：

1. **定期升级** ：建议每周升级一次，避免长时间积累变更导致冲突；
2. **升级前必看新闻** ：始终先访问 [Arch News](https://archlinux.org/news/) ，重点关注「需要手动干预」的公告；
3. **备份关键数据** ：至少备份 `/home` 和 `/etc` ，推荐使用系统快照工具；
4. **优先使用官方仓库** ：AUR 包仅在必要时使用，选择评分高、维护频繁的包；
5. **避免部分升级** ：永远使用 `sudo pacman -Syu` ，不单独使用 `-Su` 或 `-Sy` ；
6. **及时清理系统** ：定期清理孤儿包（ `pacman -Rns $(pacman -Qdtq)` ）和缓存（ `pacman -Sc` ）；
7. **测试风险操作** ：若对某个升级有疑虑（如内核大版本更新），可先在虚拟机中测试。

## 6\. 参考资料

- [Arch Linux 官方 Wiki - System maintenance](https://wiki.archlinux.org/title/System_maintenance)
- [Arch Linux 官方 Wiki - Pacman](https://wiki.archlinux.org/title/Pacman)
- [Arch Linux 官方新闻](https://archlinux.org/news/)
- [Arch Linux 官方 Wiki - AUR](https://wiki.archlinux.org/title/Arch_User_Repository)
- [Arch Linux 官方 Wiki - Partial upgrades](https://wiki.archlinux.org/title/Partial_upgrades)

---

通过本文的步骤，你可以安全、高效地完成 Arch Linux 系统升级。记住：滚动发布的核心是「持续维护」，而非「一次性升级」。保持良好的升级习惯，你的 Arch 系统将始终稳定、最新！