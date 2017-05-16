({
	baseUrl: "static/scripts/src/",
	name: "../../../main",
	paths:{
		'jquery': "vendor/jquery/jquery"
		,'createTreeHTML':"module/createTreeHTML/createTreeHTML"
		,'data':"module/data/data"
		,'handle':"module/handleData/handleData"
		,'createNavHTML':"module/createNavHTML/createNavHTML"
		,'createFilesHTML':"module/createFilesHTML/createFilesHTML"
		,'positionSpanById':"module/positionSpanById/positionSpanById"
	},
	shim: {
		'jquery': {
			exports: "$"
		}
	},
	out:"main-built.js"
})


