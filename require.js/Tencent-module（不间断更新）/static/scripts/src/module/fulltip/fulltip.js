define(['jquery'],function($){
	var fullTip = function(className,message){
		$(".full-tip-box").removeClass("ok warn");
		$(".full-tip-box").addClass("full-tip-box");
		setTimeout(function(){
			$(".full-tip-box").addClass(className);
			$(".full-tip-box").css({top:0});
		},0);
		$(".full-tip-box .text").html(message);
		clearTimeout($(".full-tip-box").timer);
		$(".full-tip-box").timer = setTimeout(function(){
			$(".full-tip-box").css({top:"-32px"});
		},2000);
	};
	return fullTip;
})