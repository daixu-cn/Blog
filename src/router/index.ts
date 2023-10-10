import { createRouter, createWebHistory } from "vue-router"
import NProgress from "nprogress"
import useUserStore from "@/store/user"

import ClientRoute from "./ClientRoute"
import SystemRoutes from "./SystemRoutes"
import LoginRoutes from "./LoginRoutes"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ClientRoute,
    SystemRoutes,
    LoginRoutes,
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

// 路由跳转前拦截
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

// 路由跳转后拦截
router.afterEach(() => {
  NProgress.done()
})

export default router
