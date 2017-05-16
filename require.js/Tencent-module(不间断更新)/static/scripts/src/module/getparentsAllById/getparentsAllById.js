define(['data'],function(data){
	function getparentsAllById(id){
		let arr = [];
		let obj = data.find( (value) => value.id == id);
		if(obj){
			arr.push(obj);
			arr = arr.concat(getparentsAllById(obj.pid));
		}
		return arr;
	}
	return getparentsAllById;
})