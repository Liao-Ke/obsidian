---
来自: "https://blog.rzlnb.top/posts/blog/hugo-blog-setup/"
收藏时间: 2025年10月06日 一 21:08:26
tags:
  - "网页收藏"
---
> [!note] 摘要
> 如何在 Hugo 中安装和配置 PaperMod主题，包括主题安装、基础设置和个性化配置，以及对hugo的具体设置。


### 前言

在搭建Hugo博客的过程中，我遇到了不少困难。主要原因是Hugo的版本迭代较快，导致网上很多教程已经过时。因此，我整理了这份详尽的指南，它包含了基础的搭建流程和本博客几乎所有的自定义配置和功能实现，希望能帮助你顺利完成搭建和定制。

## 1\. 快速开始

本章节将引导你快速完成 Hugo 的安装和站点的初步运行。

### 1.1. 安装 Hugo

确保安装 `extended` 版本，因为 PaperMod 主题的某些功能依赖于它。

- **Windows**: 推荐使用 [Chocolatey](https://chocolatey.org/) 或 [Winget](https://winstall.app/apps/Hugo.Hugo.Extended) 。
	```bash
	# 使用 Winget
	winget install Hugo.Hugo.Extended
	bash
	```
- **macOS**: 使用 [Homebrew](https://brew.sh/) 。
	```bash
	brew install hugo
	bash
	```

安装后，通过 `hugo version` 验证是否成功。

### 1.2. 创建站点并安装主题

```bash
git init
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
git submodule update --init --recursive
bash
```

### 1.3. 本地预览

通过 `hugo server -D` 启动本地服务器，默认访问地址为 `http://localhost:1313/` 。

## 2\. 核心概念

### 2.1. Hugo 项目结构

一个标准的 Hugo 项目包含以下目录：

```plaintext
my-blog/
├── archetypes/         # 内容模板
├── assets/             # 需要 Hugo Pipes 处理的资源 (SCSS, JS)
├── content/            # Markdown 内容
├── layouts/            # 模板布局 (覆盖主题)
├── static/             # 静态文件 (图片, 字体)
├── themes/             # 主题目录
└── hugo.yaml           # 核心配置文件
plaintext
```

### 2.2. 内容组织

所有文章和页面都存放在 `content/` 目录下，通过目录结构和 `_index.md` 文件来组织列表页和文章页。

## 3\. 核心配置文件 hugo.yaml

`hugo.yaml` 是控制整个站点的中枢。以下是本博客当前正在使用的配置，包含了大量自定义参数。

```yaml
baseURL: "https://blog.rzlnb.top/"
languageCode: "zh-cn"
title: "Coolzr's Blog"
theme: "PaperMod"

enableInlineShortcodes: true
enableEmoji: true
enableRobotsTXT: true
hasCJKLanguage: true

buildDrafts: false
buildFuture: false
buildExpired: false

paginate: 15
summaryLength: 140

minify:
  disableXML: true

# 自定义文章永久链接格式为 \`/:title/\`
permalinks:
  post: "/:title/"

defaultContentLanguage: "zh-cn"
defaultContentLanguageInSubdir: false

languages:
  zh-cn:
    languageName: "简中"
    weight: 1
    params:
      homeInfoParams:
        Title: "欢迎来到我的博客！"
        Content: >
          ## 总得写点什么吧
    menu:
      main:
        - identifier: "search"
          name: "搜索"
          url: "search"
          weight: 10
        # ... 其他菜单项

outputs:
  home:
    - "HTML"
    - "RSS"
    - "JSON"

params:
  env: "production"
  description: "个人博客，记录和分享"
  author: "Coolzr"
  defaultTheme: "auto"
  ShowCodeCopyButtons: true
  ShowReadingTime: true
  ShowPostNavLinks: true
  ShowBreadCrumbs: true
  ShowWordCounts: true
  ShowLastMod: true
  ShowToc: true
  TocOpen: true
  comments: true

  # 网站左上角标签配置
  label:
    text: "Coolzr's Blog"
    icon: "https://img.rzlnb.top/file/1742633336031_IMG_20250225_1521199.png"
    iconHeight: 35

  # 社交图标 (新增 umami 统计页面链接)
  socialIcons:
    - name: "github"
      url: "https://github.com/rbetree"
    - name: "email"
      url: "mailto:rzlrong@outlook.com"
    - name: "rss"
      url: "index.xml"
    - name: "link"
      url: "https://umami.rzlnb.top/share/ymNY5tcAN7soVhBW/blog.rzlnb.top"

  # Favicon 和 Apple Touch Icon 配置
  assets:
    favicon: "https://img.rzlnb.top/file/1742633336031_IMG_20250225_1521199.png"
    # ... 其他尺寸图标

  # 列表页和文章页的封面显示策略
  cover:
    hidden: false
    hiddenInList: false
    hiddenInSingle: true

  # 搜索配置
  fuseOpts:
    keys: ["title", "permalink", "summary"]
    # ... 其他搜索选项

  # 页脚版权年份
  StartYear: 2024
  EndYear: 2025

# 允许在 Markdown 中使用原始 HTML
markup:
  goldmark:
    renderer:
      unsafe: true

# 添加 series（系列）作为一种分类方式
taxonomies:
  tag: tags
  series: series
yaml
```

## 4\. 页面创建与管理

此部分与标准 Hugo 用法一致，通过在 `content` 目录中创建 `.md` 文件来组织页面。本博客额外开启了 `series` 系列文章分类功能，可在文章的 front matter 中使用 `series: ["系列名称"]` 来组织文章。

## 5\. 高级自定义与功能扩展

这是本博客最具特色的部分，也是将一个标准主题改造成个性化站点的关键。

### 5.1. 布局与模板覆盖

通过在根目录 `layouts/` 下创建与主题内同路径的文件，可以安全地覆盖主题的任何部分。本博客覆盖了 `header.html`, `footer.html`, `single.html` 等多个核心模板，以实现深度定制化布局。

### 5.2. 自定义字体

博客全局使用了“霞鹜文楷”作为主要字体，提升中文阅读体验。

1. 字体文件存放在 `static/fonts/` 目录下。
2. 在 `assets/css/extended/custom.css` 中通过 `@font-face` 规则引入字体，并应用到 `body` 标签上。

### 5.3. 模块化 CSS 管理

为了便于维护，所有自定义样式都存放在 `assets/css/extended/` 目录下，并按功能拆分成多个文件，如：

- `custom.css`: 全局通用样式、滚动条、排版等。
- `friend-link.css`: 友链 shortcode 的专属样式。
- `hugo-easy-gallery.css`: 相册画廊的样式。
- `comment.css`: 评论系统的样式。
- `toc.css`: 目录的样式。

所有这些CSS文件都在 `layouts/partials/extend_head.html` 中被统一加载。

### 5.4. 功能集成

通过修改 `layouts/partials/extend_head.html` 和 `footer.html` ，我们集成了多个第三方功能：

- **Heti 中文排版**: 自动优化中英文混排时的标点和间距。
- **Busuanzi 网站统计**: 在页脚显示站点总访问量和文章阅读次数。

### 5.5. 双侧边栏浮动布局

在PC端宽屏下，博客文章页呈现“左侧目录、中间内容、右侧最新文章”的三栏布局，这完全是通过自定义实现的。

**1\. HTML 结构 (`single.html`)**

首先，在 `layouts/_default/single.html` 中，将目录和最新文章的模板直接放置在正文内容 `<div>` 之前。

```html
... 
{{- partial "toc.html" . }}
{{- partial "recent-posts.html" . }}
<div class="post-content">{{ .Content }}</div>
...
html
```

**2\. CSS 绝对定位**

随后，通过给目录和最新文章的容器添加自定义CSS，将它们“请出”标准文档流，并放置在内容区域的两侧。

- **目录 (左侧)**: 在 `assets/css/extended/toc.css` 中，使用 `position: absolute` 将其定位到左侧外部，再用 `position: sticky` 让其在滚动时固定。
	```css
	.toc-container.wide {
	    position: absolute;
	    left: calc((var(--toc-width) + var(--gap)) * -0.85);
	    width: var(--toc-width);
	}
	.wide .toc {
	    position: sticky;
	    top: var(--gap);
	}
	css
	```
- **最新文章 (右侧)**: 在 `assets/css/extended/custom.css` 中，使用类似的技术将其定位到右侧。
	```css
	.recent-container.wide {
	    position: absolute;
	    right: calc((var(--toc-width) + var(--gap)) * -0.85);
	    width: var(--toc-width);
	}
	.wide .recent {
	    position: sticky;
	    top: var(--gap);
	}
	css
	```

**3\. 响应式处理**

最后，通过 `@media` 查询，在屏幕宽度小于某个值（如 `1400px` ）时，将这两个侧边栏 `display: none;`，以保证在移动设备上的阅读体验。

## 6\. 部署与维护

### 6.1. 版本控制与主题更新

使用 `git submodule update --remote --merge` 命令可以方便地更新 PaperMod 主题，同时保留你的自定义修改。

### 6.2. 部署

关于如何将你的静态博客免费部署到线上，请参考我的另一篇文章： [使用 Hugo + GitHub + Cloudflare Pages 搭建个人博客](https://blog.rzlnb.top/posts/blog/hugo-blog-begin/)

## 7\. 总结

通过以上配置，你就可以搭建一个个性化的 Hugo 博客。

- **参考资料**:
	1. [Hugo 官方文档](https://gohugo.io/documentation/)
	2. [PaperMod 主题文档](https://github.com/adityatelange/hugo-PaperMod/wiki)