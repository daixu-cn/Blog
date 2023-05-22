import {
  Notebook,
  ChatDotSquare,
  Discount,
  User,
  House
} from "@element-plus/icons-vue"

export const adminMenus = [
  {
    path: "/system/article",
    name: "menu.system.article",
    icon: Notebook
  },
  {
    path: "/system/comments",
    name: "menu.system.comments",
    icon: ChatDotSquare
  },
  {
    path: "/system/links",
    name: "menu.system.links",
    icon: Discount
  },
  {
    path: "/system/users",
    name: "menu.system.users",
    icon: User
  },
  {
    path: "/",
    name: "menu.article",
    icon: House
  }
]

export default [
  {
    path: "/article",
    name: "menu.article"
  },
  {
    path: "/community",
    name: "menu.community"
  },
  {
    path: "/links",
    name: "menu.links"
  },
  {
    path: "/magic",
    name: "menu.magic"
  },
  {
    path: "/updates",
    name: "menu.updates"
  }
]
