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
      <el-form-item label="是否评论" prop="disableComment">
        <el-radio-group v-model="article.disableComment">
          <el-radio :label="0">允许评论</el-radio>
          <el-radio :label="1">禁止评论</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否私有" prop="isPrivate">
        <el-radio-group v-model="article.isPrivate">
          <el-radio :label="0">公开</el-radio>
          <el-radio :label="1">私有</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="articleId === '0'" label="邮件推送" required>
        <el-radio-group v-model="article.isSendEmail">
          <el-radio :label="1">推送</el-radio>
          <el-radio :label="0">不推送</el-radio>
        </el-radio-group>
      </el-form-item>
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
          autosize
          type="textarea"
          placeholder="请输入文章描述"
        />
      </el-form-item>
      <el-form-item label="解锁时间" prop="unlockAt">
        <el-date-picker
          v-model="article.unlockAt"
          type="datetime"
          placeholder="请选择解锁时间"
          value-format="YYYY-MM-DDTHH:mm:ss.sssZZ"
          :teleported="false"
        />
      </el-form-item>
      <el-form-item label="预览图片" prop="poster">
        <Poster
          :poster-url="article.poster"
          @on-success="posterUploadSuccess"
          @on-loading="loading => (control.posterLoading = loading)"
        />
      </el-form-item>
      <el-form-item label="视频文件" prop="video">
        <Video
          :video-url="article.video"
          @on-success="videoUploadSuccess"
          @on-loading="loading => (control.videoLoading = loading)"
        />
      </el-form-item>
      <el-form-item label-width="0">
        <MdEditor
          ref="MdEditorRef"
          @on-save="saveArticle"
          @on-loading="loading => (control.MdEditorLoading = loading)"
        />
      </el-form-item>
      <el-form-item label-width="0" class="button-container">
        <el-button
          type="primary"
          :loading="control.saveLoading"
          @click="MdEditorRef?.Editor?.triggerSave()"
          >{{ control.saveText }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="SystemArticleMD">
import { ref, reactive, onUnmounted, watchEffect } from "vue"
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import { categories } from "@/global/select"
import http from "@/server"
import MdEditor from "@/components/MdEditor.vue"
import has from "lodash/has"
import Video from "./Video.vue"
import Poster from "./Poster.vue"

const route = useRoute()
const router = useRouter()
const articleRef = ref<FormInstance>()
const { articleId } = route.params
const MdEditorRef = ref<InstanceType<typeof MdEditor>>()
const loading = ref(false)
const control = reactive({
  change: 0,
  posterLoading: false,
  videoLoading: false,
  MdEditorLoading: false,
  saveLoading: false,
  saveText: "保存"
})
const article = reactive({
  articleId,
  category: "",
  title: "",
  description: "",
  unlockAt: undefined,
  poster: "",
  video: "",
  content: "",
  disableComment: 0,
  isPrivate: 0,
  isSendEmail: 1
})
const rules = reactive<FormRules>({
  title: [{ required: true, message: "文章标题不能为空", trigger: "blur" }],
  category: [
    {
      required: true,
      message: "文章种类不能为空",
      trigger: "change"
    }
  ],
  disableComment: [
    {
      required: true,
      message: "选择是否禁止评论",
      trigger: "change"
    }
  ],
  isPrivate: [
    {
      required: true,
      message: "选择是否为私有文章",
      trigger: "change"
    }
  ]
})

watchEffect(() => {
  const isUpload =
    control.posterLoading || control.videoLoading || control.MdEditorLoading

  control.change++
  control.saveLoading = isUpload
  control.saveText = isUpload ? "请等待资源操作完成..." : "保存"
})

function posterUploadSuccess(posterUrl: string) {
  article.poster = posterUrl
}
function videoUploadSuccess(videoUrl: string) {
  article.video = videoUrl
}

async function getArticleInfo() {
  if (articleId !== "0") {
    loading.value = true
    const res = await http.get(`/article/info/${articleId}`, {
      disableViewsIncrement: true
    })
    if (res.code === 0) {
      for (const key in res.data) {
        if (has(article, key)) {
          article[key] = res.data[key]
        }
      }
      article.disableComment = res.data.disableComment ? 1 : 0
      article.isPrivate = res.data.isPrivate ? 1 : 0

      MdEditorRef.value?.Editor?.insert(() => {
        return {
          targetValue: res.data.content,
          select: false,
          deviationStart: 0,
          deviationEnd: 0
        }
      })
    }
    loading.value = false
  }
}
getArticleInfo()

async function saveArticle(content: string) {
  try {
    const valid = await articleRef.value?.validate()
    if (valid) {
      if (!content) {
        ElMessage.error("文章正文不能为空")
        return
      }

      loading.value = true
      article.content = content

      const url = articleId === "0" ? "/article/create" : "/article/update"
      const methods = articleId === "0" ? "put" : "patch"
      const res = await http[methods](url, article)

      if (res.code === 0) {
        // 重置文件上传状态，否则路由跳转会被拦截
        control.change = 0
        router.replace({ name: "SystemArticle" })
        ElMessage.success("操作成功")
      }
    }
  } finally {
    loading.value = false
  }
}

// 判断文章内容和文件资源是否存在编辑
function hasArticleChanges() {
  return MdEditorRef.value?.text !== article.content || control.change > 1
}
// 监听离开页面时间
function onbeforeunload(event: BeforeUnloadEvent) {
  if (hasArticleChanges()) {
    event.preventDefault()
    event.returnValue = "您有未保存的更改，确定要离开此页面吗？"
  }
}
window.addEventListener("beforeunload", onbeforeunload)
// 监听路由切换回调
onBeforeRouteLeave((_to, _form, next) => {
  if (hasArticleChanges()) {
    ElMessageBox.confirm("您有未保存的更改，确定要离开此页面吗？", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        next()
      })
      .catch(() => {
        ElMessageBox.close()
        next(false)
      })
  } else {
    next()
  }
})

onUnmounted(() => {
  // 移除监听事件
  window.removeEventListener("beforeunload", onbeforeunload)
})
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

    .link-container {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .el-link {
        display: block;
        width: calc(100% - 50px);
        height: 32px;
        line-height: 32px;
        transition: all $duration;
        .el-link__inner {
          display: inline-block;
          width: 100%;
          @include text-ellipsis;
        }
      }
      .remove {
        color: $color-primary;
        cursor: pointer;
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
