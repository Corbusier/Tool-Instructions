requirejs.config({
	baseUrl:'static/scripts/src/'
	,paths:{
		'jquery':'lib/jquery/jquery'
		,'workjs01':'work/workjs01'
		,'workjs02':'work/workjs02'
	}
	,shim: {
		'jquery': {
			exports: "$"
		}
	}
})
require(['workjs01', 'workjs02'], function(moudleA, moudleB) {
	moudleA.loadTip("本页文件都加载完成，本页设计 workjs01.js 文件依赖jquery, workjs02.js 依赖 workjs01.js","loadMsgCon");
})