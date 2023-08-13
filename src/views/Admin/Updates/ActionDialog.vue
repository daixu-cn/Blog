<template>
  <el-dialog
    id="SystemUpdates-ActionDialog"
    v-model="show"
    :title="form.updateId ? '编辑更新' : '新建更新'"
    @close="reset"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      status-icon
      label-width="100px"
    >
      <el-form-item prop="content" label-width="0">
        <el-input
          v-model="form.content"
          placeholder="请输入更新内容"
          :autosize="{ minRows: 4 }"
          :rows="4"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
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
const loading = ref(false)
const form = reactive({
  updateId: "",
  content: ""
})
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  content: [{ required: true, message: "更新内容不能为空", trigger: "blur" }]
})

async function confirm() {
  const valid = await formRef.value?.validate()
  if (valid) {
    loading.value = true
    const url = form.updateId ? "/update/update" : "/update/create"
    const methods = form.updateId ? "patch" : "put"
    const res = await http[methods](url, form)
    if (res.code === 0) {
      ElMessage.success("操作成功")
      show.value = false
      emits("confirm")
    }
    loading.value = false
  }
}

function reset() {
  form.updateId = ""
  form.content = ""
}

defineExpose({
  show,
  form
})
</script>

<style lang="scss">
#SystemUpdates-ActionDialog {
  .el-dialog__body {
    padding-bottom: 0;
  }
  .dialog-footer {
    width: 100%;
    .el-button {
      width: 100%;
    }
  }
}
</style>
