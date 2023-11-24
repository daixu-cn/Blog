<template>
  <div id="ActionUpload">
    <media-upload
      url="/lemon/create"
      :mime-rule="['image', 'video']"
      :el-upload-props="{ multiple: true }"
      @on-change="uploadChange"
      @on-success="uploadSuccess"
      @on-error="uploadError"
    >
      <el-button type="primary" :icon="Upload" class="operator"
        >媒体上传</el-button
      >
    </media-upload>
    <result-dialog :show="result.show" :result="result.list" @close="reset" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import type { UploadFile, UploadStatus } from "element-plus"
import { Upload } from "@element-plus/icons-vue"
import MediaUpload from "@/components/MediaUpload/MediaUpload.vue"
import ResultDialog from "./ResultDialog.vue"
import { IResult } from "./types"

const emits = defineEmits(["reset"])
const result = reactive<IResult>({
  show: false,
  list: []
})
function uploadChange(uploadFile: UploadFile) {
  result.list.push(uploadFile)
  if (result.list.length > 1) {
    result.show = true
  }
}
function uploadCallback(uploadFile: UploadFile, status: UploadStatus) {
  result.list[
    result.list.findIndex(item => item.uid === uploadFile.uid)
  ].status = status

  if (result.list.length === 1) {
    emits("reset")
  }
}
function uploadSuccess(uploadFile: UploadFile) {
  uploadCallback(uploadFile, "success")
}
function uploadError(uploadFile: UploadFile) {
  uploadCallback(uploadFile, "fail")
}
function reset() {
  result.show = false
  result.list = []
  emits("reset")
}
</script>
