import { RouteRecordRaw } from "vue-router"

// 后台系统路由
const SystemRoutes: RouteRecordRaw = {
  path: "/system",
  name: "SystemFrame",
  component: () => import("@/views/Admin/Frame/Frame.vue"),
  redirect: "/system/article",
  meta: {
    role: 0
  },
  children: [
    {
      path: "/system/article",
      name: "SystemArticle",
      component: () => import("@/views/Admin/Article/Article.vue"),
      meta: {
        role: 0,
        title: "文章管理"
      }
    },
    {
      path: "/system/article/md/:articleId",
      name: "SystemArticleMD",
      component: () => import("@/views/Admin/Article/ArticleMD/ArticleMD.vue"),
      meta: {
        role: 0,
        title: "文章操作"
      }
    },
    {
      path: "/system/comments",
      name: "SystemComments",
      component: () => import("@/views/Admin/Comments/Comments.vue"),
      meta: {
        role: 0,
        title: "评论/回复管理"
      }
    },
    {
      path: "/system/links",
      name: "SystemLinks",
      component: () => import("@/views/Admin/Links/Links.vue"),
      meta: {
        role: 0,
        title: "友情链接管理"
      }
    },
    {
      path: "/system/users",
      name: "SystemUsers",
      component: () => import("@/views/Admin/Users/Users.vue"),
      meta: {
        role: 0,
        title: "用户管理"
      }
    },
    {
      path: "/system/updates",
      name: "SystemUpdates",
      component: () => import("@/views/Admin/Updates/Updates.vue"),
      meta: {
        role: 0,
        title: "更新管理"
      }
    },
    {
      path: "/system/files",
      name: "SystemFiles",
      component: () => import("@/views/Admin/Files/Files.vue"),
      meta: {
        role: 0,
        title: "更新管理"
      }
    }
  ]
}

export default SystemRoutes
