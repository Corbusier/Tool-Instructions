define(function(require) {
    var API = require('API');
    var $ = require('jquery');
    /*
        因为jQuery中的get方法也是通过Promise进行了封装，最终返回的是一个Promise对象，
        因此可以将数据请求与数据处理放在不同的模块
        使用一个统一的模块管理所有的数据请求

        需要的是API中提供的url下的数据,以及ajax的get方法。
        所以要引入API和jquery,即require('API')和require('jquery');
    */

    // 获取当天的信息
    getDayInfo = function() {
        return $.get(API.dayInfo);
    }

    // 获取type信息
    getTypeInfo = function() {
        return $.get(API.typeInfo);
    };

    return {
        getDayInfo: getDayInfo,
        getTypeInfo: getTypeInfo
    }
});
