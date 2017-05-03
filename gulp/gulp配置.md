# gulp配置


gulp是新一代的前端项目构建工具，你可以使用gulp及其插件对你的项目代码（less,sass）进行编译，还可以压缩你的js和css代码，甚至压缩你的图片，gulp仅有少量的API，所以非常容易学习。

### gulp安装命令
```
    npm install -g gulp
```
在根目录下新建package.json文件
```
    npm init .
```
### 安装gulp包
```
    npm install gulp --save-dev  
``` 
### 安装插件:
```
    sass的编译                  （gulp-ruby-sass）
    自动添加css前缀              （gulp-autoprefixer）
    压缩css                    （gulp-minify-css）
    js代码校验                  （gulp-jshint）
    合并js文件                  （gulp-concat）
    压缩js代码                  （gulp-uglify）
    压缩图片                    （gulp-imagemin）
    自动刷新页面                 （gulp-livereload）
    图片缓存，只有图片替换了才压缩  （gulp-cache）
    更改提醒                    （gulp-notify）
    清除文件                    （del）
```

```
安装插件命令:
    npm install --save-dev gulp-load-plugins
```

安装以上的插件:
```
     npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
```

-save和-save-dev可以省掉你手动修改package.json文件的步骤。
```
    npm install module-name -save //自动把模块和版本号添加到dependencies部分
    npm install module-name -save-dev //自动把模块和版本号添加到devdependencies部分
```


### gulp命令
```
    gulp.task(name[, deps], fn) //定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数

    gulp.run(tasks...)：//尽可能多的并行运行多个task
    
    gulp.watch(glob, fn)：//当glob内容发生改变时，执行fn
    
    gulp.src(glob)：//置需要处理的文件的路径，可以是多个文件以数组的形式，也可以是正则
    
    gulp.dest(path[, options])：//设置生成文件的路径
```

### 完整的配置文件
```
    var gulp = require('gulp')
    var less = require('gulp-less')
    var sass = require('gulp-ruby-sass')
    var gutil = require('gulp-util')
    var uglify = require('gulp-uglify')
    var concat = require('gulp-concat');
    var imagemin = require('gulp-imagemin')
    var combiner = require('stream-combiner2')
    var minifyJS = require('gulp-minify');
    var minifycss = require('gulp-minify-css')
    var watchPath = require('gulp-watch-path')
    var sourcemaps = require('gulp-sourcemaps')
    var autoprefixer = require('gulp-autoprefixer')
    
    var handlebars = require('gulp-handlebars');
    var wrap = require('gulp-wrap');
    var declare = require('gulp-declare');
    
    var handleError = function (err) {
        var colors = gutil.colors;
        console.log('\n')
        gutil.log(colors.red('Error!'))
        gutil.log('fileName: ' + colors.red(err.fileName))
        gutil.log('lineNumber: ' + colors.red(err.lineNumber))
        gutil.log('message: ' + err.message)
        gutil.log('plugin: ' + colors.yellow(err.plugin))
    }
    gulp.task('default', function () {
        gutil.log('message')
        gutil.log(gutil.colors.red('error'))
        gutil.log(gutil.colors.green('message:') + "some")
    })
    gulp.task('default', function () {
        gulp.watch('src/js/**/*.js', ['uglifyjs'])
    })
    //编译JS文件,不能编译ES6,需要webpack的babel-loader 加载器,
    //配置文件见webpack
    gulp.task('concat', function() {
        return gulp.src('app/**/*.js')
            .pipe(minifyJS())
            .pipe(concat('bundle.min.js'))
            .pipe(uglify({ mangle: false }))
            .pipe(gulp.dest('./dist/'));
    });
    //一次编译所有js文件
    gulp.task('uglifyjs', function () {
        var combined = combiner.obj([
            gulp.src('src/js/**/*.js'),
            sourcemaps.init(),
            uglify(),
            sourcemaps.write('./'),
            gulp.dest('dist/js/')
        ])
        combined.on('error', handleError)
    })
    //一次编译所有css文件
    gulp.task('minifycss', function () {
        gulp.src('src/css/**/*.css')
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
              browsers: 'last 2 versions'
            }))
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/css/'))
    })
    //一次编译less
    gulp.task('lesscss', function () {
        var combined = combiner.obj([
                gulp.src('src/less/**/*.less'),
                sourcemaps.init(),
                autoprefixer({
                  browsers: 'last 2 versions'
                }),
                less(),
                minifycss(),
                sourcemaps.write('./'),
                gulp.dest('dist/css/')
            ])
        combined.on('error', handleError)
    })
    //一次编译Sass
    gulp.task('watchsass',function () {
        gulp.watch('src/sass/**/*', function (event) {
            var paths = watchPath(event, 'src/sass/', 'dist/css/')
    
            gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
            gutil.log('Dist ' + paths.distPath)
            sass(paths.srcPath)
                .on('error', function (err) {
                    console.error('Error!', err.message);
                })
                .pipe(sourcemaps.init())
                .pipe(minifycss())
                .pipe(autoprefixer({
                  browsers: 'last 2 versions'
                }))
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(paths.distDir))
        })
    })
    //一次编译image
    gulp.task('watchimage', function () {
        gulp.watch('src/images/**/*', function (event) {
            var paths = watchPath(event,'src/','dist/')
    
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
            gutil.log('Dist ' + paths.distPath)
    
            gulp.src(paths.srcPath)
                .pipe(imagemin({
                    progressive: true
                }))
                .pipe(gulp.dest(paths.distDir))
        })
    })
    //一次文件复制任务
    gulp.task('copy', function () {
        gulp.src('src/fonts/**/*')
            .pipe(gulp.dest('dist/fonts/'))
    })
    //编译js
    gulp.task('watchjs', function () {
        gulp.watch('src/js/**/*.js', function (event) {
            var paths = watchPath(event, 'src/', 'dist/')
            /*
            paths
                { srcPath: 'src/js/log.js',
                  srcDir: 'src/js/',
                  distPath: 'dist/js/log.js',
                  distDir: 'dist/js/',
                  srcFilename: 'log.js',
                  distFilename: 'log.js' }
            */
            gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
            gutil.log('Dist ' + paths.distPath)
    
            var combined = combiner.obj([
                gulp.src(paths.srcPath),
                sourcemaps.init(),
                uglify(),
                sourcemaps.write('./'),
                gulp.dest(paths.distDir)
            ])
    
            combined.on('error', handleError)
        })
    })
    //编译less
    gulp.task('watchless', function () {
        gulp.watch('src/less/**/*.less', function (event) {
            var paths = watchPath(event, 'src/less/', 'dist/css/')
    
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
            gutil.log('Dist ' + paths.distPath)
            var combined = combiner.obj([
                gulp.src(paths.srcPath),
                sourcemaps.init(),
                autoprefixer({
                  browsers: 'last 2 versions'
                }),
                less(),
                minifycss(),
                sourcemaps.write('./'),
                gulp.dest(paths.distDir)
            ])
            combined.on('error', handleError)
        })
    })
    
    //编译css
    gulp.task('watchcss', function () {
        gulp.watch('src/css/**/*.css', function (event) {
            var paths = watchPath(event, 'src/', 'dist/')
    
            gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
            gutil.log('Dist ' + paths.distPath)
    
            gulp.src(paths.srcPath)
                .pipe(sourcemaps.init())
                .pipe(autoprefixer({
                  browsers: 'last 2 versions'
                }))
                .pipe(minifycss())
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(paths.distDir))
        })
    })
    //编译Sass
    gulp.task('sasscss', function () {
            sass('src/sass/')
            .on('error', function (err) {
                console.error('Error!', err.message);
            })
            .pipe(sourcemaps.init())
            .pipe(minifycss())
            .pipe(autoprefixer({
              browsers: 'last 2 versions'
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/css'))
    })
    //编译img
    gulp.task('image', function () {
        gulp.src('src/images/**/*')
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest('dist/images'))
    })
    //文件复制任务 赋值src/fonts文件到dist中
    gulp.task('watchcopy', function () {
        gulp.watch('src/fonts/**/*', function (event) {
            var paths = watchPath(event)
    
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
            gutil.log('Dist ' + paths.distPath)
    
            gulp.src(paths.srcPath)
                .pipe(gulp.dest(paths.distDir))
        })
    })
    gulp.task('watchtemplates', function () {
        gulp.watch('src/templates/**/*', function (event) {
            var paths = watchPath(event, 'src/', 'dist/')
    
            gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
            gutil.log('Dist ' + paths.distPath)
    
            var combined = combiner.obj([
                gulp.src(paths.srcPath),
                handlebars({
                  // 3.0.1
                  handlebars: require('handlebars')
                }),
                wrap('Handlebars.template(<%= contents %>)'),
                declare({
                  namespace: 'S.templates',
                  noRedeclare: true
                }),
                gulp.dest(paths.distDir)
            ])
            combined.on('error', handleError)
        })
    })
    
    gulp.task('templates', function () {
            gulp.src('src/templates/**/*')
            .pipe(handlebars({
              // 3.0.1
              handlebars: require('handlebars')
            }))
            .pipe(wrap('Handlebars.template(<%= contents %>)'))
            .pipe(declare({
              namespace: 'S.templates',
              noRedeclare: true
            }))
            .pipe(gulp.dest('dist/templates'))
    })
    
    //gulp.task('default', ['watchjs', 'watchcss', 'watchless', 'watchsass', 'watchimage', 'watchcopy'])
    gulp.task('default', [
        // build
        'uglifyjs', 'minifycss', 'lesscss', 'sasscss', 'image', 'copy', 'templates','concat',
        // watch
        'watchjs', 'watchcss', 'watchless', 'watchsass', 'watchimage', 'watchcopy', 'watchtemplates'
        ]
)
```

-----------------------------  2017.5.2  -----------------------------