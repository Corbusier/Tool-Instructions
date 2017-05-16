define(['handle','data'],function(handle,data){
	function createFilesHtml(id){
		let childs = handle.getChildsById(data,id);
		let filesHtml = '';
		childs.forEach( (value) =>{
			filesHtml += `<div class='file-item'>${value.title}</div>`
		});
		return filesHtml;
	}
	return createFilesHtml;
})