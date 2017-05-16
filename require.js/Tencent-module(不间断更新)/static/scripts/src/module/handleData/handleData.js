define(['data'],function(data){
	let handle = {
		getSelfById(data,id){
			return data.find(function (value){
				return value.id == id;
			})
		},
		getChildsById (data,id){
			return data.filter(function (value){
				return value.pid == id;
			})	
		},
		getParentsAllById (data,id){
			let arr = [];
			let self = handle.getSelfById(data,id);
			if( self ){
				arr.push(self);
				arr = arr.concat(handle.getParentsAllById(data,self.pid));
			}
			return arr;
		}
	}	
	return handle;
})

