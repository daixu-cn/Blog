import {
  Notebook,
  ChatDotSquare,
  Discount,
  User,
  Setting,
  House,
  Files
} from "@element-plus/icons-vue"

export const adminMenus = [
  {
    path: "/system/article",
    name: "文章管理",
    icon: Notebook
  },
  {
    path: "/system/comments",
    name: "评论/回复",
    icon: ChatDotSquare
  },
  {
    path: "/system/links",
    name: "友情链接",
    icon: Discount
  },
  {
    path: "/system/users",
    name: "用户管理",
    icon: User
  },
  {
    path: "/system/updates",
    name: "更新管理",
    icon: Setting
  },
  {
    path: "/system/files",
    name: "文件管理",
    icon: Files
  },
  {
    path: "/",
    name: "返回首页",
    icon: House
  }
]

export default [
  {
    path: "/article",
    name: "首页"
  },
  {
    path: "/community",
    name: "互动社区"
  },
  {
    path: "/links",
    name: "友情链接"
  },
  {
    path: "/creations",
    name: "创意空间"
  },
  {
    path: "/updates",
    name: "站点动态"
  }
]
