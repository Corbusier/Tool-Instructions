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
		,'dialogmove':"module/dialogMove/dialogMove"
	},
	shim: {
		'jquery': {
			exports: "$"
		}
	}
})
require(['jquery','tool','data','render','handle','fulltip','dialog','drag','dialogmove'],function($,tool,data,render,handle,fulltip,dialog,drag,dialogmove){
	$(window).bind("resize",tool.resize);
	$(".path-nav").html(render.createNavHTML(0));
	$(".tree-menu").html(render.createTreeHTML(-1));
	$(".file-list").html(render.createFileHTML(0));
	handle.getTreeById(0).classList.add("tree-nav");
	tool.resize();
	tool.shrink();
	let fileList = document.getElementsByClassName("file-list")[0];
	let fileItems = fileList.getElementsByClassName("file-item");
	let checkboxs = fileList.getElementsByClassName("checkbox");

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
	
	let create = document.getElementsByClassName("create")[0];
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
				$(".tree-menu").html(render.createTreeHTML(-1));
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
	let deleteFile = document.getElementsByClassName("delete")[0];
	$(".nav .delete").bind("click",function(ev){
		let selectArr = tool.whoSelect();
		if(deleteFile.isDelete)return;
		if(selectArr.length){
			new dialog({
				asksure : "确定要删除所选文件吗?",
		        title : "删除文件",
		        text : "已删除的文件可以在回收站找到",
		        okFn(){
		        	let idArr = [];
					selectArr.forEach(function(value){
						idArr.push(value.dataset.id);
					})
					handle.deleteChildsByIdArr(data,idArr);
					$(".tree-menu").html(render.createTreeHTML(-1));
					rebuild(currentId);
					fulltip("ok","删除文件成功");
		        }
			})
			deleteFile.isDelete = false;
		}else{
			if(!deleteFile.isDelete) return;
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
		ev.stopPropagation();
	})

	$(document).on("mousedown",function(ev){
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
				$(".tree-menu").html(render.createTreeHTML(-1));
			}
		}
		re_obj.fileTitle.style.display = "block";
		re_obj.fileEdtor.style.display = "none";
		re_obj.element.classList.remove("file-checked");
		re_obj.element.querySelector(".checkbox").classList.remove("checked");	
		rename.isRename = false;
		$(".checked-all").removeClass("checked"); 
	}

/*< !------------------------------   框选  -------------------------------  >*/	

	/*<  !----  基础版碰撞检测，完成后考虑优化  ----  >*/
	/*
		新增加功能:
			点击空白区域取消选择
	*/
	let div = null,
		fake = null,
		thumbnail = null;
		isHitElement = [];

	$(document).bind("mousedown",function(ev){
		if( ev.which !== 1 ) return;	
		let target = ev.target;
		if( !$(target).closest(".file-list").get(0) ){
			return;
		}
		let isChecked = false;
		let items = $(target).closest(".file-item").get(0);
		let selectArr = tool.whoSelect();
		if( items ){
			isChecked = !!($(ev.target).closest(".file-item .checked"));
		}
		if( !items ){
			selectArr.forEach(function(value){
				value.classList.remove("file-checked");
				(value.getElementsByClassName("checkbox")[0]).classList.remove("checked");
			})
		}		
		ev.preventDefault();		
		let disX = ev.clientX,
			disY = ev.clientY;
		$(document).bind("mousemove",function(ev){
			if(isChecked){
				let selectArr = tool.whoSelect();
				let fileLen = $(target).closest(".file-list").children(".file-item").length;
				if(Math.abs(ev.clientX - disX)<5||Math.abs(ev.clientY - disY)<5||selectArr.length == 0||selectArr.length == fileLen){
					return;
				}			
				if(!thumbnail){
					thumbnail = document.createElement("div");
					thumbnail.className = "numCircle";
					thumbnail.innerHTML = `<div class="numCircle">
										        ${selectArr.length}
										   </div>`;
				    document.body.appendChild(thumbnail);
				    fake = document.createElement("div");
				    fake.style.cssText = `width: 10px;
        								  height: 10px;
        								  background: red;
        								  position: absolute;
        								  left:0;
        								  top:0;
        								  opacity:0;
								  		 `;
			  		document.body.appendChild(fake);
				}
				thumbnail.style.left = ev.clientX + 24 + "px";
				thumbnail.style.top = ev.clientY + 24 + "px";
				fake.style.left = ev.clientX - 5 + "px";
				fake.style.top = ev.clientY - 5 + "px";

				for(let i = 0;i<fileItems.length;i++){
					let onOff = false;
					for(let j = 0;j<selectArr.length;j++){
						if(selectArr [j] === fileItems[i]){
							onOff = true;
						}
					}
					if(onOff)continue;
					if( tool.crash(fake,fileItems[i]) ){
						fileItems[i].classList.add("file-checked");
						isHitElement = fileItems[i];
					}else{
						fileItems[i].classList.remove("file-checked");
					}
				}
				return;
			};
			
			if(Math.abs(ev.clientX - disX) > 15 || Math.abs(ev.clientY - disY) > 15){
				if(!div){
					div = document.createElement("div");
					div.className = "frame";
					document.body.appendChild(div);
				}

				div.style.width = Math.abs(ev.clientX - disX) + "px";
				div.style.height = Math.abs(ev.clientY - disY) + "px";
				let left = Math.min(ev.clientX,disX);
				let top = Math.min(ev.clientY,disY);
				left = left < 345 ? 345 : left;
				top = top < 143 ? 143 : top;
				div.style.left = left + "px";
				div.style.top = top + "px";

				for(let i = 0;i < fileItems.length;i++){
					if(tool.crash(div,fileItems[i])){
						fileItems[i].classList.add("file-checked");
						checkboxs[i].classList.add("checked");
						isHitElement = fileItems[i];
					}else{
						fileItems[i].classList.remove("file-checked");
						checkboxs[i].classList.remove("checked");
						isHitElement = null;
					}
				}
				let selectArr = tool.whoSelect();
				selectArr.length == fileItems.length ? $(".checked-all").addClass("checked")
													 : $(".checked-all").removeClass("checked");
			}
		})
		$(document).bind("mouseup",function(){
			$(document).off("mousemove");
			$(document).off("mouseup");
			if( div ){
				document.body.removeChild(div);
				div = null;
			}
			if( thumbnail ){
				document.body.removeChild(fake);
				document.body.removeChild(thumbnail);

				fake = null;
				thumbnail = null;
			}		
			// if(isHitElement){
			// 	let onOff = false;
			// 	let selectArr = tool.whoSelect();
			// 	let selectIdArr = selectArr.map(function(value){
			// 		return value.dataset.id;
			// 	})
			// 	let fileId = isHitElement.dataset.id;
			// 	for(let i = 0,len=selectIdArr.length;i<len;i++){
			// 		let self = handle.getSelfById(data,selectIdArr[i]);
			// 		let isExist = handle.isTitleExist(data,self.title,fileId);
			// 		let fileList = document.querySelector(".file-list");
			// 		if(!isExist){
			// 			self.pid = fileId;
						
			// 		}else{
			// 			onOff = true;
			// 		}
			// 	}
			// 	if(onOff){
			// 		fulltip("warn","部分文件因重名移动失败");
			// 	}
			// 	$(".tree-menu").html(render.createTreeHTML(-1));
			// 	isHitElement = null;
			// }
		})
	})

/*< !------------------------------   移动到  -------------------------------  >*/	
	
	let move = document.getElementsByClassName("move")[0];
	$(".nav .move").bind("click",function(){
		let fileId = null;
		let moveStatus = true;
		let selectArr = tool.whoSelect();
		let selectIdArr = [];
		if(move.isMoved)return;
		for(var i = 0;i<selectArr.length;i++){
			selectIdArr.push(selectArr[i].dataset.id);
		}
		if(selectIdArr.length){
			new dialogmove({
				titleName : "选择储存位置",
	            fileTitle : handle.getSelfById(data,selectIdArr[0]).title,
	            content: "<div class='tree-menu-comm tree-move'>"+render.createTreeHTML(-1)+"</div>",
	            okFn : function(){
            		if(moveStatus){
						return true;
					}else{
						let onOff = false;
						for(let i = 0;i<selectIdArr.length;i++){
							let self = handle.getSelfById(data,selectIdArr[i]);
							let isExist = handle.isTitleExist(data,self.title,fileId);
							if(!isExist){
								self.pid = fileId;
								fileList.removeChild(selectArr[i]);
								fulltip("ok","文件移动成功");
							}else{
								onOff = true;
							}
						}
						if(onOff){
							fulltip("warn","文件因重名移动失败");
						}
						$(".tree-menu").html(render.createTreeHTML(-1))
					}
	            }
			})
			if(selectArr.length > 1){
				var fileNum = document.getElementsByClassName("fileNum")[0];
				$(".fileNum").html("等" +selectIdArr.length+ "个文件")
			}
			let selectData = handle.getChildsByIdArr(data,selectIdArr);
			let currentElement = $(".tree-move .tree-title").eq(0);
			currentElement.addClass("tree-nav");	
			$(".tree-move").bind("click",function(ev){
				let target = ev.target;
				if(target = $(target).closest(".tree-title")){
					currentElement.removeClass("tree-nav");
					target.addClass("tree-nav");
					currentElement = target;
					fileId = target.get(0).dataset.id;
					let oneData = handle.getSelfById(data,fileId);
					let selfData = handle.getSelfById(data,selectIdArr[0]);
					if(fileId == selfData.pid){
						$(".error").html("该文件下已经存在");
						return;
					}
					var onOff = false;
					for(var i = 0;i<selectData.length;i++){
						if(oneData.id == selectData[i].id){
							onOff = true;
							break;
						}
					}
					if(onOff){
						$(".error").html("不能将文件移动到自身或其子文件夹下");
						moveStatus = true;
					}else{
						$(".error").html("");
						moveStatus = false;
					}
				}
			})
			move.isMoved = false;
		}else{
			if(move.isMoved == false) return;	
			fulltip("warn","请选择要移动的文件夹");			
		}
	})
})
