<template>
  <div id="Article">
    <el-skeleton
      :loading="article.skeleton && article.page === 1"
      animated
      :count="5"
    >
      <template #template>
        <div class="article-container">
          <div class="article-list">
            <div class="article-item">
              <div class="article-info">
                <el-skeleton-item class="avatar" style="width: 50px" />
                <div class="header">
                  <el-skeleton-item
                    variant="h1"
                    style="width: 60%; max-width: 400px"
                  />
                  <ul>
                    <el-skeleton-item
                      variant="text"
                      style="width: 20%; max-width: 100px"
                    />
                    <el-skeleton-item
                      variant="text"
                      style="width: 20%; max-width: 100px; margin-left: 10px"
                    />
                  </ul>
                </div>
              </div>
              <el-skeleton-item variant="p" class="description" />
              <el-skeleton-item variant="p" class="description" />
              <el-skeleton-item variant="p" class="description" />
            </div>
          </div>
        </div>
      </template>
      <template #default>
        <InfiniteScroll
          :loading="article.loading"
          :is-over="article.list.length >= article.total"
          @on-load="getList"
        >
          <div class="article-container">
            <div v-auto-animate class="article-list">
              <div
                v-for="item of article.list"
                :key="item.articleId"
                class="article-item"
              >
                <div class="article-info">
                  <el-image
                    :src="item.poster ?? item.user?.avatar"
                    class="avatar"
                    :preview-src-list="[item.poster ?? item.user?.avatar]"
                    fit="cover"
                    :z-index="10"
                  />
                  <div class="header">
                    <h1 @click="goToDetail(item)">
                      {{ item.title }}
                    </h1>
                    <ul>
                      <li
                        class="category"
                        :class="{ active: item.category === search.category }"
                        @click="categoryChange(item.category)"
                      >
                        @{{ item.categoryFormat }}
                      </li>
                      <li>{{ item.createdAt }}</li>
                    </ul>
                  </div>
                </div>
                <p class="description" @click="goToDetail(item)">
                  {{ item.description }}
                </p>
                <Player
                  v-if="item.video"
                  :src="item.video"
                  :poster="item.poster"
                  @play.once="videoPlay(item.articleId)"
                />
                <ul class="views" @click="goToDetail(item)">
                  <li>
                    <i-ep-view />
                    <span>{{ item.views.toLocaleString() }}</span>
                  </li>
                  <li>
                    <i-ep-chatDotSquare />
                    <span>{{
                      item.disableComment
                        ? "--"
                        : item.comment_reply_total.toLocaleString()
                    }}</span>
                  </li>
                  <li v-if="item.isPrivate">
                    <i-ep-knifeFork />
                    <span>私有文章</span>
                  </li>
                  <li v-if="item.isLock">
                    <i-ep-unlock />
                    <span>{{ item.unlockAt }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </InfiniteScroll>
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import { useRouter } from "vue-router"
import dayjs from "dayjs"
import { ElMessage } from "element-plus"
import http from "@/server"
import { categories } from "@/global/select"
import Player from "@/components/Player.vue"
import useUserStore from "@/store/user"
import InfiniteScroll from "@/components/InfiniteScroll.vue"

const userStore = useUserStore()
const router = useRouter()
const search = reactive({
  category: ""
})
const article = reactive<any>({
  skeleton: true,
  loading: false,
  list: [],
  page: 1,
  total: 0
})

async function getList(page = article.page) {
  article.page = page

  try {
    if (page === 1) {
      article.skeleton = true
    } else {
      article.loading = true
    }
    const res = await http.post("/article/list", {
      ...search,
      page,
      pageSize: 10
    })

    if (res.code === 0) {
      for (const item of res.data.list) {
        item.categoryFormat = categories.find(
          category => category.value === item.category
        )?.label
        item.isLock = dayjs().isBefore(item.unlockAt)
        item.unlockAt = dayjs(item.unlockAt).format("L LTS")
        item.createdAt = dayjs(item.createdAt).fromNow()
        item.updatedAt = dayjs(item.updatedAt).fromNow()
      }

      if (page === 1) {
        article.list = res.data.list
      } else {
        article.list.push(...res.data.list)
      }

      article.total = res.data.total
    }
  } finally {
    article.skeleton = false
    article.loading = false

    article.page++
  }
}
getList()

function categoryChange(category: string) {
  search.category = search.category === category ? "" : category
  getList(1)
}

async function videoPlay(articleId: string) {
  http.get(`/article/info/${articleId}`)
}

function goToDetail(article) {
  if (article.isPrivate && userStore.info?.role !== 0) {
    ElMessage.warning("私有文章，您没有访问权限～")
  } else if (article.isLock && userStore.info?.role !== 0) {
    ElMessage.warning(`该文章将在 ${article.unlockAt} 解锁`)
  } else {
    router.push({
      name: "ArticleDetail",
      params: { articleId: article.articleId }
    })
  }
}
</script>

<style lang="scss">
#Article {
  .article-container {
    display: flex;
    justify-content: space-between;
    .article-list {
      width: 100%;
      .article-item {
        padding: $space;
        margin-bottom: $space;
        border-radius: $border-radius;
        border-bottom: $border;
        &:last-child {
          margin-bottom: 0;
          border-bottom: none;
        }
        &:has(.description) {
          &:hover {
            .article-info {
              .header {
                h1 {
                  color: $color-primary;
                }
              }
            }
            .description {
              color: $font-color-secondary;
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
              cursor: pointer;
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
              .category {
                position: relative;
                transition: all $duration;
                cursor: pointer;
                display: flex;
                align-items: center;
                &::after {
                  content: "";
                  position: absolute;
                  left: 0;
                  bottom: -5px;
                  display: inline-block;
                  width: 0;
                  border-bottom: 1px dashed $color-primary;
                  transition: all $duration;
                }
                &:hover,
                &.active {
                  color: $color-primary;
                  &::after {
                    width: 100%;
                  }
                }
              }
            }
          }
        }
        .description {
          line-height: 1.3em;
          color: $font-color-placeholder;
          margin-bottom: $space;
          cursor: pointer;
          transition: color $duration;
        }
        #Player {
          margin-bottom: $space;
        }
        .views {
          display: flex;
          li {
            color: $font-color-secondary;
            display: flex;
            align-items: center;
            margin-right: $space;
            cursor: pointer;
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
  }
}
</style>
