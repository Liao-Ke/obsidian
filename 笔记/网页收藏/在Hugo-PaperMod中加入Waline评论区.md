---
来自: "https://blog.drifting.boats/posts/waline-papermod/"
收藏时间: 2025年10月15日 三 12:22:33
tags:
  - "网页收藏"
---
> [!note] 摘要
> 本文介绍了如何在Hugo-PaperMod中引入Waline评论系统，包括服务端部署、客户端HTML引入、Hugo配置修改以及更多属性设置。文章还提供了LeanCloud设置、Vercel部署和绑定域名的指南。


**❗️ 20250325更新** ：  
本文已过时，请使用主题 [Drifting-PaperMod](https://github.com/DriftingBoats/Drifting-PaperMod) ，参考文档 [Drifting-PaperMod主题文档](https://blog.drifting.boats/posts/drifting-papermod-guide)

## Waline服务端部署

### LeanCloud 设置

参考Waline官方文档： [LeanCloud 设置 (数据库)](https://waline.js.org/guide/get-started/#leancloud-%E8%AE%BE%E7%BD%AE-%E6%95%B0%E6%8D%AE%E5%BA%93)

### Vercel部署

参考Waline官方文档： [Vercel 部署 (服务端)](https://waline.js.org/guide/get-started/#vercel-%E9%83%A8%E7%BD%B2-%E6%9C%8D%E5%8A%A1%E7%AB%AF)

### 绑定域名（可选）

参考Waline官方文档： [绑定域名 (可选)](https://waline.js.org/guide/get-started/#%E7%BB%91%E5%AE%9A%E5%9F%9F%E5%90%8D-%E5%8F%AF%E9%80%89)

## 在Hugo-PaperMod中引入Waline

### HTML 引入 (客户端)

在 `layouts/partials` 文件夹下新增 `comments.html`:

**layouts/partials/comments.html**

Text

```gdscript3
1<!-- layouts/partials/comments.html -->

 2{{- if .Site.Params.comments }}

 3    <!-- 评论容器 -->

 4    <div class="waline-container" data-path="{{ .Permalink | relURL }}"></div>

 5    <link href="https://unpkg.com/@waline/client@v3/dist/waline.css" rel="stylesheet" />

 6

 7    <!-- 初始化 Waline 的脚本 -->

 8    <script>

 9        document.addEventListener("DOMContentLoaded", () => {

10

11            // 初始化 Waline

12            const walineInit = () => {

13                import('https://unpkg.com/@waline/client@v3/dist/waline.js').then(({ init }) => {

14                    const walineContainers = document.querySelectorAll('.waline-container[data-path]');

15                    walineContainers.forEach(container => {

16                        if (!container.__waline__) {

17                            const path = container.getAttribute('data-path');

18                            container.__waline__ = init({

19                                el: container,

20                                serverURL: '{{ .Site.Params.waline.serverURL }}',

21                                lang: '{{ .Site.Params.waline.lang }}',

22                                visitor: '{{ .Site.Params.waline.visitor | default "匿名者" }}',

23                                emoji: [

24                                    {{- range .Site.Params.waline.emoji }}

25                                        '{{ . }}',

26                                    {{- end }}

27                                ],

28                                requiredMeta: [

29                                    {{- range .Site.Params.waline.requiredMeta }}

30                                        '{{ . }}',

31                                    {{- end }}

32                                ],

33                                locale: {

34                                    admin: '{{ .Site.Params.waline.locale.admin }}',

35                                    placeholder: '{{ .Site.Params.waline.locale.placeholder }}',

36                                },

37                                path: path,

38                                dark: '{{ .Site.Params.waline.dark | default "body.dark" }}', 

39                            });

40                        }

41                    });

42                }).catch(error => {

43                    console.error("Waline 初始化失败：", error);

44                });

45            };

46

47            walineInit();

48        });

49    </script>

50{{- end }}
```

### 修改hugo.yaml配置

toml文件自行改写。

在params下：

1. comments值改为true；
2. 增加waline配置。

**hugo.yaml**

### 更多Waline属性

需要同时修改comments.html和hugo.yaml，参考 [Waline文档 · 组件属性](https://waline.js.org/reference/client/props.html)