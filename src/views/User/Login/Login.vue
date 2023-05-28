<template>
  <div id="Login" class="module">
    <h1 class="title">{{ $t("login.login") }}</h1>
    <div class="form">
      <input
        v-model="form.email"
        type="text"
        :placeholder="$t('login.placeholder.email')"
      />
      <input
        v-model="form.password"
        type="password"
        :placeholder="$t('login.placeholder.password')"
        @keyup.enter="login"
      />
    </div>
    <el-button class="action" :loading="loading" @click="login">{{
      $t("login.login")
    }}</el-button>
    <div class="auth">
      <span @click="goToPage('Forget')">{{ $t("login.forget") }}</span>
      <p @click="goToPage('Register')">
        {{ $t("login.noAccount") }}<span>{{ $t("login.goRegister") }}</span>
      </p>
    </div>
    <div class="OAuth">
      <Icon class="icon-qq" @click="OAuthLogin('qq')" />
      <Icon class="icon-github" @click="OAuthLogin('github')" />
      <Icon class="icon-google" @click="OAuthLogin('google')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import http from "@/server"
import { ElMessage } from "element-plus"
import useUserStore from "@/store/user"
import i18n from "@/locale"

const redirectURI = "https://daixu.cn/oauth"
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const form = reactive({
  email: localStorage.getItem("email") ?? "",
  password: ""
})

function goToPage(name: string) {
  router.push({ name })
}
async function login() {
  if (!form.email.trim()) {
    ElMessage.warning(i18n.global.t("login.message.verifyEmail"))
    return
  }
  if (!form.password.trim()) {
    ElMessage.warning(i18n.global.t("login.message.verifyPassword"))
    return
  }

  try {
    loading.value = true
    const res = await http.post("/user/login", form)
    if (res.code === 0) {
      ElMessage.success(i18n.global.t("login.message.successfullyLogin"))
      userStore.setUser(res.data.user)
      userStore.setToken(res.data.token)
      localStorage.setItem("email", form.email)
      router.replace(sessionStorage.getItem("redirect") ?? "/")
      sessionStorage.removeItem("redirect")
    }
  } finally {
    loading.value = false
  }
}

function OAuthLogin(type) {
  if (type === "qq") {
    window.location.href = `https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=101959622&redirect_uri=${redirectURI}&state=qq`
  }
  if (type === "github") {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=52a68a030ce19089d0f1&redirect_uri=${redirectURI}&state=github`
  }
  if (type === "google") {
    ElMessage.warning("授权对接中...")
  }
}
</script>

<style lang="scss">
#Login {
  .OAuth {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px dashed #ccc;
    .icon {
      font-size: 30px;
      color: $font-color-secondary;
      transition: all 0.3s;
      cursor: pointer;
      &:hover {
        color: #fbc2eb;
      }
    }
  }
}
</style>
