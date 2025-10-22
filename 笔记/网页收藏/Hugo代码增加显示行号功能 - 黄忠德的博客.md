---
来自: "https://huangzhongde.cn/post/2020-02-22-hugo-code-linenumber/"
收藏时间: 2025年10月10日 五 15:15:09
tags:
  - "网页收藏"
---
> [!note] 摘要
> Hugo代码增加显示行号功能：介绍了如何在Hugo中添加代码显示行号的功能，包括修改配置文件和自定义CSS文件的方法。


## Hugo代码增加显示行号功能

今天看 [Hugo文档](https://gohugo.io/content-management/syntax-highlighting/) 的时候，发现hugo已经有显示行号的功能了

hugo的版本需要v0.60.0以上

实现的方式很简单，只要修改配置文件即可

## 修改配置文件

修改主配置文件 `config.toml`,在配置文件中增加

```fallback
1pygmentsUseClasses = true
 2[markup]
 3  [markup.highlight]
 4    codeFences = true
 5    guessSyntax = true
 6    hl_Lines = ""
 7    lineNoStart = 1
 8    lineNos = true
 9    lineNumbersInTable = false
10    noClasses = true
11    style = "github"
12    tabWidth = 4
```

## 修改自定义css文件

使用过程中发现个问题，行号是正常显示出来了，但是使用复制功能的时候，会连行号一起复制，这时修改自定义的css配置

```css
1.highlight .ln {
2    width: 20px;
3    display: block;
4    float: left;
5    text-align: right;
6    user-select: none;
7    padding-right: 8px;
8    color: #ccc;
9}
```

`user-select: none;`表示复制是不能被选中，其他的是格式上的调整