import { createRouter, createWebHistory } from "vue-router"
import NProgress from "nprogress"

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
          component: () => import("@/views/Client/Article/Article/Article.vue")
        },
        {
          path: "/article/:articleId",
          name: "ArticleDetail",
          component: () => import("@/views/Client/Article/Detail/Detail.vue")
        },
        {
          path: "/community",
          name: "Community",
          component: () => import("@/views/Client/Community/Community.vue")
        },
        {
          path: "/links",
          name: "Links",
          component: () => import("@/views/Client/Links/Links.vue")
        },
        {
          path: "/magic",
          name: "Magic",
          component: () => import("@/views/Client/Magic/Magic.vue")
        },
        {
          path: "/updates",
          name: "Updates",
          component: () => import("@/views/Client/Updates/Updates.vue")
        },
        {
          path: "/account",
          name: "Account",
          component: () => import("@/views/Client/Account/Account.vue")
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
          component: () => import("@/views/User/Login/Login.vue")
        },
        {
          path: "/forget",
          name: "Forget",
          component: () => import("@/views/User/Login/Forget.vue")
        },
        {
          path: "/register",
          name: "Register",
          component: () => import("@/views/User/Login/Register.vue")
        }
      ]
    },
    {
      path: "/OAuth",
      name: "OAuth",
      component: () => import("@/views/User/OAuth.vue")
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: () => import("@/views/Error/NotFound.vue")
    }
  ]
})

router.beforeEach(() => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
