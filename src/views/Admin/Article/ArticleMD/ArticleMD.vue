<template>
  <div id="SystemArticleMD" class="system-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/system/article">文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{
        articleId === "0" ? "创建文章" : "编辑文章"
      }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      ref="articleRef"
      v-loading="loading"
      class="articleForm"
      :model="article"
      :rules="rules"
      status-icon
      label-width="90px"
    >
      <el-form-item label="文章类别" prop="category">
        <el-select v-model="article.category" placeholder="请选择文章类别">
          <el-option
            v-for="item of categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="article.title" placeholder="请选择文章标题" />
      </el-form-item>
      <el-form-item label="文章描述" prop="description">
        <el-input
          v-model="article.description"
          :rows="1"
          type="textarea"
          placeholder="请输入文章描述"
        />
      </el-form-item>
      <el-form-item label="预览图片" prop="poster">
        <el-upload
          :action="`${BASE_API}/upload/file`"
          method="put"
          :headers="{ Authorization: `Bearer ${userStore.token}` }"
          :data="{ module: 0, replaceFiles: article.poster }"
          :before-upload="beforePosterUpload"
          :on-success="posterUploadSuccess"
          :show-file-list="false"
        >
          <el-button text bg>上传图片</el-button>
        </el-upload>
        <el-link
          v-if="article.poster"
          class="fileLink"
          type="primary"
          :href="article.poster"
          target="_blank"
          >{{ article.poster }}</el-link
        >
      </el-form-item>
      <el-form-item label="视频文件" prop="video">
        <el-upload
          :on-change="videoUploadChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button text bg>上传视频</el-button>
        </el-upload>
        <el-link
          v-if="article.video"
          class="fileLink"
          type="primary"
          :href="article.video"
          target="_blank"
          >{{ article.video }}</el-link
        >
        <el-progress
          v-if="isProgress"
          :percentage="percentage"
          :format="progressFormat"
        />
      </el-form-item>
      <el-form-item label-width="0">
        <MdEditor ref="MdEditorRef" />
      </el-form-item>
      <el-form-item label-width="0" class="button-container">
        <el-button type="primary" @click="saveArticle">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import { categories } from "@/global/select"
import resumeUpload from "@/utils/resumeUpload"
import { ElMessage } from "element-plus"
import type { FormInstance, FormRules, UploadProps } from "element-plus"
import { BASE_API } from "@/global/env"
import useUserStore from "@/store/user"
import http from "@/server"
import MdEditor from "@/components/MdEditor.vue"

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const articleRef = ref<FormInstance>()
const { articleId } = route.params
const MdEditorRef = ref()
const loading = ref(false)
const isProgress = ref(false)
const percentage = ref(0)
const article = reactive({
  articleId,
  category: "",
  title: "",
  description: "",
  poster: "",
  video: "",
  content: ""
})
const rules = reactive<FormRules>({
  title: [{ required: true, message: "文章标题不能为空", trigger: "blur" }],
  category: [
    {
      required: true,
      message: "文章种类不能为空",
      trigger: "change"
    }
  ]
})

const beforePosterUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (!rawFile.type.startsWith("image")) {
    ElMessage.error("图片格式异常")
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("图片格式不能超过2MB!")
    return false
  }
  return true
}
const posterUploadSuccess: UploadProps["onSuccess"] = (res) => {
  if (res.code === 0) {
    article.poster = res.data
  } else {
    ElMessage.error(res.message)
  }
}

function progressFormat(percentage: number) {
  return percentage === 100 ? "100%" : `${percentage.toFixed(2)}%`
}
const videoUploadChange: UploadProps["onChange"] = (rawFile) => {
  if (rawFile.raw?.type.startsWith("video")) {
    isProgress.value = true
    resumeUpload(rawFile.raw, {
      url: "/upload/file",
      methods: "put",
      params: {
        replaceFiles: article.video
      },
      onProgress(currentChunk, chunks) {
        percentage.value = (currentChunk / chunks) * 100
      },
      onSuccess(video) {
        article.video = video
        isProgress.value = false
        percentage.value = 0
      }
    })
  } else {
    ElMessage.error("视频格式异常")
  }
}

async function getArticleInfo() {
  if (articleId !== "0") {
    loading.value = true
    const res = await http.get(`/article/info/${articleId}`, {
      disableViewsIncrement: true
    })
    if (res.code === 0) {
      article.title = res.data.title
      article.category = res.data.category
      article.description = res.data.description
      article.poster = res.data.poster
      article.video = res.data.video
      article.content = res.data.content

      MdEditorRef.value.text = res.data.content
    }
    loading.value = false
  }
}
getArticleInfo()

async function saveArticle() {
  try {
    const valid = await articleRef.value?.validate()
    if (valid) {
      if (!MdEditorRef.value?.text) {
        ElMessage.error("文章正文不能为空")
        return
      }
      article.content = MdEditorRef.value.text
      loading.value = true

      const url = articleId === "0" ? "/article/create" : "/article/update"
      const methods = articleId === "0" ? "put" : "patch"
      const res = await http[methods](url, article)

      if (res.code === 0) {
        router.replace({ name: "SystemArticle" })
        ElMessage.success("操作成功")
      }
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
#SystemArticleMD {
  .articleForm {
    .el-form-item__content > div {
      width: 100%;
      .el-select {
        width: 100%;
      }
      .el-upload {
        width: 100%;
        .el-button {
          width: 100%;
        }
      }
    }
    .el-progress {
      margin-top: 10px;
    }
    .el-link {
      display: block;
      width: 100%;
      height: 32px;
      line-height: 32px;
      .el-link__inner {
        display: inline-block;
        width: 100%;
        @include text-ellipsis;
      }
    }

    .button-container {
      .el-form-item__content {
        display: flex;
        justify-content: center;

        .el-button {
          flex: 1;
        }
      }
    }
  }
}
</style>
