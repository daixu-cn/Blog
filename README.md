### 运行环境

- NodeJS版本：v18.16.0
- NPM版本：V9.5.1

`Node 版本最好跟我一样的，太高或者太低的话不知道会不会有啥问题。`

### 项目指令

```shell
# 安装依赖
npm install

# 启动项目
npm run start

# 打包项目
npm run build

# 对所有文件进行代码格式化
npm run prettier

# Git提交使用下面的指令，否则直接使用 git commit -m "xxx" 会提交失败的
npm run commit
```

### 工程目录

```shell
BLOG
├── public
│   └── favicon.ico #站点Icon
├── src             #项目主目录
│   ├── assets      #静态资源
│   │   ├── image   #图片
│   │   │   ├── avatar.png
│   │   │   └── mobileBg.png
│   │   └── style   #样式
│   │       └── scss
│   │           ├── theme   #主题文件
│   │           │   ├── clear-spring-green.module.scss  #清泉翠
│   │           │   └── ethereal-orchid-purple.module.scss  #薰衣草紫
│   │           ├── _mixins.scss        #全局混入
│   │           ├── _variables.scss     #全局变量
│   │           ├── elementPlus.scss    #全局 Element-plus 样式
│   │           ├── global.scss         #全局样式入口文件
│   │           ├── nprogress.scss      #进度条样式
│   │           └── reset.scss          #统一默认样式
│   ├── components  #公用组建
│   │   ├── Comment
│   │   │   ├── Comment.vue     #评论组建
│   │   │   └── ReplyDialog.vue #回复组建
│   │   ├── EditableInput.vue   #可控输入框组建
│   │   ├── Icon.vue            #全局SVG组建
│   │   ├── ImageViewer.vue     #图片预览组建
│   │   ├── Loading.vue         #Loading组建
│   │   ├── MdEditor.vue        #Markdown组建
│   │   └── Player.vue          #视频播放器组建
│   ├── global
│   │   ├── env.ts      #全局变量
│   │   ├── menus.ts    #菜单配置文件
│   │   ├── select.ts   #下拉框选项文件
│   │   └── theme.ts    #主题文件
│   ├── router
│   │   └── index.ts    #路由配置
│   ├── server  #Axios封装
│   │   ├── http
│   │   │   ├── ErrorStatus.ts      #错误状态码
│   │   │   ├── index.ts            #Class类
│   │   │   └── responseFormat.ts   #响应状态码格式化
│   │   └── index.ts    #请求实例-用的时候只要引入这一个文件即可
│   ├── store   #Pinia 全局数据管理
│   │   ├── theme.ts    #主题数据
│   │   └── user.ts     #用户数据
│   ├── types   #全局类型定义
│   │   ├── global.d.ts
│   │   └── router.d.ts
│   ├── utils   #工具类
│   │   ├── resumeUpload.ts #文件断点续传
│   │   └── util.ts #普通工具函数
│   ├── views #主页面
│   │   ├── Admin   #管理员页面
│   │   │   ├── Article
│   │   │   │   ├── ArticleMD
│   │   │   │   │   └── ArticleMD.vue   #文章创建/编辑
│   │   │   │   └── Article.vue #文章管理
│   │   │   ├── Comments
│   │   │   │   └── Comments.vue    #评论/回复管理
│   │   │   ├── Frame
│   │   │   │   ├── Header
│   │   │   │   │   └── Header.vue  #导航栏
│   │   │   │   ├── Menu
│   │   │   │   │   └── Menu.vue    #菜单
│   │   │   │   └── Frame.vue       #后台主框架
│   │   │   ├── Links
│   │   │   │   ├── ActionDialog.vue    #友情链接编辑
│   │   │   │   └── Links.vue   #友情链接管理
│   │   │   ├── Updates
│   │   │   │   ├── ActionDialog.vue    #站点动态创建/编辑
│   │   │   │   └── Updates.vue #站点动态管理
│   │   │   └── Users
│   │   │       └── Users.vue   #用户管理
│   │   ├── Client #普通页面（不需要登录授权）
│   │   │   ├── Account
│   │   │   │   ├── Account.vue #账户中心页面
│   │   │   │   └── EmailChangeDialog.vue   #邮箱修改弹窗
│   │   │   ├── Article
│   │   │   │   ├── Article
│   │   │   │   │   └── Article.vue #文章首页
│   │   │   │   └── Detail
│   │   │   │       └── Detail.vue #文章详情
│   │   │   ├── Community
│   │   │   │   └── Community.vue #互动社区
│   │   │   ├── Creations
│   │   │   │   └── Creations.vue   #创意空间
│   │   │   ├── Frame   #主框架
│   │   │   │   ├── Header  #导航栏
│   │   │   │   │   ├── FullScreen.vue
│   │   │   │   │   ├── Header.vue
│   │   │   │   │   ├── Menu.vue
│   │   │   │   │   ├── Mode.vue
│   │   │   │   │   ├── NavMobile.vue
│   │   │   │   │   ├── Search.vue
│   │   │   │   │   ├── SearchModal.vue
│   │   │   │   │   ├── Theme.vue
│   │   │   │   │   └── User.vue
│   │   │   │   └── Frame.vue
│   │   │   ├── Links   #友情链接
│   │   │   │   ├── ApplyDialog.vue
│   │   │   │   └── Links.vue
│   │   │   └── Updates #站点动态
│   │   │       └── Updates.vue
│   │   ├── Error
│   │   │   └── NotFound.vue    #404页面
│   │   ├── External #存放创意空间项目的配置文件（目前一个都没有）
│   │   └── User
│   │       ├── Login #登录相关页面
│   │       │   ├── Forget.vue
│   │       │   ├── Frame.vue
│   │       │   ├── Login.vue
│   │       │   └── Register.vue
│   │       └── OAuth.vue #授权登录页
│   ├── App.vue #vue根文件
│   └── main.ts #项目入口文件
├── .cz-config.js       #git提交信息配置
├── .env.development    #开发环境全局变量
├── .env.production     #生产环境全局变量
├── .eslintignore       #eslint配置
├── .eslintrc.js        #eslint忽略文件
├── .gitignore          #git忽略文件
├── .prettierignore     #prettier忽略文件
├── .prettierrc         #prettier配置文件
├── README.md
├── commitlint.config.js    #git提交类型配置
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### 全局环境变量修改

根目录下面找到`.env.development`、`.env.production`这两个文件根据对应的注释修改成你自己的数据。

| 变量                            | 描述                           |
| ------------------------------- | ------------------------------ |
| VITE_APP_BASE_API               | 请求的接口地址                 |
| VITE_APP_DEFAULE_THEME          | 默认主题（写主题文件名）       |
| VITE_APP_OAUTH_REDIRECT         | 第三方授权登录之后的重定向地址 |
| VITE_APP_OAUTH_QQ_CLIENT_ID     | QQ--client_id                  |
| VITE_APP_OAUTH_GITHUB_CLIENT_ID | GitHub--client_id              |
| VITE_APP_OAUTH_GOOGLE_CLIENT_ID | Google--client_id              |

第三方授权登录这个就稍微麻烦点了，这个项目配置了`QQ、GitHub、Google`三种的授权方式,你需要去这三个平台的开发后台去独立的申请对应的 `client_id` 和配置重定向地址，申请之后找到 `.env.development`、`.env.production` 文件，将对应的 `client_id` 变量替换成你自己申请的，否则授权之后的结果肯定是失败的。

> 注意，这三种授权方式各有缺点，可以根据你自己的条件更换成其他的：
> QQ：你的域名必须备案
> GitHub：国内服务器有时候很卡，请求接口一直超时
> Google：国内服务器完全无法使用，除非你买的是海外服务器

### 主题修改

第一步：主题存放在：`/src/assets/style/scss/theme/xxx.scss`，你如果需要新增主题只需要复制一份原有主题文件，在复制文件内进行修改即可。

第二步：找到`/src/global/theme.ts`文件，修改`ThemeType`和`themes`。

举个例子，你需要新增一个红色主题，那么你就需要先将原有的主题文件复制一份在同目录下然后重命名 `red.scss`,然后找到`/src/global/theme.ts`文件进行对应修改：

```typescript
// 主题文件
export type ThemeType = "clear-spring-green" | "ethereal-orchid-purple" ｜ "red"

// 主题数组
const themes: Theme[] = [
  {
    // 颜色中文标题
    title: "清泉翠",
    // 主题的文件名
    theme: "clear-spring-green",
    // 主题颜色
    color: "#45d6bb"
  },
  {
    title: "薰衣草紫",
    theme: "ethereal-orchid-purple",
    color: "#9191fe"
  },
  {
    title: "我是新增的红色",
    theme: "red",
    color: "#ff0000"
  }
]
```
