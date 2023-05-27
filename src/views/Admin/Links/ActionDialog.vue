<template>
  <el-dialog
    id="SystemLinks-ActionDialog"
    v-model="show"
    title="编辑友联"
    @close="linkRef?.resetFields()"
  >
    <el-form
      ref="linkRef"
      :model="link"
      :rules="rules"
      status-icon
      label-width="100px"
    >
      <el-form-item label="网站名称" prop="name">
        <el-input v-model="link.name" placeholder="请输入网站名称" />
      </el-form-item>
      <el-form-item label="网站描述" prop="description">
        <el-input v-model="link.description" placeholder="请输入网站描述" />
      </el-form-item>
      <el-form-item label="网站LOGO" prop="logo">
        <el-input v-model="link.logo" placeholder="请输入网站LOGO" />
      </el-form-item>
      <el-form-item label="网站地址" prop="url">
        <el-input v-model="link.url" placeholder="请输入网站地址" />
      </el-form-item>
      <el-form-item label="站长邮箱" prop="email">
        <el-input v-model="link.email" placeholder="请输入站长邮箱" />
      </el-form-item>
      <el-form-item label="网站QQ" prop="qq">
        <el-input v-model="link.qq" placeholder="请输入网站QQ" />
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
import http from "@/server"
import { ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"

const emits = defineEmits(["confirm"])
const show = ref(false)
const loading = ref(false)
const link = reactive({
  linkId: "",
  name: "",
  description: "",
  logo: "",
  url: "",
  email: "",
  qq: ""
})
const linkRef = ref<FormInstance>()
const rules = reactive<FormRules>({})

async function confirm() {
  const valid = await linkRef.value?.validate()
  if (valid) {
    loading.value = true
    const res = await http.patch("/link/update", link)
    if (res.code === 0) {
      ElMessage.success("编辑成功")
      show.value = false
      emits("confirm")
    }
    loading.value = false
  }
}

defineExpose({
  show,
  link
})
</script>
