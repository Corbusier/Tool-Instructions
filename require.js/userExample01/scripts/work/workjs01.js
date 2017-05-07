define(['jquery'],function($){  //注意模块的写法  
    //1,define intenal variable area//变量定义区  
    var myModule = {};//推荐方式  
    var moduleName = "work module 01";  
    var version = "1.0.0";  
      
    //2,define intenal funciton area//函数定义区  
    var loadTip = function(tipMsg, refConId){  
        var tipMsg = tipMsg || "module is loaded finish.";  
        if(undefined === refConId || null === refConId || "" === refConId+""){  
            alert(tipMsg);  
        }else{  
            $('#' + (refConId+"")).html(tipMsg);  
        }  
    };  
      
    //3,should be return/output a object[exports/API] if other module need  
    //如有需要暴露(返回)本模块API(相关定义的变量和函数)给外部其它模块使用  
    myModule.moduleName = moduleName;  
    myModule.version = version;  
    myModule.loadTip = loadTip;   
    return myModule;  
      
    /* 
    //this is same to four line code upper//跟上面四行一样 
    return { 
        "moduleName":"work module 01" 
        ,"version":"1.0.0" 
        ,loadTip:loadTip 
    }; 
    */  
      
});  