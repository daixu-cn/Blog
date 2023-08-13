<template>
  <div
    id="OAuth"
    v-loading="true"
    :element-loading-text="i18n.global.t('login.oauth')"
  ></div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router"
import { ElMessage, ElNotification } from "element-plus"
import queryString from "query-string"
import http from "@/server"
import useUserStore from "@/store/user"
import i18n from "@/locale"

const { query } = useRoute()
const router = useRouter()
const userStore = useUserStore()

async function login(url, params) {
  const res = await http.post(url, params)
  if (res.code === 0) {
    userStore.setUser(res.data.user)
    userStore.setToken(res.data.token)

    if (res.data.newUser) {
      ElNotification({
        title: i18n.global.t("login.message.successfullyRegister"),
        message: i18n.global.t("login.newUser"),
        type: "success",
        duration: 0
      })
    } else {
      ElMessage.success(
        i18n.global.t(
          userStore.token
            ? "login.message.bindSuccessfully"
            : "login.message.successfullyLogin"
        )
      )
    }
  }
  router.replace(sessionStorage.getItem("redirect") ?? "/")
  sessionStorage.removeItem("redirect")
}

const state = query?.state ?? queryString.parse(window.location.hash)?.state

if (state === "qq") {
  login("/user/login/qq", {
    accessToken: queryString.parse(window.location.hash)?.access_token
  })
} else if (state === "github") {
  login("/user/login/github", { code: query?.code })
} else if (state === "google") {
  login("/user/login/google", {
    accessToken: queryString.parse(window.location.hash)?.access_token
  })
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
