---
来自: "https://page.tuclink.com/zh/post/hugo/hugo-math/"
收藏时间: 2025年10月06日 一 22:02:57
tags:
  - "网页收藏"
---
> [!note] 摘要
> Hugo 添加数学公式支持，使用 mathjax 添加 latex 公式支持。仟尘撰写，突触递质网站发布。


参考了这篇 [文章](https://gohugo.io/content-management/mathematics/#step-1) 和这篇 [文章](https://www.gohugo.org/doc/tutorials/mathjax/)

hugo 版本要大于 v0.122.0

将以下脚本放在 layouts/partials/ 文件夹中的一个模板中，例如 extend\_footer.html

```js
<script type="text/javascript"

  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">

</script>
```

在配置文件 config.yaml 中添加以下配置

```yaml
markup:

  goldmark:

    extensions:

      passthrough:

        delimiters:

          block:

          - - \[

            - \]

          - - $$

            - $$

          inline:

          - - \(

            - \)

          - - $

            - $

        enable: true
```

现在就能成功渲染数学公式了

K L (^ y | | y) \= M ∑ c \= 1 ^ y c log ^ y c y c J S (^ y | | y) \= 1 2 (K L (y | | y + ^ y 2) + K L (^ y | | y + ^ y 2)) 
$$
KL(y^||y)=∑c=1My^clog⁡y^cyc JS(y^||y)=12(KL(y||y+y^2)+KL(y^||y+y^2))
$$

使用时如果需要使用内联方程，即直接将公式嵌入文本如： E \= m c 2 $E=mc2$

不能使用

```fallback
$E=mc^2$
```

需要使用

```fallback
\\(E=mc^2\\)
```