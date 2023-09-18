<template>
  <div id="ArticleDetail">
    <div v-if="info?.isPrivate && userStore.info?.role !== 0" class="isPrivate">
      私有文章，您没有访问权限～
    </div>

    <template v-else>
      <div class="article-view">
        <el-skeleton :loading="loading" animated>
          <template #template>
            <el-skeleton-item variant="h3" style="width: 30%" class="title" />
            <ul class="article-info">
              <el-skeleton-item style="width: 50px" />
              <el-skeleton-item style="width: 50px" />
              <el-skeleton-item style="width: 50px" />
              <el-skeleton-item style="width: 50px" />
            </ul>
            <el-skeleton :rows="10" animated />
          </template>
          <template #default>
            <h1 :id="info?.title" class="title">{{ info?.title }}</h1>
            <ul class="article-info">
              <li># {{ info?.category }}</li>
              <li>{{ info?.views.toLocaleString() }} 访问</li>
              <li>
                {{ info?.comment_reply_total.toLocaleString() }}
                评论
              </li>
              <li>{{ info?.createdAt }}</li>
            </ul>
            <h6 class="description">{{ info?.description }}</h6>
            <Player v-if="info?.video" :src="info?.video" />

            <MdEditor
              class="article-content"
              :is-preview="true"
              :text="info?.content"
              @onGetCatalog="onGetCatalog"
            />
            <Comment :article-id="articleId" :disable="info.disableComment" />
          </template>
        </el-skeleton>
      </div>

      <Catalog :loading="loading" :catalog="catalog" />
    </template>
  </div>
</template>

<script lang="ts" setup name="ArticleDetail">
import { ref, nextTick, onBeforeUnmount, watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { HeadList } from "md-editor-v3"
import { cloneDeep } from "lodash"
import dayjs from "dayjs"
import http from "@/server"
import Player from "@/components/Player.vue"
import MdEditor from "@/components/MdEditor.vue"
import Comment from "@/components/Comment/Comment.vue"
import { categories } from "@/global/select"
import useUserStore from "@/store/user"
import Catalog from "./Catalog.vue"

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const info = ref()
const catalog = ref<HeadList[]>([])
// 目录是否已加载
const catalog_lock = ref(false)
const articleId = computed(() => route.params?.articleId as string)

async function getInfo() {
  loading.value = true
  const res = await http.get(`/article/info/${articleId.value}`)

  if (res.code === 0) {
    res.data.category = categories.find(
      item => item.value === res.data.category
    )?.label

    res.data.createdAt = dayjs(res.data.createdAt).fromNow()

    info.value = res.data

    catalog_lock.value = false
    catalog.value = [
      {
        text: info.value?.title,
        level: 1
      }
    ]
  } else {
    router.replace("/404")
  }
  loading.value = false
}

watchEffect(() => {
  if (articleId.value) {
    getInfo()
  }
})

function onGetCatalog(list: HeadList[]) {
  if (!catalog_lock.value) {
    catalog.value.push(...list)

    if (!info.value?.disableComment) {
      catalog.value.push({
        text: `全部评论(${info.value.comment_reply_total})`,
        level: 1
      })
    }

    nextTick(() => {
      window.addEventListener("scroll", scrollHandler)
    })

    catalog_lock.value = true
  }
}
function scrollHandler() {
  const contentSections = catalog.value.map(
    item => document.getElementById(item.text) as HTMLElement
  )
  for (const el of cloneDeep(contentSections).reverse()) {
    if (el?.getBoundingClientRect().top <= 80) {
      for (const item of document.querySelectorAll(".catalog ul li")) {
        if (el.id === item.getAttribute("data-text")) {
          item.classList.add("active")
        } else {
          item.classList.remove("active")
        }
      }
      return
    }
  }
}

onBeforeUnmount(() => {
  window.removeEventListener("scroll", scrollHandler)
})
</script>

<style lang="scss">
#ArticleDetail {
  width: 100%;
  .isPrivate {
    height: calc(100vh - 80px);
    color: $color-primary;
    font-size: 1.5em;
    @include flex-center;
  }
  .article-view {
    width: calc(100% - 320px);
    margin-top: 20px;
    position: relative;
    z-index: 2;
    .el-skeleton {
      display: flex;
      flex-direction: column;
      .article-info {
        .el-skeleton__item {
          margin-right: 10px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .title {
      font-size: 1.4em;
      font-weight: bold;
      margin: 0 auto 20px auto;
      text-align: center;
      @include text-ellipsis;
    }
    .article-info {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 50px;
      li {
        color: $font-color-placeholder;
        margin-right: 5px;
        font-size: 12px;
        &:last-child {
          &::after {
            content: "";
            margin-right: 0;
          }
        }
        &::after {
          content: "/";
          margin-left: 5px;
        }
      }
    }
    .description {
      line-height: 1.3em;
      color: $font-color-secondary;
      margin-bottom: 20px;
    }
    .article-content {
      margin: 50px 0;
      box-shadow: none;
      background-color: transparent;
      .md-editor-preview-wrapper {
        .md-editor-preview {
          padding: 0;
        }
      }
    }
  }
  @media screen and (max-width: 1300px) {
    .article-view {
      width: 100%;
    }
  }
}
</style>
