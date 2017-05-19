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
				return $(value).closest(".file-item").get(0)
			})
		}
	}
	return tool;
})