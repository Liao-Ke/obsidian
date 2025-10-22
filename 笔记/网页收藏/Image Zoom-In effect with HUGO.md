---
来自: "https://adityatelange.in/blog/hugo-image-zoom-in/"
收藏时间: 2025年10月18日 六 19:24:02
tags:
  - "网页收藏"
---
> [!note] 摘要
> 本文介绍了如何使用Hugo的Markdown渲染钩子、HTML和CSS实现非JavaScript的图像放大效果，通过复选框和标签的组合以及CSS的transform属性，实现了图像的放大功能。此功能适用于宽度大于等于769px的显示器。


在这篇博文中，我们将研究如何添加放大效果以获得更好的可见性。

我们将使用 Hugo 的 Markdown Render Hooks 与 HTML 和 CSS，实现 **非 javascript** 解决方案。

- [查看结果 👇](https://adityatelange.in/blog/hugo-image-zoom-in/#sample-image-with-zoom-in-effect)

**关于 Markdown 渲染钩子**

Hugo 提供了非常方便的 [Markdown 渲染钩子](https://gohugo.io/getting-started/configuration-markup#markdown-render-hooks "Link to hugo docs") 。这些允许自定义模板覆盖 Markdown 渲染功能。

我们将根据需要使用 [render-image](https://gohugo.io/templates/render-hooks/#render-hooks-for-headings-links-and-images "Link to hugo docs") 钩子来处理帖子中的图像。 钩子停留在如下所示的位置。 `render-image`

```fallback
* (site root)

├── layouts

│   └── _default

│       └── _markup

│           └── render-image.html

└── themes
```

## 代码片段 </>

为了添加放大效果，我们将使用 **`输入`** 和 **`标签`** 字段的组合，我们将在其中放置图像。

**基本思想** ：

- 我们有类型字段复选框。 `input`
- 我们将复选框和标签与为每个图像生成的唯一 **ID** 相关联。简而言之，我们有一个带有可点击标签的复选框
- 在里面，我们放置了我们的图像。 `label`
- 每当用户 **单击** 图像时，它都会激活复选框，并将其值设置为 *选中* 。
- 为了让它看起来更好，我们使用 attribute 隐藏了复选框。 `hidden`
- 在 CSS 规则中，当 *选中* 复选框时，我们会向图像添加 [`一个 transform`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform "Link to MDN docs") 属性。

==注意== ：我们仅在具有宽度的显示器上启用此功能。较小的显示器针对手机等触摸场景设备，在这些设备中，由于宽度相当小，图像放大无效。 ` >=769px`

> 内容 `render-image.html`
> 
> > 把这些放在 `(.)/layouts/_default/_markup/render-image.html`

```html
<!-- Checks if page is part of section and page is not section itself -->

{{- if and (ne .Page.Kind "section") (.Page.Section ) }}

    <!-- Generate a unique id for each image -->

    {{- $random := (substr (md5 .Destination) 0 5) }}

    <input type="checkbox" id="zoomCheck-{{$random}}" hidden>

    <label for="zoomCheck-{{$random}}">

        <img class="zoomCheck" loading="lazy" decoding="async" 

            src="{{ .Destination | safeURL }}" alt="{{ .Text }}" 

            {{ with.Title}} title="{{ . }}" {{ end }} />

    </label>

{{- else }}

    <img loading="lazy" decoding="async" src="{{ .Destination | safeURL }}" 

        alt="{{ .Text }}" {{ with .Title}} title="{{ . }}" {{ end }} />

{{- end }}
```

> 中的相应样式 `css`
> 
> > 把这些放在 `(.)/layouts/<theme specific extend_head.html>`

```css
<style>

@media screen and (min-width: 769px) {

    /* .post-content is a class which will be present only on single pages 

        and not lists and section pages in Hugo */

    .post-content input[type="checkbox"]:checked ~ label > img {

        transform: scale(1.6);

        cursor: zoom-out;

        position: relative;

        z-index: 999;

    }

    .post-content img.zoomCheck {

        transition: transform 0.15s ease;

        z-index: 999;

        cursor: zoom-in;

    }

}

</style>
```

---

## 具有放大效果的示例图像

单击下图可 **放大** 和 **缩小** 。  
（适用于宽度为 >=769px 的显示器）