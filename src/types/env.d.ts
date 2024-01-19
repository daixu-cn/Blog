interface ImportMetaEnv {
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_WEB_SOCKET_API: string
  readonly VITE_APP_ASSET_PREFIX: string
  readonly VITE_APP_DEFAULE_THEME: string
  readonly VITE_APP_OAUTH_REDIRECT: string
  readonly VITE_APP_OAUTH_QQ_CLIENT_ID: string
  readonly VITE_APP_OAUTH_GITHUB_CLIENT_ID: string
  readonly VITE_APP_OAUTH_GOOGLE_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
