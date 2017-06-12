# 在Github上搭建hexo博客

> 约定$命令行在git bash中执行，其余的在cmd中执行。

## 前期的准备

 - git客户端
 - github账号
 - node.js
 - 创建仓库
 

> 在开始一定要注意node的环境变量和系统变量的配置问题，有了webpack配置的前车之鉴，当出现 `<command> 不是内部或外部命令也不是可运行的程序`时，首先想到的是环境变量的问题。如果没有设置，则不可以使用`npm`本地安装`node_modules`

建立仓库时注意，仓库的名字必须是**用户名.github.io**(注意是必须！)，接着配置SSH。

### 配置SSH

 1. 打开Git Bash终端：在桌面右键，会出现"Git Bash here"的选项，点击即可。
 2. 设置user name和email：
 
```js
   $ git config --global user.name "你的GitHub用户名"
   $ git config --global user.email "你的GitHub注册邮箱"
```

生成ssh密钥：
```js
   $ ssh-keygen -t rsa -C "你的GitHub注册邮箱"
```
生成的包括**id_rsa**和**id_rsa.pub**。**id_rsa文件是私钥**

#### 添加公钥到github：

头像 ---> setting ---> SSH and GPG keys选项 ---> New SSH key(新建SSH)，将id_rsa.pub中的内容复制到key文本框，再点击`Add SSH key(添加SSH)`

#### 测试SSH
```js
    $ ssh -T git@github.com
```
接下来会出来下面的确认信息：
```js
    The authenticity of host 'github.com (207.97.227.239)' can't be established. 
RSA key fingerprint is ....
 Are you sure you want to continue connecting (yes/no)?yes
 
 Hi Corbusier! You've successfully authenticated, 
but GitHub does not provide shell access.
```

## 博客本地仓库的创建
在本地创建Hexo(任意名字)，前提是环境变量已配置完成。
```js
    $ mkdir Hexo
    /*<--!进入Hexo文件夹 -- !>*/
    $ cd blog 
```

## 本地安装hexo
1. hexo全局安装

```js
    $ npm install hexo-cli -g
```

2. 初始化hexo

```js
    $ hexo init
```

3. 安装依赖

```js
    $ npm install
```

4. 启动hexo

```js
    $ hexo server
```
启动之后，打开浏览器，在地址栏输入：http://localhost:4000，你会看到Hexo的示例页面。

## 测试hexo
1. 新建文章

```js
    $ hexo new <title>
```
此时在source_posts文件夹中便会多出一个文档"title.md".
如果要删除，直接在此文件夹下删除对应的文件即可。

2. 生成静态页面

```js
    $ hexo generate
```

3. 清除生成内容

```js
    $ hexo clean
```
执行此操作会删除public文件夹中的内容。

4. 部署hexo

```js
    $ hexo deploy
```
该操作会将hexo生成的静态内容部署到配置的仓库中

## 部署hexo
1. 编辑配置文件，关联远程仓库：
在编辑器中打开Hexo配置文件_config.yml，找到下面内容并修改：

```js
# Deployment
## Docs: https://hexo.io/docs/deployment.html
    deploy:
      type: git
      repo: git@github.com:Corbusier/Corbusier.github.io.git #github仓库地址
      branch: master # github分支
```

> 注意：type、repo、branch的前面有两个空格，后面的:后面有一个空格

安装git插件：
```js
    npm install hexo-deployer-git --save
```

> 如果没有安装git插件，会有错误提示，安装后重新部署就可以了。

部署：
```js
    $ hexo deploy
```
现在，可以使用` http://<用户名>.github.io`查看你的博客了。

## hexo常用参数设置
### 配置文件说明

网站配置文件是在根目录下的_config.yml(站点配置文件)文件，是yaml格式的。
所有的配置项后面的冒号（:）与值之间要有一个空格。

> 这个配置文件很长，但是需要修改的只有几项

```js
    # Hexo Configuration
    ## Docs: https://hexo.io/docs/configuration.html
    ## Source: https://github.com/hexojs/hexo/
    
    # Site 网站信息
    title: 网站标题
    subtitle: 网站副标题
    description: 网站描述
    author: 网站作者名字
    language: #网站语言,默认是英语(en)
    timezone: #网站时区
    
    # URL 网站设置
    ## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
    url: corbusier.github.io #网站的地址
    root: / #网站的根目录，如果是子文件夹下，则填写子文件夹路径
    permalink: :year/:month/:day/:title/ #文章链接地址格式 
    permalink_defaults: 
    
    # Directory 目录设置
    source_dir: source #资源文件夹，默认是source
    public_dir: public #公共文件夹，默认是public
    tag_dir: tags #标签文件夹，默认是tags
    archive_dir: archives #档案文件夹，默认是archives
    category_dir: categories #分类文件夹，默认是categories
    code_dir: downloads/code #代码文件夹，默认是downloads/code
    i18n_dir: :lang #国际化文件夹，默认跟language相同
    skip_render: [] #不需要渲染的文件夹或文件夹,放在[]中
    
    # Writing 文章写作选项
    new_post_name: :title.md # File name of new posts
    default_layout: post #默认布局模板
    titlecase: false # Transform title into titlecase
    external_link: true # Open external links in new tab
    filename_case: 0
    render_drafts: false
    post_asset_folder: false
    relative_link: false
    future: true
    highlight: #高亮显示
      enable: true #默认开启
      line_number: true #显示行号，默认开启
      auto_detect: false
      tab_replace:
    
    # Category & Tag 分类和标签
    default_category: uncategorized #默认分类名称
    category_map:
    tag_map:
    
    # Date / Time format #日期/时间格式
    ## Hexo uses Moment.js to parse and display date
    ## You can customize the date format as defined in
    ## http://momentjs.com/docs/#/displaying/format/
    date_format: YYYY-MM-DD #日期格式
    time_format: HH:mm:ss #时间格式
    
    # Pagination #分页信息
    ## Set per_page to 0 to disable pagination
    per_page: 10 #每页显示数量，设置为0表示不启用分页
    pagination_dir: page #分页文件夹名称
    
    # Extensions 扩展
    ## Plugins: https://hexo.io/plugins/ #插件
    plugins:
      hexo-generator-feed #RSS订阅插件
      hexo-generator-sitemap  #sitemap插件
    
    ## Themes: https://hexo.io/themes/ #主题
    theme: landscape #主体名称
    
    # Deployment 部署
    ## Docs: https://hexo.io/docs/deployment.html
    deploy:
      type: git
      repo: git@github.com:Corbusier/Corbusier.github.io.git #github仓库地址
      branch: master # github分支
```

### 常用插件
如果是扩展插件，要在_config.yml配置文件中添加插件信息，是plugins配置项。
比如下面的两个插件：

```js
    plugins:
      hexo-generator-feed #RSS订阅插件
      hexo-generator-sitemap  #sitemap插件
```
安装插件，后面要加上--save，表示依赖项。
* RSS订阅插件
  hexo-generator-feed：生成rss订阅文件

```js
    npm install hexo-generator-feed --save
```
添加配置信息

```js
    #sitemap
    sitemap:
      path: sitemap.xml      
```

* SiteMap插件
  hexo-generator-sitemap：生成易于搜索引擎搜素的网站地图

```js
    npm install hexo-generator-sitemap --save
```

添加配置信息：

```js
    #feed
    atom:
      type: atom
      path: atom.xml
      limit: 20
```

可以在主题配置文件中添加相关配置，可以在页面上显示。比如，添加链接信息

```js
    links:
      Feed: /atom.xml
      SiteMap: /sitemap.xml
```

* Git插件
  hexo-deployer-git：使用git同步代码到git仓库中

```js
    npm install hexo-deployer-git --save
```

## 主题

默认的主题是**landscape**
官方主题地址：[thems](https://hexo.io/themes/)

### 切换主题
我是用的是`next`，以此为例：

```js
    $ git clone https://github.com/iissnan/hexo-theme-next themes/next
```
在站点配置文件`_config.yml`文件中修改主题配置，比如修改theme: landscape为theme: next；

除了之前的主题`git clone`和修改站点配置文件外，还需要以下的操作：
```js
    hexo clean
    hexo generate
    hexo deploy
```
再打开网页，之前丑陋的landscape主题就被替换了。

更为详细的设置：[NexT主题](http://theme-next.iissnan.com/getting-started.html)
  
  
## 使用travis部署hexo
现在博客基本可以运行了，但是如果需要多个电脑之间推送会不太方便。hexo使用的部署命令只是把静态文件上传到仓库中，在其他电脑同步下的只是静态文件而非源码。所以使用自动部署非常有必要。介绍使用`Travis CI`持续集成并部署。

### 配置多个SSH

 - 生成ssh密钥
  可以使用全局的ssh密钥，不过建议使用单独的ssh密钥，在这里以单独ssh密钥为例。

```js
    $ #切换到.ssh文件下
    $ cd ~/.ssh
    $ #生成密钥，后面换成自己的github邮箱
    $ ssh-keygen -t rsa -C "SeayXu@163.com"
```

输入上面命令后回车一下，当提示Enter file in which to save the key (/c/Users/Seay/.ssh/id_rsa):时，输入新的ssh密钥文件路径和文件名(不能是.ssh/id_rsa)，这里输入id_rsa_blog，然后一路回车。

 - 添加ssh到github
 
登录到github中，点击进入到博客仓库。点击右上方的Settings进入到设置页面，点击左边的Deploy keys项。
在右上点击Add deploy key，然后在下面输入标题，把生成的密钥id_rsa_blog.pub里面的内容复制到key文本框中，选中下面的Allow write access，最后点击Add key。
 

 - 新建配置文件
在.ssh文件夹中创建一个名为config的配置文件。
```js
    $ touch config
```

 - 编辑配置信息
用编辑器打开config文件，添加如下信息：

```js
    # github
    Host github.com
        HostName github.com
        PreferredAuthentications publickey
        IdentityFile ~/.ssh/id_rsa
    # 这里是空行
    # github_blog
    Host github.com
        HostName github.com
        PreferredAuthentications publickey
        IdentityFile ~/.ssh/id_rsa_blog
```

提示：`这里的密钥文件路径根据自己的做相应修改。`

### 配置Travis

 - 接入Travis
 打开[Travis CI](https://travis-ci.org/)，使用github账号登陆。

将鼠标放在右上角的用户名上，点击Account选项，会显示github的项目。
找到博客项目，点击前面带有 X 符号的按钮，开启travis支持。

 - 安装travis
 Travis安装需要Ruby环境，所有需要安装Ruby,并且需要安装rubygems插件。
> 假设已经安装了Ruby！

```js
    # 安装travis
    gem install travis
```

 - 新建配置文件
 首先打开博客项目文件夹，在项目根目录新建.travis.yml配置文件。

```js
    /*<--! cd 博客项目文件夹根目录 !--> */
    $ touch .travis.yml
```
- 复制ssh私钥
在项目根目录创建文件夹.travis

```js
    $ mkdir .travis
```

将开始生成的ssh密钥文件id_rsa_bolg复制到.travis文件夹下：

```js
    /* 注意文件路径 */
    cp ~/.ssh/id_rsa_blog .travis/
```

- ssh配置文件
这个ssh配置文件是用于在部署机器上使用的，不是本地的ssh配置文件，后面的travis配置文件会用到。

在.travis文件夹中新建文件ssh_config
```js
    touch .travis/ssh_config
```

编辑配置文件，添加如下内容：

```js
    Host github.com
    User git
    StrictHostKeyChecking no
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
```

 - 登陆travis
 
```js
    travis login --auto
```
根据提示输入github的用户名和密码。

 - 加密操作
 
 在这一步使用了其他的方法，也许是win7的电脑不一样，使用了另一种方法，第一种方法参考：[常用配置方法](http://www.jianshu.com/p/7f05b452fd3a)。

当使用travis 加密操作时，`travis encrypt 'REPO_TOKEN=<TOKEN>' --add`

得到的反馈是：

`Can't figure out GitHub repo name. Ensure you're in the repo directory, or speci
fy the repo name via the -r option (e.g. travis <command> -r <owner>/<repo>)`

按照错误提示重新加密：

`travis encrypt -r Corbusier/Corbusier.github.io GH_Token=XXX`可以在CMD中得到形如：

```js
    env:
      global:
        - GH_REF: github.com/iissnan/theme-next-docs.git
        - secure: "XXXXXX"
```
将其复制到`.travis.yml`配置文件中使用。
完整配置文件的参考：[travis配置文件](https://github.com/Corbusier/Corbusier.github.io/blob/dev/.travis.yml)

### 本地提交操作
配置完成后需要本地提交，删除原先产生的`.git`文件夹，执行初始化操作：

`$ git init`

关联远程仓库
```js
    $ # 将github仓库改为自己的
    $ git remote add origin git@github.com:Corbusier/Corbusier.github.io.git
```

* 推送仓库提交本地修改，推送至github仓库。

```js
    $ # 添加文件
    $ git add .
    $ # 提交修改
    $ git commit -m "test travis"
    $ # 推送至远程仓库
    $ git push -u origin dev
```

推送至`dev`分支时，需要先查看git分支，然后创建`dev`分支后才能推送成功，附git基础命令：
[git基础命令](http://www.cnblogs.com/newpanderking/p/4005698.html)

push本地的代码至远程仓库之后，在https://travis-ci.org后台查看相关情况。
下面是成功的结果：
> ！！！之后用图取代链接
[travis](https://travis-ci.org/Corbusier/Corbusier.github.io)

以上就是自动部署Hexo的另一方法。

## 附录
### hexo常用命令

```js
hexo help #查看帮助
    hexo init #初始化一个目录
    hexo new "postName" #新建文章
    hexo new page "pageName" #新建页面
    hexo generate #生成网页，可以在 public 目录查看整个网站的文件
    hexo server #本地预览，'Ctrl+C'关闭
    hexo deploy #部署.deploy目录
    hexo clean #清除缓存，强烈建议每次执行命令前先清理缓存，每次部署前先删除 .deploy 文件夹
    
    简写：
    hexo n == hexo new
    hexo g == hexo generate
    hexo s == hexo server
    hexo d == hexo deploy
    
    hexo命令组合：
    hexo clean && hexo g -s，就是清除、生成、启动hexo clean && hexo g -d，就是清除、生成、部署
    
```