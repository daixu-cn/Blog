// 请求地址
export const BASE_API = import.meta.env.VITE_APP_BASE_API
// 静态网络文件前缀
export const ASSET_PREFIX = import.meta.env.VITE_APP_ASSET_PREFIX
// 站点域名
export const DOMAIN = import.meta.env.VITE_APP_DOMAIN
// 默认主题
export const DEFAULE_THEME = import.meta.env.VITE_APP_DEFAULE_THEME

// 第三方授权重定向地址
const redirectURI = import.meta.env.VITE_APP_OAUTH_REDIRECT
// 跳转到授权地址
export function OAuth(type: "qq" | "github" | "google") {
  if (type === "qq") {
    window.location.href = `https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=${
      import.meta.env.VITE_APP_OAUTH_QQ_CLIENT_ID
    }&redirect_uri=${redirectURI}&state=qq`
  }
  if (type === "github") {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${
      import.meta.env.VITE_APP_OAUTH_GITHUB_CLIENT_ID
    }&redirect_uri=${redirectURI}&state=github`
  }
  if (type === "google") {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
      import.meta.env.VITE_APP_OAUTH_GOOGLE_CLIENT_ID
    }&redirect_uri=${redirectURI}&scope=${encodeURIComponent(
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"
    )}&response_type=token&state=google`
  }
}
