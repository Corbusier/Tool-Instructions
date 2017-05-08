//workjs01的所有方法和属性可以在该模块下使用,w01.xx(函数或方法)
define(['workjs01'],function(w01){
	var moduleName = "work module 02";
	var moduleVersion = "1.0.0";
	// var setHtml = function(refId,strHtml){
	// 	if(undefined === refConId || null === refConId || "" === refConId + ""){
	// 		return;
	// 	}else{
	// 		$("#" + (refId + "")).html(strHtml+"");
	// 	}
	// };
	w01.loadTip("本页文件都加载完成，本页设计 workjs01.js 文件依赖jquery, workjs02.js 依赖 workjs01.js","loadMsgCon");

	return{
		"moduleName" : moduleName
		,"version" : moduleVersion
	}
});
