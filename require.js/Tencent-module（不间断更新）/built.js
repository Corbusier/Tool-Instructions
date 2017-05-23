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
		,'dialog':"module/dialog/dialog"
		,'drag':"module/drag/drag"
		,'dialogmove':"module/dialogMove/dialogMove"
	},
	shim: {
		'jquery': {
			exports: "$"
		}
	},
	out:"main-built.js"
})


