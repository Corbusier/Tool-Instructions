requirejs.config({
	baseUrl: "static/scripts/src/",
	paths:{
		'fulltip': "module/fulltip/fulltip"
		,'jquery': "vendor/jquery/jquery"
		,'dialog': "module/dialog/dialog"
		,'drag': "module/drag/drag"
		
	},
	shim: {
		'jquery': {
			exports: "$"
		}
	}
})
require(['dialog','jquery','drag','fulltip'],function($,dialog,drag,fulltip){
	$(".aspect").bind("click",function(){
		new dialog({
			title:"状态",
            asksure:"天都黑了,我们该回家了",
            text:"一生负气成今日,四海无人对夕阳",
            left:null,
            top:null
		})
	})
})

