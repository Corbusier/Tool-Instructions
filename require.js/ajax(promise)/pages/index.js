requirejs.config({
    baseUrl: './',
    paths: {
        jquery: "./libs/jquery-3.2.0",
        API: './libs/API',
        request: './libs/request',
        calendar: './components/calendar'
    }
})

define(function(require) {
    //其他的模块中可以引入jquery
    var $ = require('jquery');
    
    require('calendar');
    //没有进行配置的button模块组件,也可以这样以的形式引入
    
})
