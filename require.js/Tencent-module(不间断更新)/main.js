requirejs.config({
	baseUrl: "static/scripts/src/",
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
	}
})
require(['jquery','data','createTreeHTML','handle','createNavHTML','createFilesHTML','positionSpanById'],function($,data,createTreeHTML,handle,createNavHTML,createFilesHTML,positionSpanById){
	let treeInitId = -1;
	let navInitId = 0;
	let currentId = 0;
	
	$("#box").html(createTreeHTML(treeInitId));
	$("#nav").html(createNavHTML(navInitId));
	$("#files").html(createFilesHTML(navInitId))
	positionSpanById(currentId).style.background = 'red';
	
	$("#box span").each(function(index,value){
		value.onclick = function(){
			let fileId = this.dataset.id;
			$("#nav").html(createNavHTML(fileId));
			$("#files").html(createFilesHTML(fileId));
			positionSpanById(currentId).style.background = '';
			positionSpanById(fileId).style.background = 'yellow';
			currentId = fileId;
		}
	})
	$("#nav").on("click",function(ev){
		let target = ev.target;
		if( target.nodeName.toLowerCase() === "span" ){
			let fileId = target.dataset.id;
			$("#nav").html(createNavHTML(fileId));
			$("#files").html(createFilesHTML(fileId));
		}
	})
})

