requirejs.config({
    baseUrl: './',
    paths: {
        jquery: "./libs/jquery-3.2.0"
        ,imageCenter : './components/imageCenter'
    }
})

define(function(require) {
    /*
        其他的模块中可以引入jquery
        需要在index.js下调用imageCenter函数
        没有进行配置的button模块组件,也可以这样以的形式引入
        包裹图片的容器
        传入image的warp标签list，将其中的iamge标签设置为居中
    */
    var $ = require('jquery');
    var imageCenter = require('imageCenter');
    var imageWrapList = document.querySelectorAll('.img-center');
    imageCenter(imageWrapList, 'wspectFill');
})
