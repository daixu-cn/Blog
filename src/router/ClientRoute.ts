import { RouteRecordRaw } from "vue-router"

// 客户端路由
const ClientRoute: RouteRecordRaw = {
  path: "/",
  name: "Frame",
  component: () => import("@/views/Client/Frame/Frame.vue"),
  redirect: "/article",
  children: [
    {
      path: "/article",
      name: "Article",
      component: () => import("@/views/Client/Article/Article/Article.vue"),
      meta: {
        title: "首页"
      }
    },
    {
      path: "/article/:articleId",
      name: "ArticleDetail",
      component: () => import("@/views/Client/Article/Detail/Detail.vue")
    },
    {
      path: "/community",
      name: "Community",
      component: () => import("@/views/Client/Community/Community.vue"),
      meta: {
        title: "互动社区"
      }
    },
    {
      path: "/links",
      name: "Links",
      component: () => import("@/views/Client/Links/Links.vue"),
      meta: {
        title: "友情链接"
      }
    },
    {
      path: "/creations",
      name: "Creations",
      component: () => import("@/views/Client/Creations/Creations.vue"),
      meta: {
        title: "创意空间"
      }
    },
    {
      path: "/updates",
      name: "Updates",
      component: () => import("@/views/Client/Updates/Updates.vue"),
      meta: {
        title: "站点动态"
      }
    },
    {
      path: "/account",
      name: "Account",
      component: () => import("@/views/Client/Account/Account.vue"),
      meta: {
        role: 1,
        title: "账户中心"
      }
    }
  ]
}

export default ClientRoute
