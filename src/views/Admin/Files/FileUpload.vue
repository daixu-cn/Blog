<template>
  <div id="SystemFiles-FileUpload">
    <el-upload
      :on-change="onChange"
      :auto-upload="false"
      :show-file-list="false"
    >
      <slot></slot>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElNotification } from "element-plus"
import type { UploadProps } from "element-plus"
import NProgress from "nprogress"
import resumeUpload from "@/utils/resumeUpload"

const props = defineProps({
  replaceFiles: {
    type: String,
    default: ""
  }
})
const emits = defineEmits(["onSuccess", "onLoading"])

const onChange: UploadProps["onChange"] = rawFile => {
  if (!rawFile.raw) {
    return
  }

  NProgress.start()
  emits("onLoading", true)

  resumeUpload(rawFile.raw, {
    url: "/upload/file",
    methods: "put",
    params: {
      replaceFiles: props.replaceFiles,
      module: -1
    },
    onProgress(currentChunk, chunks) {
      NProgress.set(currentChunk / chunks)
    },
    onSuccess(path) {
      emits("onSuccess", path)
      emits("onLoading", false)
      NProgress.done()

      ElNotification({
        type: "success",
        title: "操作成功",
        message: path,
        duration: 1000 * 5
      })
    },
    onError(error) {
      ElMessage(error)
      emits("onLoading", false)
      NProgress.done()
    }
  })
}
</script>
