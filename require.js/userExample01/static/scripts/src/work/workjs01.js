//定义模块,该模块依赖jquery
//jquery在模块里面可以$使用
define(["jquery"],function($){
	//模块的单例模式
	//模块下的myModule对象拥有特权方法loadTip和一些私有属性
	var myModule = {};
	var moduleName = "work module 01";
	var version = "1.0.0"; 
	var loadTip = function(tipMsg,refConId){
		var tipMsg = tipMsg || "module is loaded finish.";
		if(undefined === refConId || null === refConId || "" === refConId + ""){
			alert(tipMsg);
		}else{
			$("#" + (refConId+"")).html(tipMsg+"");
		}
	}
	myModule.moduleName = moduleName;
	myModule.version = version;
	myModule.loadTip = loadTip;
	return myModule;
})
