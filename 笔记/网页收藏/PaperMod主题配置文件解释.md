---
来自: "https://www.cnblogs.com/iXiAo9/p/18685327"
收藏时间: 2025年10月07日 二 20:55:50
tags:
  - "网页收藏"
---
> [!note] 摘要
> PaperMod主题配置文件解释
> 
> 本文详细解释了PaperMod主题的配置文件，包括基本元数据、显示和布局选项、其他设置、封面图像、编辑文章链接、搜索配置、菜单配置、语法高亮设置等。


### 原配置文件

```yaml
baseURL: "https://examplesite.com/"
title: ExampleSite
paginate: 5
theme: PaperMod

enableRobotsTXT: true
buildDrafts: false
buildFuture: false
buildExpired: false

googleAnalytics: UA-123-45

minify:
  disableXML: true
  minifyOutput: true

params:
  env: production # to enable google analytics, opengraph, twitter-cards and schema.
  title: ExampleSite
  description: "ExampleSite description"
  keywords: [Blog, Portfolio, PaperMod]
  author: Me
  # author: ["Me", "You"] # multiple authors
  images: ["<link or path of image for opengraph, twitter-cards>"]
  DateFormat: "January 2, 2006"
  defaultTheme: auto # dark, light
  disableThemeToggle: false

  ShowReadingTime: true
  ShowShareButtons: true
  ShowPostNavLinks: true
  ShowBreadCrumbs: true
  ShowCodeCopyButtons: false
  ShowWordCount: true
  ShowRssButtonInSectionTermList: true
  UseHugoToc: true
  disableSpecial1stPost: false
  disableScrollToTop: false
  comments: false
  hidemeta: false
  hideSummary: false
  showtoc: false
  tocopen: false

  assets:
    # disableHLJS: true # to disable highlight.js
    # disableFingerprinting: true
    favicon: "<link / abs url>"
    favicon16x16: "<link / abs url>"
    favicon32x32: "<link / abs url>"
    apple_touch_icon: "<link / abs url>"
    safari_pinned_tab: "<link / abs url>"

  label:
    text: "Home"
    icon: /apple-touch-icon.png
    iconHeight: 35

  # profile-mode
  profileMode:
    enabled: false # needs to be explicitly set
    title: ExampleSite
    subtitle: "This is subtitle"
    imageUrl: "<img location>"
    imageWidth: 120
    imageHeight: 120
    imageTitle: my image
    buttons:
      - name: Posts
        url: posts
      - name: Tags
        url: tags

  # home-info mode
  homeInfoParams:
    Title: "Hi there \U0001F44B"
    Content: Welcome to my blog

  socialIcons:
    - name: x
      url: "https://x.com/"
    - name: stackoverflow
      url: "https://stackoverflow.com"
    - name: github
      url: "https://github.com/"

  analytics:
    google:
      SiteVerificationTag: "XYZabc"
    bing:
      SiteVerificationTag: "XYZabc"
    yandex:
      SiteVerificationTag: "XYZabc"

  cover:
    hidden: true # hide everywhere but not in structured data
    hiddenInList: true # hide on list pages and home
    hiddenInSingle: true # hide on single page

  editPost:
    URL: "https://github.com/<path_to_repo>/content"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link

  # for search
  # https://fusejs.io/api/options.html
  fuseOpts:
    isCaseSensitive: false
    shouldSort: true
    location: 0
    distance: 1000
    threshold: 0.4
    minMatchCharLength: 0
    limit: 10 # refer: https://www.fusejs.io/api/methods.html#search
    keys: ["title", "permalink", "summary", "content"]
menu:
  main:
    - identifier: categories
      name: categories
      url: /categories/
      weight: 10
    - identifier: tags
      name: tags
      url: /tags/
      weight: 20
    - identifier: example
      name: example.org
      url: https://example.org
      weight: 30
# Read: https://github.com/adityatelange/hugo-PaperMod/wiki/FAQs#using-hugos-syntax-highlighter-chroma
pygmentsUseClasses: true
markup:
  highlight:
    noClasses: false
    # anchorLineNos: true
    # codeFences: true
    # guessSyntax: true
    # lineNos: true
    # style: monokai
```

### 第一部分

```yaml
1. enableRobotsTXT: true
作用：启用 robots.txt 文件。
解释：robots.txt 文件用于告诉搜索引擎哪些页面可以被爬取，哪些页面不应该被爬取。将此设置为 true 会生成该文件，从而帮助管理网站的爬虫访问权限。
2. buildDrafts: false
作用：是否构建草稿页面。
解释：如果设置为 true，Hugo 会构建那些标记为草稿的页面（即 draft: true）。将其设置为 false，表示不会构建草稿页面，只会构建已发布的页面。这是生产环境中常用的设置。
3. buildFuture: false
作用：是否构建未来的内容。
解释：如果设置为 true，Hugo 会构建那些发布日期在当前日期之后的页面（即 date 设置为未来的页面）。将其设置为 false，表示只构建已经发布的内容。
4. buildExpired: false
作用：是否构建过期的内容。
解释：如果设置为 true，Hugo 会构建那些设置了过期日期的页面（即 expire 设置为过去的页面）。将其设置为 false，表示不会构建已经过期的内容。
5. googleAnalytics: UA-123-45
作用：启用 Google Analytics。
解释：这里的 UA-123-45 是 Google Analytics 的追踪 ID。将其设置为实际的追踪 ID，可以将网站的访问数据发送到 Google Analytics，从而分析网站流量和用户行为。
6. minify:
作用：启用或禁用文件压缩（缩小）功能。

解释：minify 配置项用于压缩和优化输出的 HTML、CSS 和 JavaScript 文件，以减少文件大小并提高网站加载速度。以下是两个子配置项的作用：

disableXML: true

作用：禁用 XML 文件的压缩。
解释：默认情况下，Hugo 会压缩生成的 XML 文件（例如，sitemap.xml）。将此项设置为 true，则不会对 XML 文件进行压缩。
minifyOutput: true

作用：启用输出文件压缩。
解释：如果设置为 true，Hugo 会压缩生成的所有输出文件（如 HTML、CSS 和 JavaScript），以减少文件的大小，提高加载速度。
```

### 第二部分

```yaml
1. env: production
作用：设置站点的环境。
解释：env 参数通常用于区分不同的环境配置（如 production, development）。当设置为 production 时，启用一些生产环境下的功能，如 Google Analytics、OpenGraph、Twitter 卡片、以及 Schema.org 数据等。
2. title: ExampleSite
作用：站点的名称。
解释：这是站点的标题，会在网站的 <title> 标签中显示，并影响 SEO。
3. description: "ExampleSite description"
作用：站点的简短描述。
解释：该描述通常用于 SEO 优化（meta description），也会在分享网站时显示在搜索引擎和社交平台上。
4. keywords: [Blog, Portfolio, PaperMod]
作用：站点的关键词。
解释：用于 SEO 优化，帮助搜索引擎更好地理解和索引站点的内容。
5. author: Me
作用：站点的作者名称。
解释：设置作者的名字，通常会出现在文章或页面的元数据中，支持单个或多个作者。
6. images: ["<link or path of image for opengraph, twitter-cards>"]
作用：用于 OpenGraph 和 Twitter 卡片的图像链接。
解释：设置分享时显示的封面图像，通常是站点或文章的缩略图。支持 URL 或文件路径。
7. DateFormat: "January 2, 2006"
作用：设置日期格式。
解释：定义日期的显示格式，January 2, 2006 是 Go 模板语法的一种自定义格式，代表月份、日期和年份的显示顺序。
8. defaultTheme: auto # dark, light
作用：设置站点默认主题。
解释：设置主题的默认模式，可以是 dark 或 light，或设置为 auto，让主题自动根据用户设备的首选主题进行切换。
9. disableThemeToggle: false
作用：是否禁用主题切换按钮。
解释：如果设置为 true，则禁用用户手动切换主题的功能。默认情况下是 false，允许切换。
10. ShowReadingTime: true
作用：是否显示阅读时间。
解释：如果设置为 true，每篇文章将显示预计阅读时间，通常基于文章的字数来计算。
11. ShowShareButtons: true
作用：是否显示社交分享按钮。
解释：如果设置为 true，会在文章或页面上显示分享按钮，允许用户通过社交媒体分享文章。
12. ShowPostNavLinks: true
作用：是否显示文章导航链接。
解释：如果设置为 true，文章底部将显示导航链接，允许读者快速跳转到上一篇或下一篇文章。
13. ShowBreadCrumbs: true
作用：是否显示面包屑导航。
解释：如果设置为 true，会显示面包屑导航，帮助用户了解他们在站点中的位置。
14. ShowCodeCopyButtons: false
作用：是否显示代码复制按钮。
解释：如果设置为 true，在页面中的代码块旁边会显示一个复制按钮，允许用户一键复制代码。这里设置为 false，表示不显示该按钮。
15. ShowWordCount: true
作用：是否显示字数统计。
解释：如果设置为 true，文章页面会显示文章的字数，帮助用户了解文章的长度。
16. ShowRssButtonInSectionTermList: true
作用：是否在分类或标签页面中显示 RSS 订阅按钮。
解释：如果设置为 true，会在分类或标签的页面中显示一个 RSS 订阅按钮，允许用户订阅该分类或标签的文章更新。
17. UseHugoToc: true
作用：是否使用 Hugo 内置的目录功能。
解释：如果设置为 true，Hugo 会自动为文章生成目录，并显示在页面上，方便用户跳转到页面的不同部分。
18. disableSpecial1stPost: false
作用：是否禁用对第一篇文章的特殊处理。
解释：如果设置为 true，会禁用第一篇文章的一些特殊功能或样式，通常用于一些特定的定制需求。
19. disableScrollToTop: false
作用：是否禁用页面顶部滚动按钮。
解释：如果设置为 true，会禁用页面的滚动至顶部按钮，这个按钮通常出现在页面底部，帮助用户快速回到页面顶部。
20. comments: false
作用：是否启用评论功能。
解释：如果设置为 true，则会在文章页面启用评论功能，允许用户发表评论。false 表示禁用评论。
21. hidemeta: false
作用：是否隐藏元数据（如作者、发布日期等）。
解释：如果设置为 true，文章的元数据（如作者、日期等）将不会显示。默认情况下为 false，即显示这些信息。
22. hideSummary: false
作用：是否隐藏文章摘要。
解释：如果设置为 true，将不会显示文章的摘要或简介。false 表示显示。
23. showtoc: false
作用：是否显示目录（Table of Contents）。
解释：如果设置为 true，将显示文章的目录，方便读者跳转到文章的不同部分。
24. tocopen: false
作用：目录是否默认展开。
解释：如果设置为 true，文章的目录会默认展开，显示所有章节。false 表示目录默认是折叠的。
```

### 第三部分

```yaml
1. assets:
这一部分配置用于设置站点的图标和图像资源。

1.1 disableHLJS: true
作用：禁用 highlight.js。
解释：highlight.js 是一个用于高亮代码的库。如果你不希望在站点中使用代码高亮功能，可以将此项设置为 true 来禁用该功能。默认情况下，highlight.js 会自动启用，提供代码块的高亮显示。
1.2 disableFingerprinting: true
作用：禁用资源指纹（Fingerprinting）。
解释：当设置为 true 时，Hugo 不会为站点的静态资源（如 CSS、JS 文件）添加版本号（指纹）。资源指纹通常用于缓存控制，通过文件名中的哈希值标识文件的版本。如果禁用指纹，文件的 URL 不会自动变更，可能影响缓存更新。
1.3 favicon: "<link / abs url>"
作用：设置站点的 favicon 图标。
解释：favicon 是网站标签页显示的小图标。你可以提供一个链接或者绝对 URL，指向站点的 favicon 图标文件。例如：favicon: "https://example.com/favicon.ico"。
1.4 favicon16x16: "<link / abs url>"
作用：设置 16x16 像素大小的 favicon 图标。
解释：这是针对小尺寸显示的 favicon 图标，常用于浏览器标签页中的显示。
1.5 favicon32x32: "<link / abs url>"
作用：设置 32x32 像素大小的 favicon 图标。
解释：这是针对较大尺寸的 favicon 图标，通常用于 Windows 系统中的任务栏图标等。
1.6 apple_touch_icon: "<link / abs url>"
作用：设置适用于 Apple 设备的触摸屏图标（如 iPhone、iPad）。
解释：当用户将站点添加到他们的主屏幕时，iOS 系统会使用这个图标。你可以提供一个链接或绝对 URL，指向该图标文件。例如：apple_touch_icon: "https://example.com/apple-touch-icon.png"。
1.7 safari_pinned_tab: "<link / abs url>"
作用：设置用于 Safari 浏览器 的固定标签页图标。
解释：这是 Safari 浏览器中特殊的标签页图标，用于固定站点在标签页上的外观。你可以设置一个链接或绝对 URL 来指定该图标。
2. label:
这一部分配置用于设置站点标签的文本和图标。

2.1 text: "Home"
作用：设置标签的文本。
解释：这是显示在标签上的文本，通常用于表示站点的主页面或主页。这里设置为 Home，意味着标签上会显示“Home”这个文本。
2.2 icon: /apple-touch-icon.png
作用：设置标签的图标。
解释：这是为标签指定的图标，通常是用于导航、按钮或应用图标的图像。在这里，/apple-touch-icon.png 指向一个图像文件，表示将这个文件作为图标使用。
2.3 iconHeight: 35
作用：设置标签图标的高度。
解释：这表示图标的高度为 35 像素。它将影响图标的显示尺寸，确保它在标签上正确显示。
```

### 第四部分

```yaml
1. profileMode:
该部分配置用于启用个人资料模式，通常显示个人信息、头像和相关按钮链接，适用于用户希望在站点上展示个人介绍的场景。

1.1 enabled: false
作用：是否启用个人资料模式。
解释：如果设置为 true，启用个人资料模式，站点将显示个人信息、头像和按钮链接等。如果设置为 false，该模式将被禁用，个人资料相关内容将不显示。
1.2 title: ExampleSite
作用：个人资料页面的标题。
解释：这是显示在个人资料区域的标题，通常是站点名称或者用户的个人名字。
1.3 subtitle: "This is subtitle"
作用：个人资料页面的副标题。
解释：副标题用于提供更多关于个人或站点的描述，通常会展示一个简短的句子或引言。
1.4 imageUrl: "<img location>"
作用：设置头像的图片链接。
解释：这是用户的头像图像位置，可以是图像文件的路径或 URL 地址。例如：imageUrl: "https://example.com/avatar.png"。
1.5 imageWidth: 120
作用：设置头像图片的宽度。
解释：定义头像的显示宽度，单位是像素。这里设置为 120 像素。
1.6 imageHeight: 120
作用：设置头像图片的高度。
解释：定义头像的显示高度，单位是像素。这里设置为 120 像素。
1.7 imageTitle: my image
作用：设置头像图片的标题（alt 属性）。
解释：这是头像图像的替代文本，当图像无法加载时，浏览器会显示此文本。也有助于 SEO 和可访问性。
1.8 buttons:
该部分设置个人资料页面上要显示的按钮和链接。你可以自定义多个按钮，链接到站点的其他部分。

name: Posts

作用：按钮的名称。
解释：按钮上显示的文字，这里是 "Posts"。
url: posts

作用：按钮的链接地址。
解释：设置按钮的目标 URL，通常指向站点的某个页面。在这里，posts 表示按钮链接到站点的“文章”页面，可能是显示所有博客文章的页面。
你还可以为该 buttons 列表添加更多按钮，指向其他页面或资源。例如，Tags 按钮指向标签页。

2. homeInfoParams:
该部分配置用于设置主页的欢迎信息或自定义内容，通常显示在首页的某个位置。

2.1 Title: "Hi there \U0001F44B"
作用：设置主页的欢迎标题。
解释：这设置了首页显示的欢迎标题。在这里，"Hi there \U0001F44B" 包含一个 Unicode 表情符号（\U0001F44B 表示挥手的 emoji 👋）。这个标题可以显示在首页的显著位置，欢迎访问者。
2.2 Content: Welcome to my blog
作用：设置主页的内容/副标题。
解释：这是展示在首页的内容，通常用于进一步欢迎访客，或者提供一些关于站点的简短介绍。这里的内容是 "Welcome to my blog"，即向访问者介绍网站是一个博客。
```

### 第五部分

```yaml
1. socialIcons
这一部分配置用于设置站点的社交媒体图标和链接，通常在站点的头部、页脚或侧边栏显示社交媒体的图标，方便访问者访问社交平台。

1.1 - name: x
作用：指定社交平台的名称。
解释：在这个例子中，x 是社交平台的名称（通常是图标的标识符或名称）。你可以将其替换为真实平台的名称，如 "twitter"、"facebook" 等。
1.2 url: "https://x.com/"
作用：设置社交平台的链接。
解释：这是该平台的 URL 地址。当用户点击图标时，会跳转到指定的社交平台。
在这个配置中，包含了以下几个社交平台：

stackoverflow：url: "https://stackoverflow.com"，指向 Stack Overflow 网站。
github：url: "https://github.com/"，指向 GitHub 网站。
你可以根据需要添加更多的社交平台和链接，例如 Twitter、LinkedIn、Instagram 等。

2. analytics
这一部分配置用于设置站点的分析工具（如 Google、Bing 和 Yandex）验证标签，帮助验证你的网站所有权，并启用各大搜索引擎的分析服务。

2.1 google:
SiteVerificationTag: "XYZabc"
作用：为 Google Search Console 提供网站验证标签。
解释：你需要将此值替换为实际的 Google Search Console 网站验证标签，用于验证你拥有该网站的权限。
2.2 bing:
SiteVerificationTag: "XYZabc"
作用：为 Bing 提供网站验证标签。
解释：与 Google 类似，Bing 也要求你提供一个网站验证标签，以证明你是该网站的所有者。
2.3 yandex:
SiteVerificationTag: "XYZabc"
作用：为 Yandex 提供网站验证标签。
解释：Yandex 是俄罗斯的搜索引擎，你也可以通过提供此验证标签来验证你的网站所有权。
3. cover
这一部分配置用于控制封面图像的显示与隐藏。封面图通常是网站首页或文章页面的顶部图像。

3.1 hidden: true
作用：隐藏封面图像。
解释：当设置为 true 时，封面图会被完全隐藏，但在结构化数据中（如 JSON-LD 格式）仍然会存在。
3.2 hiddenInList: true
作用：隐藏封面图像在列表页和首页的显示。
解释：如果设置为 true，封面图像将不会显示在文章列表页和首页，通常用在某些情况下希望仅在单个页面上显示封面图。
3.3 hiddenInSingle: true
作用：隐藏封面图像在单个页面上的显示。
解释：如果设置为 true，封面图像将不会在单篇文章页面显示。
4. editPost
这一部分配置用于设置在文章页面上显示的“编辑”链接，通常用于 GitHub 存储库中的内容，允许用户建议更改文章。

4.1 URL: "https://github.com/<path_to_repo>/content"
作用：设置编辑链接的目标 URL。
解释：这是指向 GitHub 仓库中文件内容的 URL。用户点击“编辑”按钮时，将跳转到这个 URL，通常是用来在 GitHub 上编辑该页面的源文件。
4.2 Text: "Suggest Changes"
作用：设置显示在“编辑”按钮上的文本。
解释：这是编辑按钮上显示的文本，通常是 “Suggest Changes” 或类似的文字，指示用户可以对内容提出更改建议。
4.3 appendFilePath: true
作用：是否将文件路径附加到编辑链接。
解释：如果设置为 true，编辑链接将附加文件路径，便于直接跳转到文件的正确位置。
5. for search
这部分没有直接的配置，而是一个注释，指向了一个搜索库 Fuse.js 的 API 选项链接。Fuse.js 是一个轻量级的 JavaScript 库，通常用于实现客户端搜索功能。你可以根据链接中的文档调整搜索配置，以满足站点的搜索需求。
```

### 第六部分

```yaml
1. fuseOpts
这部分配置用于设置 Fuse.js 搜索库的选项，Fuse.js 是一个 JavaScript 库，通常用于客户端实现模糊搜索。你可以配置搜索行为来控制搜索的精度和灵敏度。

1.1 isCaseSensitive: false
作用：是否启用区分大小写的搜索。
解释：如果设置为 true，搜索将区分大小写；如果设置为 false，搜索将不区分大小写。默认情况下设置为 false，即不区分大小写。
1.2 shouldSort: true
作用：是否启用搜索结果排序。
解释：如果设置为 true，搜索结果将按照相关度排序，最相关的结果排在前面。设置为 false 时，结果顺序将不做调整。
1.3 location: 0
作用：控制搜索匹配位置的权重。
解释：这是设置搜索匹配位置的参数，默认为 0。location 是指搜索的开始位置，0 表示从文本的开始处开始匹配。较大的值会使搜索优先匹配文本的较后部分。
1.4 distance: 1000
作用：控制模糊搜索的“距离”。
解释：distance 代表允许多少字符的差异。值越小，搜索匹配越严格。较大的值允许更多的差异，适合处理拼写错误等问题。通常，1000 可以让搜索宽松一些。
1.5 threshold: 0.4
作用：设置搜索匹配的精度阈值。
解释：threshold 是一个 0 到 1 之间的值，决定了搜索的容忍度。值越小，结果越严格，只有高精度匹配才会返回。0.4 表示 40% 的匹配度就可以返回结果，适合更宽松的匹配。
1.6 minMatchCharLength: 0
作用：设置搜索最小匹配字符长度。
解释：这是设置搜索词的最小字符数，默认为 0，即任意字符都可以触发搜索。如果设置为更大的值，只有搜索词长度超过该值时才会开始搜索。
1.7 limit: 10
作用：限制搜索返回的结果数量。
解释：limit 决定了搜索结果的最大数量。在这个例子中，最多返回 10 个结果。你可以根据需要调整结果数。
1.8 keys: ["title", "permalink", "summary", "content"]
作用：指定搜索的字段。
解释：keys 列出了搜索时要考虑的字段，这里包括 title（标题）、permalink（永久链接）、summary（摘要）、content（内容）。你可以根据需要添加或删除字段，来优化搜索结果。
2. menu
这部分配置用于定义站点的导航菜单，菜单通常显示在页面的顶部或侧边栏，提供访问不同页面或内容的链接。

2.1 main
作用：设置主导航菜单项。

解释：main 下的每一项定义了一个菜单项，包括标识符、名称、URL 和权重。

identifier: categories

作用：定义菜单项的标识符。
解释：categories 是该菜单项的标识符，用于在模板中引用。
name: categories

作用：设置菜单项的显示名称。
解释：这是菜单项显示在页面上的名称，用户点击后将进入分类页面。
url: /categories/

作用：设置菜单项的链接地址。
解释：这是点击该菜单项时跳转的 URL，这里链接到站点的分类页面。
weight: 10

作用：设置菜单项的权重。
解释：weight 决定了菜单项在导航中的显示顺序，数字越小，菜单项越靠前。这里的 10 表示该菜单项的优先级为 10。
其他菜单项包括 tags（标签页）和 example（示例链接，指向外部 URL）。你可以根据需要自定义更多的菜单项。

3. pygmentsUseClasses
这部分配置涉及到 Hugo 语法高亮的相关设置。

3.1 pygmentsUseClasses: true
作用：是否启用 Pygments 使用 CSS 类来应用代码高亮。
解释：true 表示启用 CSS 类来应用代码高亮，false 则使用内联样式。这有助于控制代码高亮的样式和外观。
4. markup: highlight
这部分配置用于控制代码高亮的设置。

4.1 noClasses: false
作用：是否禁用 CSS 类用于代码高亮。
解释：false 表示启用 CSS 类来应用代码高亮。true 则禁用，使用内联样式进行高亮。
4.2 anchorLineNos: true（注释掉）
作用：是否在代码块的行号旁边显示锚点链接。
解释：如果设置为 true，每行的行号旁将显示一个锚点链接，用户可以通过点击行号跳转到该行的具体位置。这里被注释掉，意味着没有启用这个功能。
4.3 codeFences: true（注释掉）
作用：是否启用代码围栏（fenced code blocks）语法。
解释：true 表示启用 Markdown 的代码围栏语法（即 \`\`\`）。这里被注释掉，表示默认启用该功能。
4.4 guessSyntax: true（注释掉）
作用：是否自动推断代码块的语法。
解释：true 表示 Hugo 会尝试根据代码块内容自动推测代码的语言类型。这里被注释掉，表示该功能默认启用。
4.5 lineNos: true（注释掉）
作用：是否显示代码块的行号。
解释：true 表示显示代码行号。这里被注释掉，表示默认启用该功能。
4.6 style: monokai（注释掉）
作用：设置代码高亮的样式。
解释：monokai 是一种流行的高亮样式。这里被注释掉，意味着没有指定样式，默认使用主题提供的样式。
```

### 文章模板

```yaml
---
title: "My 1st post"
date: 2020-09-15T11:30:03+00:00
# weight: 1
# aliases: ["/first"]
tags: ["first"]
author: "Me"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "Desc Text."
canonicalURL: "https://canonical.url/to/page"
disableHLJS: true # to disable highlightjs
disableShare: false
disableHLJS: false
hideSummary: false
searchHidden: true
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
cover:
    image: "<image path/url>" # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: false # when using page bundles set this to true
    hidden: true # only hide on current single page
editPost:
    URL: "https://github.com/<path_to_repo>/content"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---
```

### 对应解释

```yaml
1. Basic Metadata (基本元数据)
title:

作用：文章的标题，通常显示在页面的顶部或浏览器标签上。
示例："My 1st post"。
date:

作用：文章的发布时间或创建时间。格式为 YYYY-MM-DDTHH:MM:SS+00:00，支持时间戳。
示例：2020-09-15T11:30:03+00:00。
tags:

作用：为文章添加标签，帮助分类和搜索。可以是一个列表，包含一个或多个标签。
示例：["first"]。
author:

作用：指定文章的作者。可以是单个作者或多个作者的列表。
示例："Me"。
2. Display and Layout Options (显示和布局选项)
showToc:

作用：是否显示文章的目录（Table of Contents）。
示例：true，表示显示目录。
TocOpen:

作用：控制文章目录的初始状态，false 表示目录默认是折叠的。
示例：false。
draft:

作用：是否将文章标记为草稿。如果为 true，则文章不会在生成的站点中显示。
示例：false，表示文章已发布。
hidemeta:

作用：是否隐藏文章的元数据，如作者、日期等。
示例：false，表示不隐藏元数据。
comments:

作用：是否启用评论功能。
示例：false，表示禁用评论。
description:

作用：文章的描述文本，通常用于搜索引擎或摘要。
示例："Desc Text."。
canonicalURL:

作用：文章的标准化 URL，用于 SEO，防止内容重复。
示例："https://canonical.url/to/page"。
3. Miscellaneous Settings (其他设置)
disableHLJS:

作用：是否禁用代码高亮（highlight.js）。
示例：true，表示禁用代码高亮。
disableShare:

作用：是否禁用社交分享按钮。
示例：false，表示启用分享按钮。
hideSummary:

作用：是否隐藏文章的摘要。
示例：false，表示显示摘要。
searchHidden:

作用：是否隐藏文章的搜索索引。设置为 true 后，文章将不会出现在搜索结果中。
示例：true，表示文章不会被搜索到。
ShowReadingTime:

作用：是否显示文章的阅读时间。
示例：true，表示显示阅读时间。
ShowBreadCrumbs:

作用：是否显示面包屑导航。
示例：true，表示显示面包屑导航。
ShowPostNavLinks:

作用：是否在文章底部显示上一篇/下一篇链接。
示例：true，表示显示上一篇和下一篇文章链接。
ShowWordCount:

作用：是否显示文章的字数。
示例：true，表示显示字数。
ShowRssButtonInSectionTermList:

作用：是否在分类或标签的页面中显示 RSS 按钮。
示例：true，表示显示 RSS 按钮。
UseHugoToc:

作用：是否使用 Hugo 内建的目录生成系统（如果启用）。
示例：true，表示启用 Hugo 目录功能。
4. Cover Image (封面图像)
cover:
作用：配置文章的封面图像及其相关设置。

image:

作用：指定封面图像的路径或 URL。
示例："<image path/url>"。
alt:

作用：为封面图像提供替代文本（Alt text），通常用于图片无法显示时。
示例："<alt text>"。
caption:

作用：为封面图像提供标题或说明文字。
示例："<text>"。
relative:

作用：如果为 true，表示图像路径是相对路径；否则是绝对路径。
示例：false，表示使用绝对路径。
hidden:

作用：控制封面图像是否显示。true 表示隐藏封面图像。
示例：true，表示封面图像在当前页面隐藏。
5. Edit Post Link (编辑文章链接)
editPost:
作用：提供一个“编辑”链接，通常指向 GitHub 仓库中该文章的源文件，允许用户建议更改。

URL:

作用：指定 GitHub 仓库中该文章文件的 URL。
示例："https://github.com/<path_to_repo>/content"。
Text:

作用：设置在“编辑”按钮上显示的文本。
示例："Suggest Changes"。
appendFilePath:

作用：是否在编辑链接中附加文件路径。
示例：true，表示将文件路径附加到 URL 后
```
  

\_\_EOF\_\_

posted @ [iXiAo9](https://www.cnblogs.com/iXiAo9)   阅读(437)  评论(0) [收藏](https://www.cnblogs.com/iXiAo9/p/) [举报](https://www.cnblogs.com/iXiAo9/p/)

## PaperMod主题配置文件解释

### 公告

[![](https://img2024.cnblogs.com/blog/35695/202509/35695-20250923174722171-270282128.jpg)](https://qoder.com/)

[Agentic 编程平台 Qoder](https://qoder.com/)