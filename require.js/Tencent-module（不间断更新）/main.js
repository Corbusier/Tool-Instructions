requirejs.config({
	baseUrl: "static/scripts/src/",
	paths:{
		'jquery': "vendor/jquery/jquery"
		,'tool':"module/tool/tool"
		,'data':"module/data/data"
		,'handle':"module/handleData/handleData"
		,'render':"module/render/render"
		,'rebuild':"module/rebuild/rebuild"
		,'fulltip':"module/fulltip/fulltip"
	},
	shim: {
		'jquery': {
			exports: "$"
		}
	}
})
require(['jquery','tool','data','render','handle','rebuild','fulltip'],function($,tool,data,render,handle,rebuild,fulltip){
	tool.resize();
	window.onresize = tool.resize;
	$(".path-nav").html(render.createNavHTML(0));
	$(".tree-menu").html(render.createTreeHTML(-1));
	$(".file-list").html(render.createFileHTML(0))
	handle.getTreeById(0).classList.add("tree-nav");

/*< !------------------------------   交互事件  -------------------------------  >*/
	/*1.树形菜单区域*/
	let currentId = 0;
	$(".tree-menu").bind("click",function(ev){
		let target = ev.target;
		if( target = target.closest(".tree-title") ){
			let fileId = target.dataset.id;	
			rebuild(fileId);
		}
	})

	/*2.导航区域*/
	$(".path-nav").bind("click",function(ev){
		let target = ev.target;
		if( target.nodeName === "A" ){
			let fileId = target.dataset.id;
			rebuild(fileId);
		}
	})

	/*3.文件区域*/
	/*
		包括功能：
			1).点击进入下一级
			2).点击单选功能,判断能否进入下一级文件
			3).进入、离开文件区域的选框

	*/
	$(".file-list").bind("click",function(ev){
		let target = ev.target;
		if( $(target).closest(".checkbox").get(0) || $(target).closest(".edtor").get(0) ){
			return;
		}
		if( target = target.closest(".file-item") ){
			let fileId = target.dataset.id;
			rebuild(fileId);
		}
	})

	$(".file-list").bind("click",function(ev){
		let target = ev.target;
		let fileList = document.querySelector(".file-list");
		let checkboxs = fileList.getElementsByClassName("checkbox");
		if( $(target).closest(".checkbox") ){
			target = $(target).closest(".checkbox");
			$(target).toggleClass("checked");
			let res = Array.from(checkboxs).every(function(value){
				return value.classList.contains("checked");
			})
			res ? $(".checked-all").addClass("checked"):$(".checked-all").removeClass("checked");
		}
	})

	$(".file-list").bind("mouseover",function(ev){
		let target = ev.target;
		if( target = target.closest(".file-item") ){
			$(target).addClass("file-checked");
		}
	})

	$(".file-list").bind("mouseout",function(ev){
		let target = ev.target;
		if( target = target.closest(".file-item") ){
			let checkbox = target.getElementsByClassName("checkbox")[0];
			if( !$(checkbox).hasClass("checked") ){
				$(target).removeClass("file-checked");
			}
		}
	})

/*< !------------------------------   全选功能  -------------------------------  >*/
	
	$(".checked-all").bind("click",function(){
		let childs = handle.getChildsById(data,currentId);
		if(!childs.length) return;
		let res = $(this).toggleClass("checked");
		$(".file-list .checkbox").each(function(index,value){
			if(res.hasClass("checked")){
				$(value).addClass("checked");
				$(".file-list .file-item").eq(index).addClass("file-checked");
			}else{
				$(value).removeClass("checked");
				$(".file-list .file-item").eq(index).removeClass("file-checked");
			}
		})
	})

/*< !------------------------------   新建文件夹  -------------------------------  >*/

	let createOnoff = true;
	$(".create").bind("mouseup",function(){
		let newFile = render.createNewFile();
		let firstElement = $(".file-list .file-item").get(0);
		let edtor = newFile.querySelector(".edtor");
		let fileTitle = newFile.querySelector(".file-title");
		let fileEdtor = newFile.querySelector(".file-edtor");
		
		firstElement ? $(newFile).insertBefore(firstElement)
					: $(".file-list").append( newFile );
		$(".g-empty").css("display","none");
		
		fileTitle.style.display = "none";
		fileEdtor.style.display = "block";
		edtor.focus();
		$(".create").get(0).isCreate = true;
	})

	$(document).bind("keyup",function(ev){
		ev.keyCode === 13 && createFile();
	})
	
	function createFile(){
		if(!$(".create").get(0).isCreate) return;
		let firstElement = $(".file-list .file-item").get(0);
		let fileTitle = firstElement.querySelector(".file-title");
		let fileEdtor = firstElement.querySelector(".file-edtor");
		let edtor = firstElement.querySelector(".edtor");

		let value = $(".file-list .file-item .edtor").val().trim();
		if(value){
			var isExist = handle.isTitleExist(data,value,currentId);
			if(isExist){
				$(firstElement).remove()
				fulltip("warn","命名冲突，新建不成功");
			}else{
				fileTitle.style.display = "block";
				fileEdtor.style.display = "none";
				fileTitle.innerHTML = value;
				var id = Math.ceil(Math.random()*1000000);
				data.unshift({
					id:id,
					pid:currentId,
					title:value,
					type:"file"
				});
				firstElement.setAttribute("data-id",id);
				console.log(firstElement)
				var treeMenu = document.querySelector(".tree-menu");
				treeMenu.innerHTML = render.createTreeHTML(data);
				//console.log(data)
			}
		}
	}


})
