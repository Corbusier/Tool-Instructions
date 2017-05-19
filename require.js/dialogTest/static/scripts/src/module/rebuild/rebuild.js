define(['data','handle','render'],function(data,handle,render){
	let currentId = 0;
	let rebuild = (function(fileId){
		handle.getTreeById(currentId).classList.remove("tree-nav");
		handle.getTreeById(fileId).classList.add("tree-nav");
		$(".path-nav").html(render.createNavHTML(fileId));
		let childs = handle.getChildsById(data,fileId);
		childs.length?$(".g-empty").css("display","none"):$(".g-empty").css("display","block");
		$(".file-list").html(render.createFileHTML(fileId));
		currentId = fileId;
		$(".checked-all").removeClass("checked");
	});
	return rebuild;
})