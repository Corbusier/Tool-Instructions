define(function(require){
	var methods = {
		// on:function(element,evName,evFn){
		// 	if(element.addEventListener){
		// 		element.addEventListener(evName,evFn,false);
		// 	}else if(element.attachEvent){
		// 		element.attachEvent("on" + evName,evFn);
		// 	}else{
		// 		element["on" + type] = evFn;
		// 	}
		// },
		// off:function(element,evName,evFn){
		// 	if(element.removeEventListener){
		// 		element.removeEventListener(evName,evFn,false)
		// 	}else if(element.detachEvent){
		// 		element.detachEvent("on" + evName,evFn);
		// 	}else{
		// 		element["on" + type] = null;
		// 	}
		// },
		view(){
			return {
				w:$(window).width(),
				h:$(window).height()
			}
		},
		resize(){
			let clientH = methods.view().h;
			$(".weiyun-content").height(clientH - $("header").outerHeight(true));
		}
	}
	return methods;
})