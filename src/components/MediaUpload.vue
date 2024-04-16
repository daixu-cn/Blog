<template>
  <div id="MediaUpload">
    <el-upload
      method="put"
      :loading="loading"
      :action="`${BASE_API}${props.url}`"
      :headers="{ Authorization: `Bearer ${userStore.token}` }"
      :data="props.params"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      v-bind="props.elUploadProps"
    >
      <slot>
        <el-button text bg>上传资源</el-button>
      </slot>
    </el-upload>
    <div v-if="props.previewUrl" class="link-container">
      <el-link
        class="fileLink"
        type="primary"
        :href="props.previewUrl"
        target="_blank"
        >{{ props.previewUrl }}</el-link
      >
      <span class="remove" @click="remove">移除</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, PropType } from "vue"
import { ElMessage, ElUpload } from "element-plus"
import type { UploadProps } from "element-plus"
import { BASE_API } from "@/global/env"
import useUserStore from "@/store/user"

const props = defineProps({
  url: {
    type: String,
    default: "/upload/file"
  },
  params: {
    type: Object,
    default: () => ({})
  },
  // el-upload props
  elUploadProps: {
    type: Object,
    default: () => ({})
  },
  // 上传文件类型
  mimeRule: {
    type: Array as PropType<string[]>
  },
  previewUrl: {
    type: String
  }
})
const emits = defineEmits(["onSuccess", "onError", "onLoading", "onRemove"])

const userStore = useUserStore()
const loading = ref(false)

const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  const mime = rawFile.type.split("/")[0]

  if (!props.mimeRule || props.mimeRule.includes(mime)) {
    loading.value = true
    emits("onLoading", true)
    return true
  }
  emits("onError", rawFile, `仅支持 ${props.mimeRule.join("、")} 文件`)
  ElMessage.error(`仅支持 ${props.mimeRule.join("、")} 文件`)
}
const onSuccess: UploadProps["onSuccess"] = response => {
  if (response.code === 0) {
    emits("onSuccess", response.data)
  } else {
    ElMessage.error(response.message)
    emits("onError")
  }
  emits("onLoading", false)
  loading.value = false
}
const onError: UploadProps["onError"] = () => {
  emits("onError")
  emits("onLoading", false)
  loading.value = false
}

function remove() {
  emits("onRemove", null)
}
</script>

<style lang="scss">
#MediaUpload {
  width: 100%;
  .el-upload {
    width: 100%;
  }
}
</style>
