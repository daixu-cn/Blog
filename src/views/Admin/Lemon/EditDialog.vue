<template>
  <el-dialog
    id="SystemLemon-ActionDialog"
    v-model="show"
    :title="form.lemonId ? '编辑记录' : '新建记录'"
    :close-on-click-modal="false"
    destroy-on-close
    @close="reset"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="媒体文件" prop="path" class="upload">
        <media-upload
          is-progress
          :params="{ replaceFile: form.path }"
          @on-success="uploadSuccess"
        >
          <template #default="scope">
            <p v-if="form.path" v-loading="scope.loading" class="path">
              {{ form.path }}
            </p>
            <el-button v-else type="primary" :loading="scope.loading" plain
              >上传</el-button
            >
          </template>
        </media-upload>
      </el-form-item>
      <el-form-item label="记录描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          placeholder="请输入描述"
          :autosize="{ minRows: 3 }"
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
import { reactive, ref } from "vue"
import { ElMessage } from "element-plus"
import type { FormInstance } from "element-plus"
import http from "@/server"
import MediaUpload from "@/components/MediaUpload/MediaUpload.vue"

const emits = defineEmits(["confirm"])

const formRef = ref<FormInstance>()
const show = ref(false)
const loading = ref(false)
const form = reactive({
  lemonId: "",
  path: "",
  description: ""
})
const rules = reactive({
  path: [
    {
      required: true,
      validator(_, value, callback) {
        if (!value) {
          callback(new Error("请选择媒体文件"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ]
})
function openDialog() {
  show.value = true
}
function uploadSuccess(_, path: string) {
  form.path = path
}
async function confirm() {
  try {
    const valid = await formRef.value?.validate()

    if (valid) {
      loading.value = true

      const url = form.lemonId ? "/lemon/update" : "/lemon/create"
      const methods = form.lemonId ? "patch" : "put"
      const res = await http[methods](url, {
        ...form
      })

      if (res.code === 0) {
        ElMessage.success("操作成功")
        show.value = false
        emits("confirm", form.lemonId ? 1 : undefined)
      }
    }
  } finally {
    loading.value = false
  }
}
function reset() {
  formRef.value?.resetFields()
  form.lemonId = ""
  form.path = ""
  form.description = ""
}

defineExpose({
  openDialog,
  form
})
</script>

<style lang="scss">
#SystemLemon-ActionDialog {
  .el-dialog__body {
    padding-bottom: 0;
    .upload {
      .path {
        word-break: break-all;
      }
      .el-button {
        width: 100%;
      }
    }
  }
  .dialog-footer {
    width: 100%;
    .el-button {
      width: 100%;
    }
  }
}
</style>
