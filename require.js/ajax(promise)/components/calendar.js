define(function(require) {
    var request = require('request');
    /*
        拿到数据之后,需要处理的组件,可以根据数据render
        为了简化,本例只是输出数据,在实际中,拿到数据之后还要进行相应的处理
        request.js设置的请求函数,其中包含可以直接使用的Promise对象
    */
    request.getTypeInfo()
    .then(function(resp){
        //拿到数据,并执行处理操作
        console.log(resp);
    })
    //将数据请求与数据处理分开,有利于可维护性
})

