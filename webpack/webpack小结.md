# webpack小结


## 模块系统

模块系统主要解决模块的定义、依赖和导出，先来看看已经存在的模块系统。如果把每一个文件看做是一个模块，那么他们的接口通常是暴露在全局作用域下，也就是定义在 window 对象中，不同模块的接口调用都是一个作用域中，一些复杂的框架，会使用命名空间的概念来组织这些模块的接口，典型的例子如 YUI 库。
原始的加载方式暴露了一些弊端：

 - 全局作用域下容易造成变量冲突
 - 文件只能按照 <script> 的书写顺序进行加载
 - 开发人员必须主观解决模块和代码库的依赖关系
 - 在大型项目中各种资源难以管理，长期积累的问题导致代码库混乱不堪

### CommonJS
服务器端的 Node.js 遵循 CommonJS规范，该规范的核心思想是允许模块通过 require 方法来同步加载所要依赖的其他模块，然后通过 exports 或 module.exports 来导出需要暴露的接口。
优点：

 1. 服务器端模块便于重用
 2. NPM 中已经有将近20万个可以使用模块包
 3. 简单并容易使用

缺点：

 1. 同步的模块加载方式不适合在浏览器环境中，同步意味着阻塞加载，浏览器资源是异步加载的
 2. 不能非阻塞的并行加载多个模块

### AMD
Asynchronous Module Definition 规范其实只有一个主要接口 define(id?, dependencies?, factory)，它要在声明模块的时候指定所有的依赖 dependencies，并且还要当做形参传到 factory 中，对于依赖的模块提前执行，依赖前置。
```js
    define("module", ["dep1", "dep2"], function(d1, d2) {
      return someExportedValue;
    });
    require(["module", "../file"], function(module, file) { /* ... */ });
```

优点：

 1. 适合在浏览器环境中异步加载模块
 2. 可以并行加载多个模块

缺点:
 1. 提高了开发成本，代码的阅读和书写比较困难，模块定义方式的语义不顺畅
 2. 不符合通用的模块化思维方式，是一种妥协的实现

### ES6模块
ES6模块的设计思想，是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。依靠Babel实现。
```
    import "jquery";
    export function doStuff() {}
    module "localModule" {}
```
优点：
 1. 容易进行静态分析
 2. 面向未来的 ECMAScript 标准
 
缺点：
 1. 原生浏览器端还没有实现该标准
 2. 全新的命令字，新版的 Node.js才支持

### 所有的资源都是模块
上述的模块都是JS模块文件，在前端开发过程中还涉及到样式、图片、字体、HTML 模板等等众多的资源。这些资源还会以各种方言的形式存在，比如 coffeescript、 less、 sass、众多的模板库、多语言系统（i18n）等等。
如果他们都可以视作模块，并且都可以通过require的方式来加载，比如：
```js
    require("./style.css");
    require("./style.less");
    require("./template.jade");
    require("./image.png");
```


## 什么是Webpack
Webpack 是一个模块打包器。它将根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源。
### Webpack的特点:
#### 代码拆分
Webpack 有两种组织模块依赖的方式，同步和异步。异步依赖作为分割点，形成一个新的块。在优化了依赖树后，每一个异步区块都作为一个文件被打包。

#### 智能解析
Webpack 有一个智能解析器，几乎可以处理任何第三方库，无论它们的模块形式是 CommonJS、 AMD 还是普通的 JS 文件。甚至在加载依赖的时候，允许使用动态表达式 require("./templates/" + name + ".jade")。
#### 插件系统
Webpack 还有一个功能丰富的插件系统。大多数内容功能都是基于这个插件系统运行的，还可以开发和使用开源的 Webpack 插件，来满足各式各样的需求。
#### 快速运行
Webpack 使用异步 I/O 和多级缓存提高运行效率，这使得 Webpack 能够以令人难以置信的速度快速增量编译。

## webpack安装的环境变量问题
第一次安装时遇到了这样的问题:
尝试初始化==> 全局安装 ==> 局部安装 ==> webpack指令失败,失败原因：webpack不是内部或外部指令,搜索问题得出结论：环境变量配置错误导致。

## 以nodejs安装到D盘为例解决方案：
    
    1.安装node.js
        通过path路径查看环境变量,如果出现D:\nodejs\ 说明安装成功。
    
    2.修改默认的node路径
        新建一个NODE_PATH的键,输入设置系统变量NODE_PATH为D:\nodejs\node_global\node_modules
    
    3.Administrator用户变量的PATH路径也要改为以上的地址。
    
    4.配置npm的路径
        在nodejs文件夹下新建两个文件夹,node_global和node_cache,启动cmd,输入以下的命令:
    
        npm config set prefix "d:\nodejs\node_global"npm config set cache "d:\nodejs\node_cache"
    
    5.通过npm在d:nodejs文件夹全局安装webpack
        npm install webpack -g
    
    6.在D:\nodejs\node_globalnpm下局部安装webpack
        npm install webpack --save-dev
    
    7.在以上的文件夹下就可以使用webpack了
        
        node
        require('webpack')
    可以检测除是否配置成功

## 常用webpack指令:

    webpack------->进行打包
    webpack --watch------->自动监控进行打包
    webpack --display-modules ------->打包时显示隐藏的模块
    webpack --display-chunks------->打包时显示原因
    webpack --display-error-details------->显示详细错误信息
    npm install style-loader css-loader --save-dev------->下载loader处理对应的文件
    npm install html -webpack-plugin --save-dev------->安装html插件

### loader的特性：
    
Webpack 本身只能处理 JavaScript 模块，如果要处理其他类型的文件，就需要使用 loader 进行转换。

Loader 可以理解为是模块和资源的转换器，它本身是一个函数，接受源文件作为参数，返回转换的结果。这样，我们就可以通过 require 来加载任何类型的模块或文件，比如 CoffeeScript、 JSX、 LESS 或图片。

 - Loader 可以通过管道方式链式调用，每个 loader
    可以把资源转换成任意格式并传递给下一个 loader ，但是最后一个 loader 必须返回 JavaScript。
 - Loader 可以同步或异步执行。
 - Loader 运行在 node.js 环境中，所以可以做任何可能的事情。
 - Loader 可以接受参数，以此来传递配置项给 loader。
 - Loader 可以通过文件扩展名（或正则表达式）绑定给不同类型的文件。
 - Loader 可以通过 npm 发布和安装。
 - 除了通过 package.json 的 main 指定，通常的模块也可以导出一个 loader 来使用。
 - Loader 可以访问配置。
 - 插件可以让 loader 拥有更多特性。
 - Loader 可以分发出附加的任意文件。

安装loader:
```js
    npm install css-loader style-loader
```
写入一个style.css:
```js
    /* style.css */
body { background: yellow; }
```
修改之前的entry.js：
```js
    require("!style-loader!css-loader!./style.css") // 载入 style.css
document.write('It works.')
document.write(require('./module.js'))
```
将 entry.js 中的 require("!style!css!./style.css") 修改为 require("./style.css"),再执行:
```js
    webpack entry.js bundle.js --module-bind "css=style-loader!css-loader"
```
    在该电脑下是双引号
    
刷新index.html之后可以看到效果,body为黄色

### 配置文件
除了以上的传入参数的方法,还可以通过指定的配置文件来执行,默认情况下,会搜索当前目录的webpack.config.js文件,这个文件是一个node.js模块,返回一个json格式的配置信息对象,或者通过--config选项来配置文件,在根目录下(D:\nodejs\node_globalnpm)创建 packge.json来添加webpack需要的以来:
```js
    {
      "name": "webpack-example",
      "version": "1.0.0",
      "description": "A simple webpack example.",
      "main": "bundle.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [
        "webpack"
      ],
      "author": "zhaoda",
      "license": "MIT",
      "devDependencies": {
        "css-loader": "^0.21.0",
        "style-loader": "^0.13.0",
        "webpack": "^1.12.2"
      }
    }
```

```
    # 如果没有写入权限，请尝试如下代码更改权限
    chflags -R nouchg .
    sudo chmod  775 package.json
``` 
然后npm install。
接着创建配置文件webpack.config.js：
```js
    var webpack = require('webpack')

    module.exports = {
      entry: './entry.js',
      output: {
        path: __dirname,
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          {test: /\.css$/, loader: 'style-loader!css-loader'}
        ]
      }
    }
```
最后直接在根目录下运行webpack,可以看到上一节index内容同样的结果。

### 插件
插件可以完成更多 loader 不能完成的功能。
插件的使用一般是在 webpack 的配置信息 plugins 选项中指定。利用一个最简单的 BannerPlugin 内置插件来实践插件的配置和运行，这个插件的作用是给输出的文件头部添加注释信息。

Webpack 本身内置了一些常用的插件，还可以通过 npm 安装第三方插件。

修改 webpack.config.js，添加 plugins：
```js
    var webpack = require('webpack')

    module.exports = {
      entry: './entry.js',
      output: {
        path: __dirname,
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          {test: /\.css$/, loader: 'style-loader!css-loader'}
        ]
      },
      plugins: [
        new webpack.BannerPlugin('This file is created by quwei')
      ]
    }
```
运行webpack,打开bundle.js,可以看到
```js
    /*! This file is created by quwei */
    /******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};
    //以后部分省略
```

### 开发环境
当项目逐渐变大，webpack 的编译时间会变长，可以通过参数让编译的输出内容带有进度和颜色。
```js
    webpack --progress --colors
```

如果不想每次修改模块后都重新编译，那么可以启动监听模式。开启监听模式后，没有变化的模块会在编译后缓存到内存中，而不会每次都被重新编译，所以监听模式的整体速度是很快的。
```js
    webpack --progress --colors --watch
```

当然，使用 webpack-dev-server 开发服务是一个更好的选择。它将在 localhost:8080启动一个express静态资源 web 服务器,并且会以监听模式自动运行 webpack,可以浏览项目中的页面和编译后的资源输出，并且通过一个 socket.io 服务实时监听它们的变化并自动刷新页面。

安装
$ npm install webpack-dev-server -g

运行
$ webpack-dev-server --progress --colors

#### 注意:
    当直接运行时,可能由于webpack-dev-server的版本过高可能是2.x以上的版本,和webpack无法匹配上,会出现Cannot find module 'webpack/bin/config-yargs'的情况。

所以需要直接卸载webpack-dev-server,npm uninstall webpack-dev-server -g,再安装一个低版本的npm uninstall webpack-dev-server -g例如：
    
    npm install webpack-dev-server@1.15.0 -g
    
使用http://localhost:8080/index.html对于js文件的变化是无法实时展现出来的,只能手动刷新后有效,可以使用以下方式自动刷新页面。

1. iframe 模式
    我们不访问 http://localhost:8080，而是访问http://localhost:8080/webpack-dev-server/index.html
2. inline 模式
    在命令行中指定该模式，webpack-dev-server --inline。这样http://localhost:8080/index.html 页面就会在 js 文件变化后自动刷新了。

通过这种监视到的是入口js以及它引用的资源,个人倾向于第二种方式


webpack中配置的打包的使用webpack的plugin, 压缩ES6代码可以按照以下的步骤:

### webpack打包ES6
首先，建立如下的目录：
```js
    /web根目录
    -es6
       main.js
       Person.js
    index.html
    webpack.config.js
```
 es6里面存放的ES6风格的代码,main.js作为入口文件,使用 babel 对 ES6 风格的代码进行转换，所以要安装babel-loader 加载器，在命令行输入如下命令：
 
```js
    npm install babel-preset-es2015 --sava-dev //安装转码规则
    npm install babel-loader --save-dev //安装 babel-loader
    
```
#### webpack配置文件
```js
    var webpack = require('webpack');
    var path = require('path');
    
    module.exports = {
      entry: "./es6/main.js",//入口文件
      output: {//打包输出的文件
        path: __dirname,
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          {
            test: path.join(__dirname, 'es6'),
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          }
        ]
      },
      resolve: {// 现在你require文件的时候可以直接使用require('file')，不用使用require('file.coffee')
        extensions: ['', '.js', '.json', '.coffee']
      }
    }
``` 
#### 有关代码
##### main.js
```js
    import Person from './Person.js';

    let p = new Person ('张三',20);
    document.write(p.say());
```
#### index.html
```js
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <title>Test</title>
    </head>
    <body>
        <script src="bundle.js"></script>
    </body>
    </html>
```
#### classPerson
```js
    class Person{ 
        constructor(name, age){ 
            this.name = name; 
            this.age = age; 
        } 
        say(){ 
            return `我是${this.name},我今年${this.age}岁了。`; 
        }
    }
    export default Person;
```

### 参考配置(7.18日)
```js
    var webpack = require('webpack');
    var path = require('path');
    
    module.exports = {
      entry:{
        main:'./main.js'//入口文件
      },
      output: {//打包输出的文件
        path: __dirname,
        //path: path.resolve(__dirname, 'build'),  //__dirname + '/build'
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          {
            test: path.join(__dirname,'es6'),
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          },
          {
            test: /\\.html/,
            loader:'html'
          },
          {
            test: /\\.scss/,
            loader:'style!css!sass',
            loaders:['style','css','sass']
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader','postcss-loader']
          },
          {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'img/[name]_[hash:7].[ext]'
            }
          },
          {
            test: /\.(png|jpg)$/, 
            loader: "url-loader?limit=8192"
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'fonts/[name].[hash:7].[ext]'
            }
          }
        ]
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress:{
            warnings: false,
            drop_debugger: true,
            drop_console: true
          }
        })
      ],
      resolve: {// 现在你require文件的时候可以直接使用require('file')，不用使用require('file.coffee')
        alias: {
          'vue$': 'vue/dist/vue.esm.js',
          '@': path.join(__dirname, 'src')
        },
        extensions: ['', '.js', '.json', '.coffee', '.vue', '.css']
      }
    };
```

这个配置文件一直都是可以正常工作的，昨日(7.17)突然出现
```js
    throw new Error("Element from loaders list should have one of the fields 'loader' or 'loaders'");
    ^
```
今天又突然好了...。

## 安装部署Vue开发环境

为了方便大型应用的开发，尤雨溪开发了Vue-cli脚手架，提供了一系列的工具和库，方便我们快速的进行开发，具体功能包括单文件 Vue 组件，热加载，保存时检查代码，单元测试等，本质上和Express的express-generator是一样的。

因为vue-cli依赖webpack,所以首先安装webpack这个工具:
```js
    npm install -g webpack
```

然后安装vue-cli:
```js
    npm install -g vue-cli
```

使用方法如下:
```js
    vue init webpack my-project
    cd my-project
    npm install
    npm run dev
```
执行完成后在浏览器中localhost:8080查看。

当然你可以用一个更加方便的方式进行安装，可以直接在package.json中，添加相应的依赖（如上面的代码），之后的命令行中运行npm intall，它会自动帮我们安装相应的依赖。

例如之前一直安装失败的vue，从node的反馈上来说是package文件中的依赖找不到vue，所以失败。尝试这样的方式安装。

```js
    "devDependencies": {
        "vue": "^2.4.1"
    },
```
写完之后再运行安装vue，此时就可以安装成功。

