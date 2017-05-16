define(['data','handle'],function(data,handle){
	function createTreeHTML(id){
		let childs = handle.getChildsById(data,id);
		let html = '<ul>';
		childs.forEach(function (value){
			let parentsLength = handle.getParentsAllById(data,value.id).length;
			html += `<li><span data-id=${value.id} style="padding-left:${parentsLength*50}px;">${value.title}</span>
					${createTreeHTML(value.id)}
					</li>`
		})
		html += '</ul>';
		return html;
	}
	return createTreeHTML;
})
