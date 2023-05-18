<template>
  <div id="Forget" class="module">
    <h1 class="title">忘记密码</h1>
    <div class="form">
      <input v-model="form.email" type="text" placeholder="邮箱" />
      <div class="code-container">
        <input
          v-model="form.sms"
          class="code"
          type="text"
          placeholder="验证码"
        />
        <el-button
          class="captcha action-small"
          :class="{ disabled }"
          :disabled="disabled"
          :loading="codeLoading"
          @click="getCode"
          >{{ captcha }}</el-button
        >
      </div>
      <input v-model="form.password" type="password" placeholder="新密码" />
      <input
        v-model="form.confirmPassword"
        type="password"
        placeholder="确认密码"
      />
    </div>
    <el-button class="action" :loading="loading" @click="forget"
      >修改密码</el-button
    >
    <div class="auth">
      <span @click="goToPage('Login')">返回登录</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import http from "@/server"
import { ElMessage } from "element-plus"

const router = useRouter()
const disabled = ref(false)
const codeLoading = ref(false)
const loading = ref(false)
const captcha = ref("获取验证码")
let timer: number
const form = reactive({
  email: localStorage.getItem("email") ?? "",
  sms: "",
  password: "",
  confirmPassword: ""
})

function goToPage(name: string) {
  router.push({ name })
}

async function getCode() {
  if (!form.email.trim()) {
    ElMessage.warning("请输入邮箱")
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    ElMessage.warning("邮箱格式有误")
    return
  }

  try {
    codeLoading.value = true
    const res = await http.post("/user/sms", {
      email: form.email
    })
    if (res.code === 0) {
      ElMessage.success("验证码发送成功")
      let timers = 59
      disabled.value = true
      captcha.value = "重新获取(60s)"
      timer = setInterval(() => {
        if (timers <= 0) {
          clearInterval(timer)
          captcha.value = "重新获取"
          disabled.value = false
        } else {
          captcha.value = `重新获取(${timers}s)`
          timers--
        }
      }, 1000)
    }
  } finally {
    codeLoading.value = false
  }
}
async function forget() {
  if (!form.email.trim()) {
    ElMessage.warning("请输入邮箱")
    return
  }
  if (!form.sms.trim()) {
    ElMessage.warning("请输入验证码")
    return
  }
  if (!form.password.trim()) {
    ElMessage.warning("请输入密码")
    return
  }
  if (form.password !== form.confirmPassword) {
    ElMessage.warning("两次密码不相同")
    return
  }

  try {
    loading.value = true
    const res = await http.patch("/user/password", form)
    if (res.code === 0) {
      ElMessage.success("修改成功")
      localStorage.setItem("email", form.email)
      goToPage("Login")
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
#Forget {
  &.module {
    .auth {
      justify-content: flex-end !important;
    }
  }
}
</style>
