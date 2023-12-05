<template>
  <div id="SystemArticleMD-Poster">
    <el-upload
      :action="`${BASE_API}/upload/file`"
      method="put"
      :headers="{ Authorization: `Bearer ${userStore.token}` }"
      :data="{ replaceFile: props.posterUrl }"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :show-file-list="false"
    >
      <el-button text bg>上传图片</el-button>
    </el-upload>

    <div v-if="props.posterUrl" class="link-container">
      <el-link
        class="fileLink"
        type="primary"
        :href="props.posterUrl"
        target="_blank"
        >{{ props.posterUrl }}</el-link
      >
      <span class="remove" @click="remove">移除</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UploadProps } from "element-plus"
import { ElMessage } from "element-plus"
import { BASE_API } from "@/global/env"
import useUserStore from "@/store/user"

const props = defineProps({
  posterUrl: {
    type: String,
    default: ""
  }
})
const emits = defineEmits(["onSuccess", "onLoading"])

const userStore = useUserStore()

const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  if (!rawFile.type.startsWith("image")) {
    ElMessage.error("图片格式异常")
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("图片格式不能超过2MB!")
    return false
  }

  emits("onLoading", true)
  return true
}
const onSuccess: UploadProps["onSuccess"] = res => {
  emits("onLoading", false)

  if (res.code === 0) {
    emits("onSuccess", res.data)
  } else {
    ElMessage.error(res.message)
  }
}
const onError: UploadProps["onError"] = () => {
  emits("onLoading", false)
}

function remove() {
  emits("onSuccess", null)
}
</script>
