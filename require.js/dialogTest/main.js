requirejs.config({
	baseUrl: "static/scripts/src/",
	paths:{
		'jquery': "vendor/jquery/jquery"
		,'tool':"module/tool/tool"
		,'data':"module/data/data"
		,'handle':"module/handleData/handleData"
		,'render':"module/render/render"
		,'fulltip':"module/fulltip/fulltip"
		,'dialog':"module/dialog/dialog"
		,'drag':"module/drag/drag"
	},
	shim: {
		'jquery': {
			exports: "$"
		}
	}
})
require(['jquery','tool','data','render','handle','fulltip','dialog','drag'],function($,tool,data,render,handle,fulltip,dialog,drag){
	tool.resize();
	window.onresize = tool.resize;
	$(".path-nav").html(render.createNavHTML(0));
	$(".tree-menu").html(render.createTreeHTML(-1));
	$(".file-list").html(render.createFileHTML(0))
	handle.getTreeById(0).classList.add("tree-nav");

/*< !------------------------------   交互事件  -------------------------------  >*/
	
	function rebuild(fileId){
		handle.getTreeById(currentId).classList.remove("tree-nav");
		handle.getTreeById(fileId).classList.add("tree-nav");
		$(".path-nav").html(render.createNavHTML(fileId));
		let childs = handle.getChildsById(data,fileId);
		childs.length ? $(".g-empty").css("display","none") :
						$(".g-empty").css("display","block");
		$(".file-list").html(render.createFileHTML(fileId));
		currentId = fileId;
		$(".checked-all").removeClass("checked");
	}

	/*1.树形菜单区域*/
	let currentId = 0;
	$(".tree-menu").bind("click",function(ev){
		let target = ev.target;
		if( target = target.closest(".tree-title") ){
			let fileId = target.dataset.id;	
			rebuild(fileId);
		}
	});

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

	/*	
	问题解决过程：
		1.直接判断该目录下的checkbox.length，如果为空则在进入下一级后直接remove全选的class，
		接下来就是根据单选状态判断全选
	*/	
	$(".file-list").bind("click",function(ev){
		let fileList = document.querySelector(".file-list");
		let checkboxs = fileList.getElementsByClassName("checkbox");
		let target = ev.target;
		if( $(target).closest(".checkbox") ){
			target = $(target).closest(".checkbox");
			$(target).toggleClass("checked");
			if(checkboxs.length == 0){
				$(".checked-all").removeClass("checked")
				return;
			}
			let res = Array.from(checkboxs).every(function(value){
				return value.classList.contains("checked");
			})
			res?$(".checked-all").addClass("checked"):$(".checked-all").removeClass("checked");
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

	$(".file-list").bind("click",function(ev){
		ev.stopPropagation();
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
	
	/*	
	问题解决过程：
		1. create.isCreate起初并不会赋值，当点击新建后才有了值true，新建成功后为false，
		此时即使e.keyCode==13也无法再新建，必须等到下一次点击新建后才可以进行整个过程。

		2. 如果可以进行新建，在createFile函数中要先判断标题是否存在再进行后续，如果不存在则在数据中添加
		新建的这一条数据，注意此时使用currentId、fileId都会失效，因为渲染是以父子级(父.id==子.pid)关系，
		"微云"是祖先元素的永恒主题来围绕的，而在render渲染函数中默认有了data，不需要再传id形参，所以直接
		createTreeHTML(-1)即可！

		3.新建的文件夹的pid:currentId,此时需要有rebuild作为全局函数改变currentId,否则新建出来的文件夹
		始终都只会是微云的子文件夹！
	*/	
	let create = document.getElementsByClassName("create")[0];
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
		create.isCreate = true;
	})

	$(document).bind("keyup",function(ev){
		ev.keyCode === 13 && createFile();	
	})

	$(document).bind("mousedown",createFile);

	var treeMenu = document.querySelector(".tree-menu");
	function createFile(){
		if(!create.isCreate) return;
		let firstElement = $(".file-list .file-item").get(0);
		let fileTitle = firstElement.querySelector(".file-title");
		let fileEdtor = firstElement.querySelector(".file-edtor");
		let edtor = firstElement.querySelector(".edtor");

		let value = $(".file-list .file-item .edtor").val().trim();
		if(value){
			let isExist = handle.isTitleExist(data,value,currentId);
			if(isExist){
				$(firstElement).remove();
				fulltip("warn","命名冲突，新建不成功");
			}
			else{
				fileTitle.style.display = "block";
				fileEdtor.style.display = "none";
				fileTitle.innerHTML = value;
				let id = Math.ceil(Math.random()*1000000);
				data.unshift({
					id:id,
					pid:currentId,
					title:value,
					type:"file"
				});
				firstElement.setAttribute("data-id",id);		
				treeMenu.innerHTML = render.createTreeHTML(-1);
				fulltip("ok","新建成功");
				let selectArr = tool.whoSelect();
				selectArr.forEach(function(value){
					var checkbox = value.getElementsByClassName("checkbox")[0];
					checkbox.classList.remove("checked");
					value.classList.remove("file-checked");
				})
				$(".checked-all").removeClass("checked"); 
			}
		}else{
			$(firstElement).remove();
		}
		create.isCreate = false;
	}

/*< !------------------------------   删除文件夹  -------------------------------  >*/

	$(".nav .delete").bind("click",function(ev){
		let selectArr = tool.whoSelect();
		if(selectArr.length){
			new dialog({
				asksure : "确定要删除这张图片吗?",
		        title : "删除文件",
		        text : "已删除的文件可以在回收站找到",
		        okFn(){
		        	let idArr = [];
					selectArr.forEach(function(value){
						idArr.push(value.dataset.id);
					})
					//从data中删除所选的数据
					handle.deleteChildsByIdArr(data,idArr);
					treeMenu.innerHTML = render.createTreeHTML(-1);
					rebuild(currentId);
					fulltip("ok","删除文件成功");
		        }
			})
		}else{
			fulltip("warn","请选择删除文件");
		}
	})
	
})
