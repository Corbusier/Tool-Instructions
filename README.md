# README

> require.js微型demo，模块化由浅入深的过程

### 1.通过promise的ajax请求
在主文件(index)下列出paths加载模块，将数据请求和数据处理分别置于不同的模块下，请求的方法是利用JQuery中的get方法，其中封装好的Promise，返回的也是Promise对象。然后在统一的模块(request.js)管理所有返回的数据。

Click Me：[Promise-Ajax](https://github.com/Corbusier/Tool-Instructions/tree/master/require.js/ajax(promise))

### 2.图片加载
具体应用场景：需要把一系列长宽比混乱的图片统一为固定的收缩比时，稳定视觉上的体验。通过require的一个模块来实现这个功能，利用样式修正图片，比如：
```
    1).高>>宽时,令宽=100%,高自动补位然后overflow:hidden
    2).宽>>高时,令高=100%,宽自动补位然后overflow:hidden
```
这整个过程需要图片加载完毕后才能获取图片的原始宽高，才能运行模块，在使用时直接调用它的方法即可。

Click Me：[完整代码](https://github.com/Corbusier/Tool-Instructions/tree/master/require.js/imgTest)

Click Me：[在线演示](https://corbusier.github.io/Tool-Instructions/require.js/imgTest/index.html)


### 3.自定义弹窗模块
由点击button开始展开的一系列事件，弹窗、标题的拖拽、提醒功能等模块实现这些功能，并且弹窗和提醒功能的内容可以完全实现用户自定义，关于resize的debuncing优化，并使用r.js减少请求数。一次完整的require模块化的实践过程。

Click Me：[完整代码](https://github.com/Corbusier/Tool-Instructions/tree/master/require.js/dialogTest)

Click Me：[在线演示](https://corbusier.github.io/Tool-Instructions/require.js/dialogTest/index.html)

### 4.腾讯微云模块化功能拆分
根据data数据生成的树形菜单，不同的功能拆分为模块，化整为零，利用命名空间避免全局变量污染，拆分的模块有利于代码复用，并且便于维护。不间断更新。更新的过程中可能会出现bug，发现解决之后再跟进新的版本。


#### 更新目录：
> May.18th.2017，暂至重命名功能，发现问题亟待解决。
> May.19th.2017，以上的bug解决，问题如下所示。Keep on

- [x] 1. 文件区域进入下一级时，无法正确的判断全选的状态。

具体描述：全选状态下，进入下一级前如果当前目录有子目录，进入下一级时全选被取消，反之则无法取消。

解决方式：如果该目录下的子目录.length为0，则直接remove全选的class，并且return。然后再根据单选状态判断全选。

- [x] 2. 新建文件夹成功时，treeMenu的渲染空白问题。

具体描述：新建文件夹成功之后并不能根据data数据的改变进行treeMenu重绘，而是出现了一片空白区域。

解决方式：分析整个新建、渲染过程，在渲染模块函数中不需要再传入data或者fileId/currentId，渲染的前提始终是以"微云"为祖先，父子级(父.id == 子.pid)关系围绕的，所以渲染函数createTreeHTML直接传入形参-1即可。

- [x] 3. 新建的文件夹只会在"微云"子级中

具体描述：无论是在哪个目录下创建的新文件夹，都只会出现在"微云"的子级目录下，并不会在期望出现的位置。

解决方式：新产生的文件夹在data数据中，由pid确定父子级关系，而pid由currentId决定，pid是由fileId改变的，所以rebuild函数也必须作为全局函数使用，否则无法改变currentId，也就无法正确确认父子级文件目录的关系。

Click Me : [完整代码](https://github.com/Corbusier/Tool-Instructions/tree/master/require.js/Tencent-module%EF%BC%88%E4%B8%8D%E9%97%B4%E6%96%AD%E6%9B%B4%E6%96%B0%EF%BC%89)

Click Me : [在线演示](https://corbusier.github.io/Tool-Instructions/require.js/Tencent-module（不间断更新）/index.html)






