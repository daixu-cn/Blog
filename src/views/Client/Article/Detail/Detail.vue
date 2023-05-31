<template>
  <div id="ArticleDetail">
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
          <h1 class="title">{{ info?.title }}</h1>
          <ul class="article-info">
            <li># {{ info?.category }}</li>
            <li>{{ info?.views.toLocaleString() }}访问</li>
            <li>{{ info?.comment_reply_total.toLocaleString() }}评论</li>
            <li>{{ info?.createdAt }}</li>
          </ul>
          <h6 class="description">{{ info?.description }}</h6>
          <Player v-if="info?.video" :src="info?.video" />
          <MdEditor
            :is-preview="true"
            :text="info?.content"
            @onGetCatalog="onGetCatalog"
          />
          <Comment :article-id="(articleId as string)" />
        </template>
      </el-skeleton>
    </div>

    <div class="catalog">
      <h1>目录</h1>
      <el-skeleton :loading="loading" animated>
        <template #template>
          <el-skeleton :rows="7" animated />
        </template>
        <template #default>
          <ul>
            <li
              v-for="(item, index) of catalog"
              :key="index"
              :data-level="item.level"
              :data-text="item.text"
              @click="goToAnchor(item.text)"
            >
              {{ item.text }}
            </li>
          </ul>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue"
import { useRoute, useRouter } from "vue-router"
import http from "@/server"
import Player from "@/components/Player.vue"
import MdEditor from "@/components/MdEditor.vue"
import { HeadList } from "md-editor-v3"
import Comment from "@/components/Comment/Comment.vue"
import { cloneDeep } from "lodash"
import { categories } from "@/global/select"
import dayjs from "dayjs"

const { articleId } = useRoute().params
const router = useRouter()
const loading = ref(true)
const info = ref()
const catalog = ref<HeadList[]>([])

async function getInfo() {
  loading.value = true
  const res = await http.get(`/article/info/${articleId}`)

  if (res.code === 0) {
    res.data.category = categories.find(
      (item) => item.value === res.data.category
    )?.label
    res.data.createdAt = dayjs(res.data.createdAt).fromNow()

    info.value = res.data
  } else {
    router.replace("/404")
  }
  loading.value = false
}
getInfo()

function onGetCatalog(list: HeadList[]) {
  if (list.length && list.length !== catalog.value.length - 1) {
    catalog.value = [
      ...list,
      {
        text: `全部评论(${info.value.comment_reply_total})`,
        level: 1
      }
    ]
    nextTick(() => {
      scrollHandler()
    })
  }
}
function scrollHandler() {
  window.addEventListener("scroll", () => {
    const contentSections = catalog.value.map(
      (item) => document.getElementById(item.text) as HTMLElement
    )
    for (const el of cloneDeep(contentSections).reverse()) {
      if (el.getBoundingClientRect().top <= 80) {
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
  })
}

function goToAnchor(text: string) {
  const { top } = (
    document.getElementById(text) as HTMLElement
  ).getBoundingClientRect()

  window.scrollBy({
    top: Math.ceil(top) - 80,
    behavior: "smooth"
  })
}
</script>

<style lang="scss">
#ArticleDetail {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: start;
  .article-view {
    width: calc(100% - 320px);
    margin-top: 20px;
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
      color: $font-color-secondary;
      margin-bottom: 20px;
    }
    & > #MdEditor {
      margin: 50px 0;
      .md-editor {
        box-shadow: none;
        background-color: transparent;
        .md-editor-preview-wrapper {
          .md-editor-preview {
            padding: 0;
          }
        }
      }
    }
  }
  .catalog {
    width: 300px;
    position: sticky;
    right: 0;
    top: 80px;
    border-radius: $border-radius;
    box-sizing: border-box;
    padding: 0 10px;
    h1 {
      position: relative;
      padding: 10px 20px 10px 25px;
      font-weight: 700;
      border-bottom: 1px solid $border-color;
      margin-bottom: 10px;
      margin-top: 0;
      color: var(--el-text-color-regular);
      &::before,
      &::after {
        content: "";
        position: absolute;
        width: 2px;
        height: 12px;
        background: $color-primary;
        top: 50%;
        transform: skew(-15deg) translateY(-50%);
        left: 4px;
        bottom: 10%;
      }
      &::after {
        left: 10px;
      }
    }
    ul {
      @include scrollbar(70vh);
      li {
        position: relative;
        box-sizing: border-box;
        padding: 0 8px 0 12px;
        line-height: 44px;
        border-radius: $border-radius;
        cursor: pointer;
        transition: all $duration;
        color: var(--el-text-color-regular);
        @include text-ellipsis;
        &::before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: transparent;
          position: absolute;
          left: 0;
          top: 50%;
          transform: scale(0) translateY(-50%);
          transition: all $duration;
        }
        &[data-level="2"] {
          margin-left: 15px;
          color: var(--el-color-info-light-2);
        }
        &[data-level="3"] {
          margin-left: 30px;
          color: var(--el-color-info-light-3);
        }
        &[data-level="4"] {
          margin-left: 45px;
          color: var(--el-color-info-light-4);
        }
        &[data-level="5"] {
          margin-left: 60px;
          color: var(--el-color-info-light-5);
        }
        &[data-level="6"] {
          margin-left: 75px;
          color: var(--el-color-info-light-6);
        }
        &:hover {
          color: $color-primary;
          &::before {
            background-color: $color-primary;
            transform: scale(1) translateY(-50%);
          }
        }
        &.active {
          color: $color-primary;
          &::before {
            background-color: $color-primary;
            transform: scale(1) translateY(-50%);
          }
        }
      }
    }
  }

  @media screen and (max-width: 1300px) {
    .article-view {
      width: 100%;
    }
    .catalog {
      display: none;
    }
  }
}
</style>
