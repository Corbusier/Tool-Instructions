# README

require.js微型demo,模块化由浅入深的过程

 1. 通过promise的ajax请求
在主文件(index)下列出paths加载模块,将数据请求和数据处理分别置于不同的模块下,请求的方法是利用JQuery中的get方法,其中封装好的Promise,返回的也是Promise对象。然后在统一的模块(request.js)管理所有返回的数据。

Click Me：[Promise-Ajax](https://github.com/Corbusier/Article/blob/master/Promise.md#ajax)

 2. 图片加载
具体应用场景：需要把一系列长宽比混乱的图片统一为固定的收缩比时,稳定视觉上的体验。通过require的一个模块来实现这个功能,利用样式修正图片,比如：
```
    1).高>>宽时,令宽=100%,高自动补位然后overflow:hidden
    2).宽>>高时,令高=100%,宽自动补位然后overflow:hidden
```
这整个过程需要图片加载完毕后才能获取图片的原始宽高,才能运行模块,在使用时直接调用它的方法即可。

Click Me：[图片加载](https://github.com/Corbusier/Article/blob/master/Promise.md#图片加载)

3.自定义弹窗模块
由点击button开始展开的一系列事件,弹窗、标题的拖拽、提醒功能等模块实现这些功能,并且弹窗和提醒功能的内容可以完全实现用户自定义,一次完整的require模块化的实践过程。

[完整代码](https://github.com/Corbusier/Tool-Instructions/tree/master/require.js/dialogTest)

[在线演示](https://corbusier.github.io/Tool-Instructions/require.js/dialogTest/index.html)