---
来自: "https://tofuwine.github.io/posts/610b75f5/"
收藏时间: 2025年10月03日 五 12:35:25
tags:
  - "网页收藏"
---
> [!note] 摘要
> PaperMod 集成 Giscus 评论 | Tofuwine's Blog
> 
> 本文介绍了如何将 Giscus 评论系统集成到 Hugo 和 PaperMod 主题的网站中，包括配置步骤、主题切换和添加评论标题等。文章还提供了官方文档和教程参考链接，以帮助读者更好地理解和应用 Giscus 评论系统。


本文最后更新于 1 年前 ，文中信息可能已经过时。如有问题请在评论区留言。

## Gisucs

> 官网： [giscus.app](https://giscus.app/zh-CN)

利用 [GitHub Discussions](https://docs.github.com/en/discussions) 实现的评论系统，让访客借助 GitHub 在你的网站上留下评论和反应吧！本项目深受 utterances 的启发。

- [开源](https://github.com/giscus/giscus) 。🌏
- 无跟踪，无广告，永久免费。📡 🚫
- 无需数据库。所有数据均储存在 GitHub Discussions 中。:octocat:
- 支持 [自定义主题](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-theme) ！🌗
- 支持 [多种语言](https://github.com/giscus/giscus/blob/main/CONTRIBUTING.md#adding-localizations) 。🌐
- [高可配置性](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md) 。🔧
- 自动从 GitHub 拉取新评论与编辑。🔃
- [可自建服务](https://github.com/giscus/giscus/blob/main/SELF-HOSTING.md) ！🤳

## 教程参考

本站集成方式参考以下博文，为尊重原创作者，本文不再赘述，请移步到其站点查看：

教程参考

[Hugo 博客引入 Giscus 评论系统 —— 意琦行](https://www.lixueduan.com/posts/blog/02-add-giscus-comment/)

你也可以参考 [官方文档](https://giscus.app/zh-CN) 。

## 主题切换

按上述教程集成了 Giscus 评论系统，但评论区主题不能动态变更。

源码参考

[issues#1200 —— giscus](https://github.com/giscus/giscus/issues/1200)

如需评论区随界面主题变更，请按如下方式修改配置：

### Hugo 配置

将 giscus 属性字段提取到 Hugo 配置中：

```yaml

params:

  giscus:

    repo: "{{ YOUR REPOSITORY }}"

    repoId: "{{ YOUR REPO ID }}"

    category: "Announcements"

    categoryId: "{{ YOUR CATEGORY ID }}"

    mapping: "pathname"

    strict: "0"

    reactionsEnabled: "1"

    emitMetadata: "0"

    inputPosition: "top"

    lightTheme: "light"

    darkTheme: "dark"

    lang: "zh-CN"
```

### 评论界面

变更 `comments.html` 内容如下:

```html

<script>

    const getStoredTheme = () => localStorage.getItem("pref-theme") === "dark" ? "{{ .Site.Params.giscus.darkTheme }}" : "{{ .Site.Params.giscus.lightTheme }}";

    const setGiscusTheme = () => {

        const sendMessage = (message) => {

            const iframe = document.querySelector('iframe.giscus-frame');

            if (iframe) {

                iframe.contentWindow.postMessage({giscus: message}, 'https://giscus.app');

            }

        }

        sendMessage({setConfig: {theme: getStoredTheme()}})

    }

    document.addEventListener("DOMContentLoaded", () => {

        const giscusAttributes = {

            "src": "https://giscus.app/client.js",

            "data-repo": "{{ .Site.Params.giscus.repo }}",

            "data-repo-id": "{{ .Site.Params.giscus.repoId }}",

            "data-category": "{{ .Site.Params.giscus.category }}",

            "data-category-id": "{{ .Site.Params.giscus.categoryId }}",

            "data-mapping": "{{ .Site.Params.giscus.mapping | default "pathname" }}",

            "data-strict": "{{ .Site.Params.giscus.strict | default "0" }}",

            "data-reactions-enabled": "{{ .Site.Params.giscus.reactionsEnabled | default "1" }}",

            "data-emit-metadata": "{{ .Site.Params.giscus.emitMetadata | default "0" }}",

            "data-input-position": "{{ .Site.Params.giscus.inputPosition | default "bottom" }}",

            "data-theme": getStoredTheme(),

            "data-lang": "{{ .Site.Params.giscus.lang | default "en" }}",

            "data-loading": "lazy",

            "crossorigin": "anonymous",

            "async": "",

        };

        // 动态创建 giscus script

        const giscusScript = document.createElement("script");

        Object.entries(giscusAttributes).forEach(

                ([key, value]) => giscusScript.setAttribute(key, value));

        document.querySelector("#tw-comment").appendChild(giscusScript);

        // 页面主题变更后，变更 giscus 主题

        const themeSwitcher = document.querySelector("#theme-toggle");

        if (themeSwitcher) {

            themeSwitcher.addEventListener("click", setGiscusTheme);

        }

        const themeFloatSwitcher = document.querySelector("#theme-toggle-float");

        if (themeFloatSwitcher) {

            themeFloatSwitcher.addEventListener("click", setGiscusTheme);

        }

    });

</script>
```

## 评论标题 & 子标题

增加评论区标题 & 子标题，引导用户进行评论。

修改评论界面，在最上面添加如下内容：
```html
<!-- layouts/partials/comments.html -->
<div class="comments-title" id="tw-comment-title">
    <p class="x-comments-title">{{- .Param "discussionTitle" }}</p>
    <p style="font-size: 1rem">{{- .Param "discussionSubtitle" }} </p>
</div>
```

添加样式：
```css
/* assets/css/extended/comment.css */
/* giscus 评论组件 */
.comments-title {
    margin-top: 2rem;
    margin-bottom: 2rem;
    display: block;
    text-align: center;
}

.x-comments-title {
    display: block;
    font-size: 1.25em;
    font-weight: 700;
    padding: 1.5rem 0 .5rem;
}
```
### 使用方式

1. 你可以在 Hugo 配置中配置全局值：

```
params:

  # 评论区

  discussionTitle: 欢迎来到评论区

  discussionSubtitle: 感谢您的耐心阅读！来选个表情，或者留个评论吧！
```

1. 也可在文章 `frontmatter` 中添加：(以本站 [友链](https://tofuwine.github.io/friend) 为例)

```
discussionTitle: 👇 申请友链 👇

discussionSubtitle: 在下方评论区留下你的链接吧!
```