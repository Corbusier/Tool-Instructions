define(['data','handle'],function(data,handle){
	function createNavHTML(id){
		let parents = handle.getParentsAllById(data,id).reverse();
		let html = '';
		parents.forEach((value) => {
			html += `<span data-id=${value.id}>${value.title}</span>`	
		})
		return html;
	}	
	return createNavHTML;		
})