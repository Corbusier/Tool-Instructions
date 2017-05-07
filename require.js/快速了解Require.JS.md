# 快速了解Require.JS

R.J的主要功能是按不同的先后依赖关系,异步加载JS文件,适合在浏览器中使用,可以确保依赖的JS文件加载完成之后再加载当前的文件,核心的思想是AMD。只做一件事：模块化。而模块化的作用就是避免全局变量污染,命名冲突的问题,它可以作为一种命名空间使用。

RequireJS主要的功能：1)引入需要使用的命名空间(顺便加个别名也行)；2)将自己的代码放到命名空间中，避免全局污染。
RequireJS 定义了(define)一个命名空间，在定义的时候，顺便引用了需要使用其他命名空间。按照 RequireJS 的术语，它把命名空间叫做“模块”。注意，在这里，RequireJS 定义的模块(命名空间)是匿名的，没有取名，这是和c#不同的地方。

假如新建另外一个awesome.test2.js文件来使用awesome.test1.js：
```
    define(['awesome.test1'],function(t1){
        return{
            NewTest : function(){
                t1.MyTest();
            }
        }
    })
```
通过不加后缀的文件名,引入了awesome.test1的命名空间,并给它取了别名 t1,然后在代码中使用 t1.MyTest() 方法。按照AMD规范,所有的模块定义都必须放在都必须放在 return {} 对象中。你的代码都要写在 return 返回的 {} 对象里面。这样做显得臃肿难看？你可以重构一下，比如这样做：
```
    define(['awesome.test1'],function(t1){
        function someFunc1() {
            // Your Code...
        }
        function someFunc2() {
            // Your Code...
        }
        //通过 return 方式，将需要公开的函数暴露出来，供其他 js 调用
        //这一点正是契合了在这个模块中使用单例的公共接口,这样就可以访问私有变量和函数
        return{
            NewTest : function(){
                t1.MyTest();
            },
            fun1 : someFunc1,
            fun2 : someFunc2
        }
    })
```
当然,如果你想使用这些功能,必须要在页面中引用 require.js 文件：

## 配置
```
    <script data-main="main.js" src="frame/js/require.js"></script>
```



