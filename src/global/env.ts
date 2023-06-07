// 请求地址
export const BASE_API = import.meta.env.VITE_APP_BASE_API
// 默认语言
export const DEFAULE_LOCALE = import.meta.env.VITE_APP_DEFAULE_LOCALE
// 默认主题
export const DEFAULE_THEME = import.meta.env.VITE_APP_DEFAULE_THEME

// 第三方授权重定向地址
const redirectURI = "https://daixu.cn/oauth"
// 跳转到授权地址
export function OAuth(type: "qq" | "github" | "google") {
  if (type === "qq") {
    window.location.href = `https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=101959622&redirect_uri=${redirectURI}&state=qq`
  }
  if (type === "github") {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=52a68a030ce19089d0f1&redirect_uri=${redirectURI}&state=github`
  }
  if (type === "google") {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=149094609811-jt66sud8u9qmvueehdh8rhani1aqaeiv.apps.googleusercontent.com&redirect_uri=${redirectURI}&scope=${encodeURIComponent(
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"
    )}&response_type=token&state=google`
  }
}
