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

	let treeMenu = document.querySelector(".tree-menu");
	
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

/*< !------------------------------   重命名  -------------------------------  >*/	
	
	/*
		<  !----  写的非常的粗陋，功能完成之后再考虑优化  ----  >
		
		发现一个原版的小疏漏：
			当该目录下只有一个子文件，重命名后，全选的状态之后没有及时的切换

		问题解决过程：
			当keyCode == 13和点击document时作用相同，都会进入Rename函数，函数中的判断数据
			来源于点击重命名时产生的whoSelect。
			
			Rename函数功能：

				1.重命名点击时，先判断选框有几个
					1). 如果只有一个，将标题和文本框状态修改，之后直接修改文本框的内容
					2). 如果选了多个，warn,message
					3). 没选，warn,message

				2. 上一步得到的结果，需要再做一些判断是否合法
					1). 如果标题是空值，跳过2)，进入3)
					2). 如果标题有值存在
						①. 和初始值相同，什么都不做
						②. 在同一级下已存在，warn,message
						③. 命名成功
					3). 选区选框的状态切换，文本框和标题状态切换
				
				3. 重命名成功后，全选框都要移除全选
	*/
	let re_obj = {};
	let rename = document.getElementsByClassName("rename")[0];
	$(".nav .rename").bind("click",function(ev){
		let selectArr = tool.whoSelect();
		if(selectArr.length == 1){
			re_obj.element = selectArr[0];
			re_obj.fileTitle = re_obj.element.querySelector(".file-title");
			re_obj.fileEdtor = re_obj.element.querySelector(".file-edtor");
			re_obj.edtor = re_obj.element.querySelector(".edtor");
			re_obj.fileTitle.style.display = "none";
			re_obj.fileEdtor.style.display = "block";	
			re_obj.edtor.select();		
			re_obj.edtor.value = re_obj.fileTitle.innerHTML.trim();
			rename.isRename = true;
		}else if(selectArr.length > 1){
			fulltip("warn","只能对单个文件重命名");
		}else{
			fulltip("warn","请选择文件");
		}
	})

	$(".file-list").bind("keyup",function(ev){
		if(!rename.isRename) return;
		ev.keyCode == 13 && Rename();
	})

	$(window).on("mousedown",function(ev){
		Rename();
	})

	function Rename(){
		if(!rename.isRename) return;
		let value = re_obj.edtor.value.trim();
		if(value){
			let isExist = handle.isTitleExist(data,value,currentId);
			if(value === re_obj.fileTitle.innerHTML.trim()){
			
			}else if(isExist){
				fulltip("warn","命名冲突，请重新命名");
			}else{
				fulltip("ok","命名成功");
				re_obj.fileTitle.innerHTML = value;
				let self = handle.getSelfById(data,re_obj.element.dataset.id);
				self.title = value;
				treeMenu.innerHTML = render.createTreeHTML(-1);
			}
		}
		re_obj.fileTitle.style.display = "block";
		re_obj.fileEdtor.style.display = "none";
		re_obj.element.classList.remove("file-checked");
		re_obj.element.querySelector(".checkbox").classList.remove("checked");	
		rename.isRename = false;
		$(".checked-all").removeClass("checked"); 
	}

})
