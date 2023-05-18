<template>
  <div id="Login" class="module">
    <h1 class="title">登录</h1>
    <div class="form">
      <input v-model="form.email" type="text" placeholder="邮箱" />
      <input
        v-model="form.password"
        type="password"
        placeholder="密码"
        @keyup.enter="login"
      />
    </div>
    <el-button class="action" :loading="loading" @click="login">登录</el-button>
    <div class="auth">
      <span @click="goToPage('Forget')">忘记密码</span>
      <p @click="goToPage('Register')">没有账号?<span>去注册</span></p>
    </div>
    <div class="OAuth">
      <Icon class="icon-qq" />
      <Icon class="icon-github" />
      <Icon class="icon-google" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import http from "@/server"
import { ElMessage } from "element-plus"
import useUserStore from "@/store/user"

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
    ElMessage.warning("请输入邮箱")
    return
  }
  if (!form.password.trim()) {
    ElMessage.warning("请输入密码")
    return
  }

  try {
    loading.value = true
    const res = await http.post("/user/login", form)
    if (res.code === 0) {
      ElMessage.success("登录成功")
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
