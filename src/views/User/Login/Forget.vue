<template>
  <div id="Forget" class="module">
    <h1 class="title">{{ $t("login.forget") }}</h1>
    <div class="form">
      <input
        v-model="form.email"
        type="text"
        :placeholder="$t('login.placeholder.email')"
      />
      <div class="code-container">
        <input
          v-model="form.sms"
          class="code"
          type="text"
          :placeholder="$t('login.placeholder.captcha')"
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
      <input
        v-model="form.password"
        type="password"
        :placeholder="$t('login.placeholder.newPassword')"
      />
      <input
        v-model="form.confirmPassword"
        type="password"
        :placeholder="$t('login.placeholder.confirmPassword')"
      />
    </div>
    <el-button class="action" :loading="loading" @click="forget">{{
      $t("login.changePassword")
    }}</el-button>
    <div class="auth">
      <span @click="goToPage('Login')">{{ $t("login.backLogin") }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import http from "@/server"
import i18n from "@/locale"

const router = useRouter()
const disabled = ref(false)
const codeLoading = ref(false)
const loading = ref(false)
const captcha = ref(i18n.global.t("login.getCode"))
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
    ElMessage.warning(i18n.global.t("login.message.verifyEmail"))
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    ElMessage.warning(i18n.global.t("login.message.verifyEmailFormat"))
    return
  }

  try {
    codeLoading.value = true
    const res = await http.post("/user/sms", {
      email: form.email
    })
    if (res.code === 0) {
      ElMessage.success(i18n.global.t("login.message.sentSuccessfully"))
      let timers = 59
      disabled.value = true
      captcha.value = i18n.global.t("login.message.reacquireTimer", {
        timers: 60
      })
      timer = setInterval(() => {
        if (timers <= 0) {
          clearInterval(timer)
          captcha.value = i18n.global.t("login.message.reacquire")
          disabled.value = false
        } else {
          captcha.value = i18n.global.t("login.message.reacquireTimer", {
            timers
          })
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
    ElMessage.warning(i18n.global.t("login.message.verifyEmail"))
    return
  }
  if (!form.sms.trim()) {
    ElMessage.warning(i18n.global.t("login.message.verifyCaptcha"))
    return
  }
  if (!form.password.trim()) {
    ElMessage.warning(i18n.global.t("login.message.verifyPassword"))
    return
  }
  if (form.password !== form.confirmPassword) {
    ElMessage.warning(i18n.global.t("login.message.verifyPassword2"))
    return
  }

  try {
    loading.value = true
    const res = await http.patch("/user/password", form)
    if (res.code === 0) {
      ElMessage.success(i18n.global.t("login.message.successfullyModified"))
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
