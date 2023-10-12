import { RouteRecordRaw } from "vue-router"

// 创意空间扩展路由
const ExternalRoutes: RouteRecordRaw = {
  path: "/external",
  name: "External",
  component: () => import("@/views/External/External.vue"),
  redirect: "/creations",
  children: [
    {
      path: "/creations/final-choice",
      name: "Creations-FinalChoice",
      component: () => import("@/views/External/FinalChoice/FinalChoice.vue"),
      meta: {
        title: "最终选择 - 摆脱困难选择症，随机为您做出选择"
      }
    }
  ]
}

export default ExternalRoutes
