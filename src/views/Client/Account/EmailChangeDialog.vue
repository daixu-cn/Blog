<template>
  <el-dialog
    id="EmailChangeDialog"
    v-model="show"
    title="绑定邮箱"
    align-center
    @close="formRef?.resetFields()"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      status-icon
      label-width="80px"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="form.email"
          :placeholder="$t('login.placeholder.email')"
        />
      </el-form-item>
      <el-form-item label="验证码" prop="sms" class="captcha">
        <el-input
          v-model="form.sms"
          :placeholder="$t('login.placeholder.captcha')"
        />
        <el-button
          :class="{ disabled }"
          :disabled="disabled"
          :loading="codeLoading"
          @click="getCode"
          >{{ captcha }}</el-button
        >
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="loading" @click="show = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="confirm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import http from "@/server"
import i18n from "@/locale"

const emits = defineEmits(["confirm"])
const show = ref(false)
const disabled = ref(false)
const codeLoading = ref(false)
const loading = ref(false)
const captcha = ref(i18n.global.t("login.getCode"))
let timer: number
const form = reactive({
  email: "",
  sms: ""
})
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: i18n.global.t("login.message.verifyEmail"),
      trigger: "blur"
    }
  ],
  sms: [
    {
      required: true,
      message: i18n.global.t("login.message.verifyCaptcha"),
      trigger: "blur"
    }
  ]
})

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

async function confirm() {
  const valid = await formRef.value?.validate()
  if (valid) {
    loading.value = true
    const res = await http.patch("/user/update", form)
    if (res.code === 0) {
      ElMessage.success(i18n.global.t("login.message.successfullyModified"))
      show.value = false
      emits("confirm", res.data)
    }
    loading.value = false
  }
}

defineExpose({
  show,
  form
})
</script>

<style lang="scss">
#EmailChangeDialog {
  .captcha {
    .el-form-item__content {
      flex-wrap: nowrap;
      .el-button {
        margin-left: 10px;
      }
    }
  }
}
</style>
