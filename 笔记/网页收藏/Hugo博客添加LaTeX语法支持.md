---
来自: "https://www.shaohantian.com/blog/posts/env/hugo_mathjax/"
收藏时间: 2025年10月14日 二 10:35:04
tags:
  - "网页收藏"
---
> [!note] 摘要
> 本页面介绍了如何将 MathJax 集成到 Markdown 编辑中，包括添加 MathJax、编辑 extend_head 以及 LaTeX 效果展示。还讨论了 Markdown 和 MathJax 不兼容的问题和一些解决方案。


## MathJax 与 Markdown 的融合

- 这里给大家推荐一个在线编辑 LaTeX 公式的网站 LaTeX 公式编辑器\[^1\]

### 添加 mathjax

定位到 `themes\PaperMod\layouts\partials` ，创建 `mathjax.html` 并编辑：

```html
<script type="text/javascript"
        async
        src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
MathJax.Hub.Config({
  tex2jax: {
    inlineMath: [['$','$'], ['\\(','\\)']],
    displayMath: [['$$','$$'], ['\[\[','\]\]']],
    processEscapes: true,
    processEnvironments: true,
    skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
    TeX: { equationNumbers: { autoNumber: "AMS" },
         extensions: ["AMSmath.js", "AMSsymbols.js"] }
  }
});

MathJax.Hub.Queue(function() {
    // Fix <code> tags after MathJax finishes running. This is a
    // hack to overcome a shortcoming of Markdown. Discussion at
    // https://github.com/mojombo/jekyll/issues/199
    var all = MathJax.Hub.getAllJax(), i;
    for(i = 0; i < all.length; i += 1) {
        all[i].SourceElement().parentNode.className += ' has-jax';
    }
});
</script>

<style>
code.has-jax {
    font: inherit;
    font-size: 100%;
    background: inherit;
    border: inherit;
    color: #515151;
}
</style>
```

### 编辑 extend\_head

定位到 `themes\PaperMod\layouts\partials\extend_head.html` ，添加以下代码：

```html
{{ partial "mathjax.html" . }}
```

### LaTeX 效果展示

- 先试试行内 $x^2 +1 = 0$ 公式
- 再试试行间公式

$(a+b)3=(a+b)(a+b)2=(a+b)(a2+2ab+b2)=a3+3a2b+3ab2+b3$

## 多聊一点

在实际的使用过程中，也遇到一些 Markdown 和 MathJax **不兼容的问题** ：

MathJax 渲染公式中包含三个以上的大括号{}时候出问题，我们先任意书写一个数学公式：

![MommyTalk1667783691090](https://cdn.jsdelivr.net/gh/ShaohanTian/MyBlog/img/202211070914685.svg)

对应的 LaTeX 代码为：

```tex
\boldsymbol{x}_{i+1}+\boldsymbol{x}_{i+2}=\boldsymbol{x}_{i+3}
```
1. 公式中出现 **一对** 大括号 ，没有问题

$x$

1. 出现 **两对** 大括号 ，没有问题

$xi+1$

1. 出现 **三对** 大括号 ，没有问题

$xi+1+x$

1. 出现 **三对以上** 大括号 ， **无法显示**

$$ \\boldsymbol{x} *{i+1}+\\boldsymbol{x}* {i+2} $$

==我在 chrome 浏览器查看 HTML 源码时，发现它的划线“\_”丢失，多了“em”标签，应该是直接进行了转译，有已解决问题的小伙伴可以欢迎在评论区分享你解决方法==

1. 针对公式颜色的调整 `\textcolor{#FF0000}{公式}` 或 `\textcolor{blue}{公式}` ，常用红色、蓝色、绿色，将公式写在后方的大括号内即可，例如：
```fallback
$$P\left(x_{l} \mid y_{l}\right) = \frac{P(y_l\mid x_l)P(x_l)}{P(y_l)}$$
```

## 📖 参考文献

1. [在线 LaTeX 公式编辑器-编辑器](https://www.latexlive.com/)
2. [MathJax 与 Markdown 的究极融合 - Yihui Xie | 谢益辉](https://yihui.org/cn/2017/04/mathjax-markdown/)
3. [Render LaTeX math expressions in Hugo with MathJax 3 · Geoff Ruddock](https://geoffruddock.com/math-typesetting-in-hugo/)
4. [开启 mathjax，当出现两个以上时\_{}时解析有问题](https://github.com/olOwOlo/hugo-theme-even/issues/40)
5. [有无和 typora 一模一样 markdown 渲染规则的博客系统？](https://www.v2ex.com/t/725896)
6. [Hugo - MathJax Support](https://bwaycer.github.io/hugo_tutorial.hugo/tutorials/mathjax/)
7. [Render LaTeX math expressions in Hugo with MathJax 3 · Geoff Ruddock](https://geoffruddock.com/math-typesetting-in-hugo/)
8. [markdown 修改 latex 数学公式的颜色\_csdn 公式标红-CSDN 博客](https://blog.csdn.net/iteapoy/article/details/112846367)