define(['data','handle'],function(data,handle){
	let render = {
		createTreeHTML(id){
			let childs = handle.getChildsById(data,id);
			//console.log(childs)
			let html = "<ul>";
			childs.forEach( (value) => {
				let level = handle.getParentsAllById(data,value.id).length;
				let childs2 = handle.getChildsById(data,value.id);
				let className = childs2.length ? "tree-contro" : "tree-contro-none";
				html += `<li>
	                    <div style="padding-left:${level*14}px;" class="tree-title ${className} " data-id=${value.id}>
	                        <span>
	                            <strong class="ellipsis">${value.title}</strong>
	                            <i class="ico"></i>
	                        </span>
	                    </div>`;
                html += render.createTreeHTML(value.id);	
            	html += '</li>';
			})
			html += "</ul>";
			return html;
		}
		,createNavHTML(id){
			let parents = handle.getParentsAllById(data,id).reverse();	
			let len = parents.length;
			let navHtml = '';
			for( var i = 0;i < len-1;i++ ){
				navHtml += `<a href="javascript:;" data-id=${parents[i].id} style="z-index:${(len-i)};">${parents[i].title}</a>`;
			}
			navHtml += `<span class="current-path" style="z-index:0;">${parents[len-1].title}</span>`;
			return navHtml;
		}
		,createFileHTML(id){
			let fileChilds = handle.getChildsById(data,id);
			let fileHtml = "";
			fileChilds.forEach(function(value){
			fileHtml += `<div class="file-item" data-id="${value.id}">
	                         <div class="item">
	                             <lable class="checkbox"></lable>
	                                 <div class="file-img">
	                                 <i></i>
	                                 </div>
	                             <p class="file-title-box">
	                                 <span class="file-title">${value.title}</span>
	                                 <span class="file-edtor">
	                                     <input class="edtor" type="text">
	                                 </span>
	                             </p>
	                         </div> 
	                     </div>`;
			});
			return fileHtml;
		}
		,fileInner(value){
			let str = `<div class="item">
		                 <lable class="checkbox"></lable>
		                     <div class="file-img">
		                     <i></i>
		                     </div>
		                 <p class="file-title-box">
		                     <span class="file-title">${value.title}</span>
		                     <span class="file-edtor">
		                         <input class="edtor" type="text">
		                     </span>
		                 </p>
		             </div>`;
		    return str;
		}
		/*<!--- 先传一个空对象,占据一个位置 --->*/
		,createNewFile(){
			var div = document.createElement("div");
			div.className = "file-item";		
			div.innerHTML = render.fileInner({});
			return div;
		}
		// ,createFile(){
		// 	if(!$(".create").get(0).isCreate) return;
		// 	let firstElement = $(".file-list .file-item");
		// 	let value = $(".file-list .file-item .edtor").val().trim();
		// 	if(value){
		// 		var isExist = handle.isTitleExist(data,value,currentId);
		// 		console.log(isExist)
		// 	}
		// }
	}
	return render;
})