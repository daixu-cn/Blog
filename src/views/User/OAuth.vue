<template>
  <div id="OAuth" v-loading="true" element-loading-text="授权处理中..."></div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router"
import { ElMessage, ElNotification } from "element-plus"
import queryString from "query-string"
import http from "@/server"
import useUserStore from "@/store/user"

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
        title: "注册成功",
        message:
          "您的邮箱未进行绑定，如有需要可前往账户中心进行绑定，绑定之后可以接收文章发布推送、评论回复通知等信息。",
        type: "success",
        duration: 0
      })
    } else {
      ElMessage.success(userStore.token ? "绑定成功" : "登录成功")
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
