define(function(require){
	var tool = {
		view(){
			return{
				w:$(window).width(),
				h:$(window).height()
			}
		},
		resize(){
			let clientH = tool.view().h;
			$(".weiyun-content").height(clientH - $("header").outerHeight(true));
		},
		whoSelect(){
			let fileList = document.getElementsByClassName("file-list")[0];
			let checkboxs = fileList.getElementsByClassName("checkbox");
			return Array.from(checkboxs).filter(function(value){
				return value.classList.contains("checked");
			}).map(function(value){
				return $(value).closest(".file-item").get(0);
			})
		},
		getRect(obj){
			return obj.getBoundingClientRect();
		},
		crash(obj1,obj2){
			let first_Rect = tool.getRect(obj1);
			let second_Rect = tool.getRect(obj2);

			let firstLeft = first_Rect.left;
			let firstTop = first_Rect.top;
			let firstRight = first_Rect.right;
			let firstBottom = first_Rect.bottom;

			let secondLeft = second_Rect.left;
			let secondTop = second_Rect.top;
			let secondRight = second_Rect.right;
			let secondBottom = second_Rect.bottom;
			if(firstLeft > secondRight || firstRight < secondLeft || firstTop > secondBottom || firstBottom < secondTop){
				return false;
			}else{
				return true;
			}
		}
		,shrink(){
			$(".tree-menu .ico").bind("click",function(ev){
				console.log(ev.target.closest(".tree-title"))
				$(ev.target).closest(".tree-title").toggleClass("show-list");
				let $ulList = $(ev.target).closest(".tree-title").next();
				if($(ev.target).closest(".tree-title").hasClass("show-list")){
					$ulList.css("display","block");
				}else{
					$ulList.css("display","none");
				}	
			})
		}
	}
	return tool;
})