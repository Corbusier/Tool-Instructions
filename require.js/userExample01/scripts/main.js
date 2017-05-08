//配置文件信息 about requirejs config
//自己尝试配置文件及依赖文件的加载
;
require.config({
	//requirejs所在的目录作为根目录
	baseUrl:"./scripts"
	//相关的JS文件导入,包括库、框架,使用的js文件
	//注意都不要加后缀!!
	,paths:{
		"jquery":["lib/jquery/jquery-3.2.0"]
		,"workjs01":"work/workjs01"
		,"underscore":"" 
	}
	//导出的文件,包含了非AMD规范的JS库和框架
	//"exports"
	,shim:{
		"underscore":{
            "exports":"_"
        }
	}
})
//按照不同先后的依赖关系加载各个JS文件
// require(["jquery","workjs01"],function($,w1){
// 	require(["workjs02"]);
// })

//按需加载,并且没有顺序限制,区别于CMD的规则
define(function(require){
	var $ = require('jquery');
	//如果没有配置该模块,也可以这样的方式引入
	require("work/workjs02");
	require("workjs01");
	
})