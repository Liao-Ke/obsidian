## Windows

### 安装Git

Git下载链接：[https://git-scm.com/download/win](https://git-scm.com/download/win)  
下载完后安装，所有安装选项选择默认值。

### 创建并初始化Git仓库

#### 创建Git仓库

首先创建Git仓库，用于保存笔记文件。可以选择Github或Gitee，连接Github经常不稳定，所以这里选择用的是Gitee，建议仓库类型为私有。

[![](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302165820.png)](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302165820.png)

#### 初始化仓库

点击初始化readme文件

[![](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302180218.png)](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302180218.png)

#### [](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/index.html#Clone-Git%E4%BB%93%E5%BA%93 "Clone Git仓库")Clone Git仓库

cmd

|   |   |
|---|---|
|1  <br>2|cd 用于vault仓库的目录  <br>git clone https://gitee.com/YourName/Note.git "Note"|

如果提示需要账号密码，按照提示输入。

#### Obsidian创建vault仓库

##### 选择打开本地仓库并选择clone的Git仓库文件夹

效果如下：

[![](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302180404.png)](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302180404.png)

#### Obsidian为当前仓库安装Git插件

##### 设置->选项->第三方插件->关闭安全模式-浏览插件市场

注：因为Github网络问题，可能出现无法加载社区插件的提示，推荐安装FastGithub进行加速，下载完成后解压，点击FastGithub.UI.exe运行。

FastGithub下载地址：[https://cloud.tsinghua.edu.cn/d/df482a15afb64dfeaff8/](https://cloud.tsinghua.edu.cn/d/df482a15afb64dfeaff8/)

[![](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302173507.png)](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302173507.png)

##### [](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/index.html#%E6%90%9C%E7%B4%A2%E5%B9%B6%E5%AE%89%E8%A3%85%E5%90%AF%E7%94%A8Git "搜索并安装启用Git")搜索并安装启用Git

[![](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302174506.webp)](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302174506.webp)

##### [](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/index.html#%E9%85%8D%E7%BD%AEGit%E6%8F%92%E4%BB%B6 "配置Git插件")配置Git插件

[![](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302180623.webp)](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302180623.webp)

yaml

|   |   |
|---|---|
|1  <br>2  <br>3  <br>4  <br>5  <br>6  <br>7|Automatic :   <br>	Vault backup interval : 1  <br>	Auto backup after latest commit : true  <br>	Auto pull interval : 5  <br>Commit Author :  <br>	Author name for commit :  your user name on git #按照实际情况填写  <br>	Author email for commit :  your email on git #按照实际情况填写|

效果查看  
新建笔记，预计30秒左右，Obsidian自动提交文件到Gitee仓库中

[![](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302181457.png)](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302181457.png)

## Mobile

### 创建Obsidian仓库 （Create new vault）

iphone不要开启 Store in iCloud

[![](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/createvault.png)](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/createvault.png)

### 安装Git插件

#### 设置->选项->第三方插件->关闭安全模式-浏览插件市场

安装方式与Windows端相同，如果出现插件市场未找到相关插件的问题，可以将刚刚Windows端的vault仓库中的/.obsidian/plugins文件夹复制到手机端的vault仓库中（.obsidian也需要）

#### 启用Git插件

提示先忽略

[![](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/git.png)](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/git.png)

#### 配置Git插件

如何获取Gitee Personal access token？

1. ##### )头像->设置->安全设置->私人密钥->生成新令牌->提交
    
    [![](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302190041.webp)](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/20240302190041.webp)
2. ##### 设置Git插件
    

设置->第三方插件->Git

```yaml
Authentication/Commit Author  
UserName : your user name on github or gitee  
Password/Personal access token : your password/personal access token on github or gitee
```

3. #####拉取仓库到本地
    

关闭设置，打开命令面板（命令面板在右下角）  
[![](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/cmd.png)](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/cmd.png)

4. #####  选择“Git: Clone existing remote repo”
    
5. ##### 输入Gitee repo URL
    
    例如[https://gitee.com/YourName/Note.git](https://gitee.com/YourName/Note.git)
    
6. ##### 选择Vault Root
    
7. ##### 提示repo是否包含.obsidian文件夹
    

选择YES，因为刚刚在电脑端Push到仓库中

8. ##### 选择DELETE ALL YOUR LOCAL CONFIG AND PLUGINS
    
9. ##### 选择空行，拉取仓库中的全部内容
    
10. ##### 配置Git提交的username和email
    



```yaml
Authentication/Commit Author  
	Author name for commit : your user name on git #按照实际情况填写  
	Author email for commit : your email on git #按照实际情况填写
```
### 完成

参考链接：[https://publish.obsidian.md/git-doc/Getting+Started](https://publish.obsidian.md/git-doc/Getting+Started)

文章作者: [lichong](https://ilico.cn/)

文章链接: [https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/](https://ilico.cn/2024/03/02/%E5%9F%BA%E4%BA%8EGit%E7%9A%84Obsidian%E7%AC%94%E8%AE%B0%E5%90%8C%E6%AD%A5%E6%95%99%E7%A8%8B/)

版权声明: 本博客所有文章除特别声明外，均采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。转载请注明来自 [Lee](https://ilico.cn/)！