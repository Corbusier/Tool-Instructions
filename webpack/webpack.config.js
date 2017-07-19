var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry:{
    main:'./src/main.js'//入口文件
  },
  output: {//打包输出的文件
    path: __dirname,
    //path: path.resolve(__dirname, 'build'),  //__dirname + '/build'
    filename: 'bundle.js',
    //公共文件生成的地址
    publicPath: '/dist/'
  },
  // 服务器配置相关，自动刷新!
  devServer: {
    historyApiFallback: true,
    hot: false,
    inline: true,
    progress: true,
  },
  module: {
    rules: [
      // 解析.vue文件
      { 
        test: /\.vue$/, 
        loader: 'vue-loader',
        options: {
          loaders: {
          // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
          // the "scss" and "sass" values for the lang attribute to the right configs here.
          // other preprocessors should work out of the box, no loader config like this necessary.
          'scss': 'vue-style-loader!css-loader!sass-loader',
          'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      // 转化ES6的语法
      { 
        test: /\.js$/, 
        loader: 'babel-loader', 
        exclude: /node_modules/,
        query: {
            babelrc:false,
            presets: ['es2015']
        }
      },
      {
        test: /\\.html/,
        loader:'html'
      },
      {
        test: /\.scss$/, 
        loader: 'style!css!sass?sourceMap'
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
      },
      //html模板编译？
      { 
        test: /\.(html|tpl)$/, 
        loader: 'html-loader' 
      },
    ]
  },
  // // 转化成es5的语法
  // babel: {
  //   presets: ['es2015'],
  //   plugins: ['transform-runtime']
  // },
  resolve: {
    // require时省略的扩展名，如：require('module') 不需要module.js
    extensions: ['.js', '.vue'],
    // 别名，可以直接使用别名来代表设定的路径以及其他
    alias: {
        filter: path.join(__dirname, './src/filters'),
        components: path.join(__dirname, './src/components')
    }
  },
  // 开启source-map，webpack有多种source-map，在官网文档可以查到
  devtool: 'eval-source-map'
};