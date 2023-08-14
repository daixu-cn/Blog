import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    // 进入该路由是否需要校验登录 0:管理员 1:普通用户
    role?: 0 | 1
    // 父级路由名称（如果是嵌套的二级动态路由那么需要写一下该属性，例如：/account）
    parentName?: string
    // 当前路由标题，会替换 document.title
    title?: string
  }
}
