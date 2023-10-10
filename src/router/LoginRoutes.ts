import { RouteRecordRaw } from "vue-router"

// 后台系统路由
const LoginRoutes: RouteRecordRaw = {
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
}

export default LoginRoutes
