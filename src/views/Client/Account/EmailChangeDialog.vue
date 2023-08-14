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
        <el-input v-model="form.email" placeholder="邮箱" />
      </el-form-item>
      <el-form-item label="验证码" prop="sms" class="captcha">
        <el-input v-model="form.sms" placeholder="验证码" />
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

const emits = defineEmits(["confirm"])
const show = ref(false)
const disabled = ref(false)
const codeLoading = ref(false)
const loading = ref(false)
const captcha = ref("获取验证码")
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
      message: "请输入邮箱",
      trigger: "blur"
    }
  ],
  sms: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur"
    }
  ]
})

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
      captcha.value = `重新获取(${timers}s)`

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

async function confirm() {
  const valid = await formRef.value?.validate()
  if (valid) {
    loading.value = true
    const res = await http.patch("/user/update", form)
    if (res.code === 0) {
      ElMessage.success("修改成功")
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
