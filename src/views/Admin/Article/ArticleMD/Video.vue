<template>
  <div id="SystemArticleMD-Video">
    <el-upload
      :on-change="onChange"
      :auto-upload="false"
      :show-file-list="false"
    >
      <el-button text bg>上传视频</el-button>
    </el-upload>
    <div v-if="props.videoUrl" class="link-container">
      <el-link class="fileLink" :href="props.videoUrl" target="_blank">{{
        props.videoUrl
      }}</el-link>
      <span class="remove" @click="remove">移除</span>
    </div>
    <el-progress
      v-if="video.progress"
      :percentage="video.percentage"
      :format="progressFormat"
      :color="video.color"
    />
  </div>
</template>

<script lang="ts" setup>
import { watch, reactive } from "vue"
import { ElMessage } from "element-plus"
import type { UploadProps } from "element-plus"
import resumeUpload from "@/utils/resumeUpload"
import http from "@/server"

const props = defineProps({
  videoUrl: {
    type: String,
    default: ""
  }
})
const emits = defineEmits(["onSuccess", "onLoading"])

const video = reactive({
  progress: false,
  percentage: 0,
  isError: false,
  color: ""
})

watch(
  () => video.isError,
  () => {
    const html = document.querySelector("html") as HTMLElement
    const style = getComputedStyle(html, null)
    const primaryColor = style.getPropertyValue("--el-color-primary")
    const dangerColor = style.getPropertyValue("--el-color-danger")

    if (video.isError) {
      video.color = dangerColor
    } else {
      video.color = primaryColor
    }
  },
  {
    immediate: true
  }
)

function progressFormat(percentage: number) {
  const percentageFormat = `${percentage.toFixed(2)}%`

  if (video.isError) {
    return `上传中断`
  }
  if (percentage === 100) {
    return "100%"
  }
  return percentageFormat
}
const onChange: UploadProps["onChange"] = rawFile => {
  if (rawFile.raw?.type.startsWith("video")) {
    video.progress = true

    emits("onLoading", true)
    resumeUpload(rawFile.raw, {
      url: "/upload/file",
      methods: "put",
      params: {
        replaceFile: props.videoUrl
      },
      onProgress(currentChunk, chunks) {
        video.percentage = (currentChunk / chunks) * 100
      },
      onSuccess(videoUrl) {
        emits("onSuccess", videoUrl)
        emits("onLoading", false)
        video.progress = false
        video.percentage = 0
      },
      onError() {
        video.isError = true
        emits("onLoading", false)
      }
    })
  } else {
    ElMessage.error("视频格式异常")
  }
}

async function remove() {
  try {
    emits("onLoading", true)

    const res = await http.delete("/upload/file", { path: props.videoUrl })
    if (res.code === 0) {
      emits("onSuccess", "")
    }
  } finally {
    emits("onLoading", false)
  }
}
</script>

<style lang="scss">
#SystemArticleMD-Video {
  .el-progress {
    margin-top: 10px;
    .el-progress__text {
      min-width: 60px;
      color: v-bind(
        "video.isError?'var(--el-color-danger)':'var(--el-color-primary)'"
      );
    }
  }
}
</style>
