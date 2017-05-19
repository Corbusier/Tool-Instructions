define(['data'],function(data){
	let handle = {
		getSelfById(data,id){
			return data.find(function (value){
				return value.id == id;
			})
		},
		getChildsById (data,id){
			return data.filter(function(value){
				return value.pid == id;
			})	
		},
		getParentsAllById(data,id){
			let arr = [];
			let self = handle.getSelfById(data,id);
			if( self ){
				arr.push(self);
				arr = arr.concat(handle.getParentsAllById(data,self.pid));
			}
			return arr;
		},
		getTreeById(id){
			let treeMenu = document.querySelector(".tree-menu");	
			let treeTitle = treeMenu.querySelectorAll(".tree-title");
			for( var i = 0; i < treeTitle.length; i++ ){
				if( treeTitle[i].dataset.id == id ){
					return treeTitle[i];
				}
			}
		},
		isTitleExist(data,value,id){
			let childs = handle.getChildsById(data,id);
			return childs.findIndex(function(item){
				return item.title === value;
			}) !== -1;
		},
		getChildsAll(data,id){
			let arr = [];
			let self = handle.getSelfById(data,id);
			arr.push(self);
			let childs = handle.getChildsById(data,self.id);
			childs.forEach(function (value){
				arr = arr.concat(handle.getChildsAll(data,value.id));
			})
			return arr;
		},
		getChildsByIdArr(data,idArr){
			let arr = [];
			idArr.forEach(function(value){
				arr = arr.concat(handle.getChildsAll(data,value));
			})
			return arr;
		},
		deleteChildsByIdArr(data,idArr){
			var childs = handle.getChildsByIdArr(data,idArr);
			for(var i = 0;i<data.length;i++){
				for(var j = 0;j<childs.length;j++){
					if(data[i] === childs[j]){
						data.splice(i,1);
						i--;
						break;
					}
				}
			}
		}
	}	
	return handle;
})

