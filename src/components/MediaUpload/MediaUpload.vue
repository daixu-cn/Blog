<template>
  <div id="MediaUpload">
    <el-upload
      v-loading="loading"
      :on-change="onChange"
      :auto-upload="false"
      :show-file-list="false"
      v-bind="props.elUploadProps"
    >
      <slot />
    </el-upload>

    <el-progress
      v-if="props.isProgress && progress?.percentage !== undefined"
      :percentage="progress.percentage"
      :format="progressFormat"
      :color="progress.color"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, PropType } from "vue"
import { ElMessage, ElUpload } from "element-plus"
import type { UploadFile, UploadProps } from "element-plus"
import resumeUpload from "@/utils/resumeUpload"
import { IProgress } from "./types"

const props = defineProps({
  url: {
    type: String,
    default: "/upload/file"
  },
  params: {
    type: Object,
    default: () => ({})
  },
  isProgress: {
    type: Boolean,
    default: false
  },
  // el-upload props
  elUploadProps: {
    type: Object,
    default: () => ({})
  },
  // 上传文件类型
  mimeRule: {
    type: Array as PropType<string[]>
  }
})
const emits = defineEmits(["onChange", "onSuccess", "onError", "onProgress"])

const loading = ref(false)
// 进度条相关处理
const progress = reactive<IProgress>({})
function progressFormat(percentage: number) {
  const percentageFormat = `${percentage.toFixed(2)}%`

  if (percentage === -1) {
    return `上传中断`
  }
  if (percentage === 100) {
    return "100%"
  }
  return percentageFormat
}
watch(
  () => progress.percentage,
  () => {
    const html = document.querySelector("html") as HTMLElement
    const style = getComputedStyle(html, null)
    const primaryColor = style.getPropertyValue("--el-color-primary")
    const dangerColor = style.getPropertyValue("--el-color-danger")

    if (progress.percentage === -1) {
      progress.color = dangerColor
    } else {
      progress.color = primaryColor
    }
  },
  {
    immediate: true
  }
)

function percentageChange(prawFile: UploadFile, percentage: number) {
  progress.percentage = percentage
  emits("onProgress", prawFile, percentage)
}

const onChange: UploadProps["onChange"] = rawFile => {
  emits("onChange", rawFile)

  if (rawFile.raw) {
    const { type } = rawFile.raw
    const mime = type.split("/")[0]

    if (!props.mimeRule || props.mimeRule.includes(mime)) {
      loading.value = true
      progress.percentage = 0

      resumeUpload(rawFile.raw, {
        url: props.url,
        methods: "put",
        params: props.params,
        onProgress(currentChunk, chunks) {
          percentageChange(rawFile, (currentChunk / chunks) * 100)
        },
        onSuccess(videoUrl) {
          percentageChange(rawFile, 100)
          emits("onSuccess", rawFile, videoUrl)
          loading.value = false
        },
        onError(error) {
          percentageChange(rawFile, -1)
          emits("onError", rawFile, error)
          loading.value = false
        }
      })
    } else {
      emits("onError", rawFile, `仅支持 ${props.mimeRule.join("、")} 文件`)
      ElMessage.error(`仅支持 ${props.mimeRule.join("、")} 文件`)
    }
  }
}
</script>

<style lang="scss">
#MediaUpload {
  width: 100%;
  .el-upload {
    width: 100%;
  }
  .el-progress {
    margin-top: 10px;
    .el-progress__text {
      min-width: initial;
      color: v-bind(
        "progress.percentage===-1?'var(--el-color-danger)':'var(--el-color-primary)'"
      );
    }
  }
}
</style>
