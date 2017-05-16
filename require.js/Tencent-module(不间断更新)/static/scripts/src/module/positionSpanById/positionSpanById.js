define(function(require){
	function positionSpanById(id){
		// $("#box span").each(function(index,value){
		// 	let fileId = value.dataset.id;
		// 	if( fileId == id ){
		// 		return value;
		// 	}
		// })
		var allSpan = box.getElementsByTagName("span");
		for( var i = 0; i < allSpan.length; i++ ){
			var fileId = allSpan[i].dataset.id;
			if( fileId == id ){
				return allSpan[i];
			}
		}
	}
	return positionSpanById;
})