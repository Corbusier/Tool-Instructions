({
	baseUrl: "static/scripts/src/",
	name: "../../../main",
	paths:{
		'jquery': "vendor/jquery/jquery"
		,'tool':"module/tool/tool"
		,'data':"module/data/data"
		,'handle':"module/handleData/handleData"
		,'render':"module/render/render"
		,'fulltip':"module/fulltip/fulltip"
	},
	shim: {
		'jquery': {
			exports: "$"
		}
	},
	out:"main-built.js"
})


