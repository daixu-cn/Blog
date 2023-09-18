import { createRouter, createWebHistory } from "vue-router"
import NProgress from "nprogress"
import useUserStore from "@/store/user"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
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
    },
    {
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
          component: () =>
            import("@/views/Admin/Article/ArticleMD/ArticleMD.vue"),
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
        }
      ]
    },
    {
      path: "/loginFrame",
      name: "LoginFrame",
      component: () => import("@/views/User/Login/Frame.vue"),
      redirect: "/login",
      children: [
        {
          path: "/login",
          name: "Login",
          component: () => import("@/views/User/Login/Login.vue"),
          meta: {
            title: "登录"
          }
        },
        {
          path: "/forget",
          name: "Forget",
          component: () => import("@/views/User/Login/Forget.vue"),
          meta: {
            title: "忘记密码"
          }
        },
        {
          path: "/register",
          name: "Register",
          component: () => import("@/views/User/Login/Register.vue"),
          meta: {
            title: "注册"
          }
        }
      ]
    },
    {
      path: "/oauth",
      name: "OAuth",
      component: () => import("@/views/User/OAuth.vue"),
      meta: {
        title: "授权"
      }
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: () => import("@/views/Error/NotFound.vue"),
      meta: {
        title: "NotFound"
      }
    }
  ],
  scrollBehavior() {
    return { top: 0, left: 0 }
  }
})

router.beforeEach((to, _, next) => {
  if (!NProgress.isStarted()) {
    NProgress.start()
  }

  document.title = to.meta?.title
    ? `${to.meta?.title} -- DAIXU BLOG`
    : "DAIXU BLOG"

  // 判断进入的路由是否需要登录
  if (Number.isInteger(to.meta.role)) {
    const info = useUserStore()?.info

    // 管理员路由 || 普通用户路由
    if (
      (to.meta.role === 0 && info?.role === 0) ||
      (to.meta.role === 1 && info)
    ) {
      return next()
    }

    sessionStorage.setItem("redirect", to.path.toLocaleLowerCase())
    next({ name: "Login", replace: true })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
