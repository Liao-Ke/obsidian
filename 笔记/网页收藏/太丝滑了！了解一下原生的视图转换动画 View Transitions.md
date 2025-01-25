---
来自: "https://juejin.cn/post/7269388083342082107"
收藏时间: 2025年01月13日 星期一 19:15:45
tags:
  - "网页收藏"
---
> [!note] 摘要
> 本文介绍了原生的视图转换动画 View Transitions。包括通过简单例子认识其用法，如添加特定代码实现元素删除的动画效果，并可设置动画时长等。还讲解了其核心概念，如变化原理、相关伪元素等。探讨了不同元素间过渡、自定义过渡动画的实现，列举了多个案例，最后总结了其特点和使用注意事项。


> 欢迎关注我的公众号：**前端侦探**

在原生 APP 中，我们经常会看到那种丝滑又舒适的页面切换动画，比如这样的

![Mobile-UI-transitions.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3efd817f12c74c47a57a3e436495e06f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

Android 里一般称之为共享元素（shareElement）动画，也就是动画前后有一个（或多个）相同的元素，起到前后过渡的效果，可以很清楚的看到元素的变化过程，而并不是简单的消失和出现。

现在，web 中（chrome 111+）也迎来了这样一个特性，叫做视图转换动画 [View Transitions](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FView_Transitions_API "https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API")，又称“转场动画”，也能很轻松的实现这类效果，一起了解一下吧

## 一、快速认识 View Transitions

先从一个简单的例子来认识一下。

比如，下面有一个网格列表

```html
<div class="list" id="list">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
  <div class="item">7</div>
  <div class="item">8</div>
  <div class="item">9</div>
  <div class="item">10</div>
</div>
```

简单修饰后如下

![image-20230816150811729](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4bf22fd2b7b46cb9a2b7ca6b33ae9ca~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

然后我们实现一个简单交互，点击每个元素，元素就会被删除

```js
list.addEventListener('click', function(ev){
  if (ev.target.className === 'item') {
    ev.target.remove()
  }
})
```

可以得到这样的效果

![Kapture 2023-08-16 at 15.12.03.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e9729dd91b34238af02a72eab733137~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

功能正常，就是有点太过生硬了

现在轮到 `View Transitions` 出场了！我们只需要在改变状态的地方添加`document.startViewTransition`，如下

```js
list.addEventListener('click', function(ev){
  if (ev.target.className === 'item') {
    document.startViewTransition(() => { // 开始视图变换
      ev.target.remove()
    });
  }
})
```

当然为了兼容不支持的浏览器，可以做一下判断

```js
list.addEventListener('click', function(ev){
  if (document.startViewTransition) { // 如果支持就视图变换
    document.startViewTransition(() => { // 开始视图变换
      ev.target.remove()
    });
  } else { // 不支持就执行原来的逻辑
    ev.target.remove()
  }
})
```

现在效果如下

![Kapture 2023-08-16 at 15.22.24.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c941af750a064559958e5a2e9d3e9ebb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

删除前后现在有一个淡入淡出的效果了，也就是默认的动画效果，我们可以把这个动画时长设置大一点，如下

```css
::view-transition-old(root), /* 旧视图*/
::view-transition-new(root) { /* 新视图*/
  animation-duration: 2s;
}
```

这两个伪元素我们后面再做介绍，先看效果

![Kapture 2023-08-16 at 15.27.03.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14aef2d6bfdb4c389995268509f3ad6f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

是不是明显感觉过渡变慢了许多？

但是这种动画还是不够舒服，是一种整体的变化，看不出删除前后元素的位置变化。

接下来我们给每个元素指定一个标识，用来标记变化前后的状态，为了方便控制，可以借助 CSS 变量

```html
<div class="list" id="list">
  <div class="item" style="--i: a1">1</div>
  <div class="item" style="--i: a2">2</div>
  <div class="item" style="--i: a3">3</div>
  <div class="item" style="--i: a4">4</div>
  <div class="item" style="--i: a5">5</div>
  <div class="item" style="--i: a6">6</div>
  <div class="item" style="--i: a7">7</div>
  <div class="item" style="--i: a8">8</div>
  <div class="item" style="--i: a9">9</div>
  <div class="item" style="--i: a10">10</div>
</div>
```

这里通过`view-transition-name`来设置名称

```css
.item{
  view-transition-name: var(--i);
}
```

然后可以得到这样的效果，每个元素在变化前后会自动找到之前的位置，并且平滑的移动过去，如下

![Kapture 2023-08-16 at 15.42.40.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbd0179d1ec647b69075171a361b4b26~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

完整代码可以查看

![](https://juejin.cn/post/)

- [view-transition sort (codepen.io)](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fxboxyan%2Fpen%2FBavBevP "https://codepen.io/xboxyan/pen/BavBevP")

是不是非常丝滑？这就是 `View Transitions` 的魅力！

## 二、View Transitions 的核心概念

为啥仅仅加了一点点代码就是实现了如此顺畅的动画呢？为啥浏览器可以知道前后的元素位置关系呢？这里简单介绍一下变化原理。

整个 `JS` 部分只有一行核心代码，也就是`document.startViewTransition`，表示开始视图变换

```js
document.startViewTransition(() => {
  // 变化操作
});
```

整个过程包括 3 部分

1. 调用`document.startViewTransition`，浏览器会捕捉当前页面的状态，类似于实时截图，或者“快照”
2. 执行实际的 dom 变化，再次记录变化后的页面状态（截图）
3. 触发两者的过渡动画，包括透明度、位移等变化，也可以自定义 CSS 动画

下面是一个示意图

![image-20230816192140930](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb5a123bbb30491a95a31987cf50d809~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在动画执行的过程中，还会在页面根节点自动创建以下伪元素

```css
::view-transition
└─ ::view-transition-group(root)
   └─ ::view-transition-image-pair(root)
      ├─ ::view-transition-old(root)
      └─ ::view-transition-new(root)
```

下面是控制台的截图

![image-20230816192930845](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f957176d9c04116a959b8e151dfbe6c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

其中，`::view-transition-old`表示**旧视图**的状态，也就是变化之前的截图，`::view-transition-new`表示**新视图**的状态，也就是变化之后的截图。

默认情况下，整个页面`root`都会作为一个状态，也就是上面的`::view-transition-group(root)`，在切换前后会执行淡入淡出动画，如下

```css
:root::view-transition-new(root) {
  animation-name: -ua-view-transition-fade-in; /*淡入动画*/
}
:root::view-transition-old(root) {
  animation-name: -ua-view-transition-fade-out; /*淡出动画*/
}
```

这也是为什么在使用了`document.startViewTransition`后整个页面会有淡入淡出的效果了

![Kapture 2023-08-16 at 15.27.03.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7cc706b4ead4d7ca76ba75cee021e09~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

为了让每个元素都有自己的过渡状态，这里需要给每个元素都指定名称

```css
.item{
  view-transition-name: item-1;
}
```

这样指定名称后，每个名称都会创建一个`::view-transition-group`，表示独立的分组

![image-20230816172841789](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47e0c7ef40b941569432b789aabc7893~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这样在变化前后`view-transition-name`相同的部分就会一一自动执行过渡动画了，以第4、5个元素为例（在3删除以后）

![image-20230818192301941](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/866dc9501da549d5a1ee395d1711e3b8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

最后就会得到这样的效果

![Kapture 2023-08-16 at 15.42.40.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3b839a998ec4e1c9132a16bf45c9620~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

核心概念就这些了，下面再来看几个例子

## 三、不同元素之间的过渡

视图变化其实和元素是否相同没有关联，有关联的只有`view-transition-name`，浏览器是根据`view-transition-name`寻找的，也就是相同名称的元素在前后会有一个过渡动画。

比如下面这样一个例子

![Kapture 2023-08-16 at 19.54.03.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6130ac3aea044dd9b47340ca48e900e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

每个按钮在打开弹窗时，都可以清楚的看到弹窗是从哪里出现的，如何实现这样的效果呢？

从本质上看，其实就是**按钮到弹窗的视图变换**，按照前面讲到的，可能会想到给前后加上相同的`view-transition-name`，下面是`HTML`结构

```html
<div class="bnt-group" id="group">
  <button>按钮1</button>
  <button>按钮2</button>
  <button>按钮3</button>
</div>
<dialog id="dialog">
  <form method="dialog">
    我是弹窗
    <button>关闭</button>
  </form>
</dialog>
```

尝试一下

```css
button,dialog{
  view-transition-name: dialog;
}
```

然后添加点击打开弹窗事件

```js
group.addEventListener('click', function(ev){
  if (ev.target.tagName === 'BUTTON') {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        dialog.showModal()
      });
    } else {
      dialog.showModal()
    }
  }
})
```

这样会有什么问题吗？运行如下

![image-20230816200637219](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/823734ba7237420ab3611d7b87f95186~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

很明显报错了，意思就是一个页面中不能有相同的`view-transition-name`。严格来讲，是**不能同时出现**，如果其他元素都是隐藏的，只有一个是显示的，也没有问题。其实仔细想一下，也很好理解，如果同时有两个相同的名称，并且都可见，最后变换的时候该以哪一个为准呢？

所以，在这种情况下，正确的做法应该是动态设置`view-transition-name`，比如默认不给按钮添加名称，只有在点击的时候才添加，然后在变换结束之后再移除按钮的`view-transition-name`，实现如下

```js
group.addEventListener('click', function(ev){
  if (ev.target.tagName === 'BUTTON') {
    ev.target.style.viewTransitionName = 'dialog' // 动态添加 viewTransitionName
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        ev.target.style.viewTransitionName = '' // 结束后移除 viewTransitionName
        dialog.showModal()
      });
    } else {
      dialog.showModal()
    }
  }
})
```

这样就实现了动态缩放的效果

![Kapture 2023-08-16 at 20.15.24.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30a2d4ecaa1942d4ae3a3cb28f186716~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

大致已经实现想要的效果，不过还有一个小问题，我们把速度放慢一点（把动画时长设置长一点）

![Kapture 2023-08-16 at 20.19.15.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3306e3e849304d7daddb044587b63a42~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

可以清楚的看到，原本的按钮先放大到了弹窗大小，然后逐渐消失。这个过程是我们不需要的，有没有办法去掉呢？

当然也是可以的！原本的按钮其实就是旧视图，也就是点击之前的截图，我们只需要将这个视图隐藏起来就行了

```css
::view-transition-old(dialog) {
  display: none;
}
```

这样就完美实现了从哪里点击就从哪里打开的效果

![Kapture 2023-08-16 at 19.54.03.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6130ac3aea044dd9b47340ca48e900e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

完整代码可以查看：

![](https://juejin.cn/post/)

- [view-transition-dialog (codepen.io)](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fxboxyan%2Fpen%2FWNLeBgY "https://codepen.io/xboxyan/pen/WNLeBgY")

## 四、自定义过渡动画

通过前面的例子可以看出，默认情况下，视图转换动画是一种淡入淡出的动画，然后还有如果位置、大小不同，也会平滑过渡。

除此之外，我们还可以手动指定过渡动画。比如下面这个例子

![Kapture 2023-08-16 at 23.29.02](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d30fe53aab84acf84d4d398b39b6f22~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这是一个黑暗模式的简易模型，实现也非常简单，准备两套主题，这里用`color-scheme`实现

> 有关 color-scheme 的更多详情可以参考这篇文章：[CSS color-scheme 和夜间模式](https://juejin.cn/post/7121532248527994893 "https://juejin.cn/post/7121532248527994893")

```css
.dark{
  color-scheme: dark;
}
```

然后通过点击动态给`html`切换`dark`类名

```js
btn.addEventListener('click', function(ev){
  document.documentElement.classList.toggle('dark')
})
```

这样就得到了主题切换效果

![Kapture 2023-08-17 at 17.18.39](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32ae02e8b5474d0fa1f7af15587c7c9e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

接着，我们添加视图转换动画

```js
btn.addEventListener('click', function(ev){
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      document.documentElement.classList.toggle('dark')
    });
  } else {
    document.documentElement.classList.toggle('dark')
  }
})
```

这样就得到了一个默认的淡入淡出的切换效果（为了方便观察，将动画时长延长了）

![Kapture 2023-08-17 at 17.21.14.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dfb5ea6f9d749169cde35c2db7b4639~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

你可以把前后变化想象成是两张截图的变化，如果要实现点击出现圆形裁剪动画，其实就是在新视图上执行一个裁剪动画，由于是完全重叠的，所以看着像是一种穿透扩散的效果

![image-20230817193943363](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea4a0540533e4bccb4cf69e458b948f7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

动画很简单，就是一个`clip-path`动画

```css
@keyframes clip {
  from {
    clip-path: circle(0%);
  }
  to{
    clip-path: circle(100%);
  }
}
```

我们把这个动画放在`::view-transition-new`中

```css
::view-transition-new(root) {
  /* mix-blend-mode: normal; */
  animation: clip .5s ease-in;
  /* animation-duration: 2s; */
}
```

效果如下

![Kapture 2023-08-17 at 19.44.26.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74a87cb71c85481ab44ca40eb6972bed~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

是不是还有点奇怪？这是因为默认的一些样式导致，包括原有的淡出效果，还有混合模式

![image-20230817194905664](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8633e5e0abc84be7b8201a08738dace6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

所以还需要去除这些影响

```css
::view-transition-old(root) {
  animation: none;
}
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: clip .5s ease-in;
}
```

当然你可以把鼠标点击的位置传递到页面根节点

```js
btn.addEventListener('click', function(ev){
  document.documentElement.style.setProperty('--x', ev.clientX + 'px')
  document.documentElement.style.setProperty('--y', ev.clientY + 'px')
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      document.documentElement.classList.toggle('dark')
    });
  } else {
    document.documentElement.classList.toggle('dark')
  }
})
```

动画里直接通过CSS 变量获取

```css
@keyframes clip {
  from {
    clip-path: circle(0% at var(--x) var(--y));
  }
  to{
    clip-path: circle(100% at var(--x) var(--y));
  }
}
```

这样就实现了完美的扩散切换效果

![Kapture 2023-08-16 at 23.29.02](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1ecd6743a1f4602a329a6ca1abff1c3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

完整代码可以查看：

![](https://juejin.cn/post/)

- [view transition theme change (codepen.io)](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fxboxyan%2Fpen%2FpoqzmLY "https://codepen.io/xboxyan/pen/poqzmLY")

## 五、其他案例

找了几个有趣的例子

只要涉及到前后过渡变化的，都可以考虑用这个特性，例如下面的拖拽排序

![Kapture 2023-08-18 at 14.48.08.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c862fdad538144c8806fc43ff2d2e8fe~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> [codepen.io/argyleink/p…](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fargyleink%2Fpen%2FrNQZbLr "https://codepen.io/argyleink/pen/rNQZbLr")

再比如这样一个数字过渡动画

![Kapture 2023-08-18 at 15.09.48.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ffff69e3a924746befca954d28c1fc6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> [codepen.io/argyleink/p…](https://link.juejin.cn/?target=https%3A%2F%2Fcodepen.io%2Fargyleink%2Fpen%2FjOQKdeW "https://codepen.io/argyleink/pen/jOQKdeW")

还有类似于 APP 的转场动画（多页面跳转）

![Kapture 2023-08-18 at 15.20.34.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cae50b5c17c45c687d3c01eedfb8c03~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> [simple-set-demos.glitch.me/6-expanding…](https://link.juejin.cn/?target=https%3A%2F%2Fsimple-set-demos.glitch.me%2F6-expanding-image%2F "https://simple-set-demos.glitch.me/6-expanding-image/")

## 五、总结和说明

总的来说，原生的视图转换动画可以很轻松的实现两种状态的过渡，让 web 也能实现媲美原生 APP 的动画体验，下面再来回顾一下整个变化过程：

1. 调用`document.startViewTransition`，浏览器会捕捉当前页面的状态，类似于实时截图，或者“快照”
2. 执行实际的 dom 变化，再次记录变化后的页面状态（截图）
3. 触发两者的过渡动画，包括透明度、位移等变化，也可以自定义 CSS 动画
4. 默认情况下是整个页面的淡入淡出变化
5. `::view-transition-old`表示**旧视图**的状态，也就是变化之前的截图，`::view-transition-new`表示**新视图**的状态，也就是变化之后的截图。
6. 如果需要指定具体元素的变化，可以给该元素指定`view-transition-name`
7. 前后变化不一定要同一元素，浏览器是根据`view-transition-name`寻找的
8. 同一时间页面上不能出现两个相同`view-transition-name`的元素，不然视图变化会失效

另外，视图转换动画应该作为一种**体验增强**的功能，而非必要功能，在使用动画时其实拖慢了页面打开或者更新的速度，并且在动画过程中，页面是完全“冻结”的，做不了任何事情，因此需要衡量好动画的时间，如果页面本身就很慢就更不要使用这些动画了。最后，如果觉得还不错，对你有帮助的话，欢迎点赞、收藏、转发❤❤❤

> 欢迎关注我的公众号：**前端侦探**