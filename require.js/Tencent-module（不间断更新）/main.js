requirejs.config({
	baseUrl: "static/scripts/src/",
	paths:{
		'jquery': "vendor/jquery/jquery"
		,'tool':"module/tool/tool"
		,'data':"module/data/data"
		,'handle':"module/handleData/handleData"
		,'render':"module/render/render"
	},
	shim: {
		'jquery': {
			exports: "$"
		}
	}
})
require(['jquery','tool','data','render','handle'],function($,tool,data,render,handle){
	tool.resize();
	window.onresize = tool.resize;
	$(".path-nav").html(render.createNavHTML(0));
	$(".tree-menu").html(render.createTreeHTML(-1));
	$(".file-list").html(render.createFileHTML(0))
	handle.getTreeById(0).classList.add("tree-nav");

//=============================交互事件===================================
	//1.树形菜单区域
	let currentId = 0;
	$(".tree-menu").bind("click",function(ev){
		let target = ev.target;
		if( target = target.closest(".tree-title") ){
			let fileId = target.dataset.id;	
			handle.getTreeById(currentId).classList.remove("tree-nav");
			handle.getTreeById(fileId).classList.add("tree-nav");
			$(".path-nav").html(render.createNavHTML(fileId));
			let childs = handle.getChildsById(data,fileId);
			if( childs.length ){
				$(".file-list").html(render.createFileHTML(fileId));
				$(".g-empty").css("display","none");
			}else{
				$(".g-empty").css("display","block");
			}
			currentId = fileId;
		}
	})

	//2.导航区域
	$(".path-nav").bind("click",function(ev){
		let target = ev.target;
		if( target.nodeName === "A" ){
			let fileId = target.dataset.id;
			handle.getTreeById(currentId).classList.remove("tree-nav");
			handle.getTreeById(fileId).classList.add("tree-nav");
			$(".path-nav").html(render.createNavHTML(fileId));
			$(".file-list").html(render.createFileHTML(fileId));
			currentId = fileId;
		}
	})

	//3.文件区域
	$(".file-list").bind("click",function(ev){
		let target = ev.target;
		if( target = target.closest(".file-item") ){
			let fileId = target.dataset.id;
			handle.getTreeById(currentId).classList.remove("tree-nav");
			handle.getTreeById(fileId).classList.add("tree-nav");
			$(".path-nav").html(render.createNavHTML(fileId));
			$(".file-list").html(render.createFileHTML(fileId));
			currentId = fileId;
		}
	})
})
