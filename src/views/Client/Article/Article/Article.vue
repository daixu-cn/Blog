<template>
  <div id="Article">
    <el-skeleton :loading="skeletonLoading && page === 1" animated>
      <template #template>
        <el-timeline>
          <el-timeline-item v-for="item of 8" :key="item">
            <el-skeleton-item variant="h3" />
            <br />
            <el-skeleton-item variant="text" />
          </el-timeline-item>
        </el-timeline>
      </template>
      <template #default>
        <div class="article-container">
          <div v-for="item of list" :key="item.articleId" class="article-item">
            <div
              class="article-info"
              @click="goToPage('ArticleDetail', { articleId: item.articleId })"
            >
              <img :src="item.user.avatar" class="avatar" />
              <div class="header">
                <h1>{{ item.title }}</h1>
                <ul>
                  <li>@{{ item.category }}</li>
                  <li>{{ item.createdAt }}</li>
                </ul>
              </div>
            </div>
            <p
              class="description"
              @click="goToPage('ArticleDetail', { articleId: item.articleId })"
            >
              {{ item.description }}
            </p>
            <Player v-if="item.video" :src="item.video" :poster="item.poster" />
            <ul class="views">
              <li>
                <i-ep-view />
                <span>{{ item.views.toLocaleString() }}</span>
              </li>
              <li>
                <i-ep-chatDotSquare />
                <span>{{ item.comment_reply_total.toLocaleString() }}</span>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </el-skeleton>
    <div ref="footer" class="footer">
      <Loading :loading="loading" />
      <p v-if="list.length >= total && !skeletonLoading" class="loadingEnd">
        {{ $t("state.loadEnd") }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick } from "vue"
import { useRouter } from "vue-router"
import http from "@/server"
import dayjs from "dayjs"
import { useIntersectionObserver } from "@vueuse/core"
import Loading from "@/components/Loading.vue"
import { categories } from "@/global/select"
import i18n from "@/locale"
import Player from "@/components/Player.vue"

const router = useRouter()
const footer = ref()
const list = reactive<any[]>([])
const skeletonLoading = ref(true)
const loading = ref(false)
const page = ref(1)
const total = ref(0)

async function getList() {
  try {
    if (page.value === 1) {
      skeletonLoading.value = true
    } else {
      loading.value = true
    }
    const res = await http.post("/article/list", {
      page: page.value,
      pageSize: 20
    })

    if (res.code === 0) {
      list.push(
        ...res.data.list.map((item) => {
          return {
            ...item,
            category: i18n.global.t(
              categories.find((category) => category.value)?.label as string
            ),
            createdAt: dayjs(item.createdAt).fromNow(),
            updatedAt: dayjs(item.updatedAt).fromNow()
          }
        })
      )
      total.value = res.data.total

      nextTick(() => {
        const { stop } = useIntersectionObserver(
          footer,
          ([{ isIntersecting }]) => {
            stop()
            if (isIntersecting) {
              if (list.length < total.value) {
                getList()
              }
            }
          }
        )
      })
    }
  } finally {
    if (page.value === 1) {
      skeletonLoading.value = false
    } else {
      loading.value = false
    }
    if (list.length >= total.value) {
      stop()
    }
    page.value++
  }
}
getList()

const { stop } = useIntersectionObserver(footer, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    if (list.length < total.value) {
      getList()
    }
  }
})

function goToPage(name, params) {
  router.push({ name, params })
}
</script>

<style lang="scss">
#Article {
  .article-container {
    .article-item {
      cursor: pointer;
      padding: $space 0;
      margin-bottom: $space;
      &:last-child {
        margin-bottom: 0;
      }
      &:hover {
        .article-info {
          .header {
            h1 {
              color: $color-primary;
            }
          }
        }
      }
      .article-info {
        height: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $space;
        .avatar {
          height: 50px;
          aspect-ratio: 1;
          border-radius: $border-radius;
          object-fit: cover;
        }
        .header {
          width: calc(100% - 60px);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          h1 {
            transition: all $duration;
            @include text-ellipsis;
          }
          ul {
            display: flex;
            color: $font-color-placeholder;
            li {
              margin-right: $space;
              &:last-child {
                margin-right: 0;
              }
            }
          }
        }
      }
      .description {
        line-height: 1.3em;
        color: $font-color-placeholder;
        margin-bottom: $space;
      }
      #Player {
        margin-bottom: $space;
      }
      .views {
        display: flex;
        justify-content: flex-end;
        li {
          color: $font-color-secondary;
          display: flex;
          align-items: center;
          margin-right: $space;
          &:last-child {
            margin-right: 0;
          }
          span {
            margin-left: 5px;
          }
        }
      }
    }
  }
  .footer {
    margin-bottom: 20px;
    .loadingEnd {
      text-align: center;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
