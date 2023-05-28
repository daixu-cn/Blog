<template>
  <div
    id="OAuth"
    v-loading="true"
    :element-loading-text="i18n.global.t('login.oauth')"
  ></div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router"
import http from "@/server"
import { ElMessage } from "element-plus"
import useUserStore from "@/store/user"
import i18n from "@/locale"
import queryString from "query-string"

const { query } = useRoute()
const router = useRouter()
const userStore = useUserStore()

async function login(url, params) {
  const res = await http.post(url, params)
  if (res.code === 0) {
    ElMessage.success(i18n.global.t("login.message.successfullyLogin"))
    userStore.setUser(res.data.user)
    userStore.setToken(res.data.token)
    router.replace(sessionStorage.getItem("redirect") ?? "/")
    sessionStorage.removeItem("redirect")
  }
  router.replace(sessionStorage.getItem("redirect") ?? "/")
}

if (queryString.parse(window.location.hash)?.state === "qq") {
  login("/user/login/qq", {
    accessToken: queryString.parse(window.location.hash)?.access_token
  })
} else if (query?.state === "github") {
  login("/user/login/github", { code: query?.code })
} else {
  router.replace(sessionStorage.getItem("redirect") ?? "/")
}
</script>

<style lang="scss">
#OAuth {
  width: 100vw;
  height: 100vh;
  .el-loading-text {
    margin-top: 20px;
  }
}
</style>
