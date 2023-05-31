<template>
  <div id="Community-Comment">
    <h1 :id="`全部${type}(${allTotal})`" class="total">
      全部{{ type }}({{ allTotal }})
    </h1>
    <MdEditor
      ref="mdEditor"
      :preview="false"
      :is-upload="false"
      :placeholder="`${type}内容(支持 Markdown 语法)`"
      :style="{ height: '300px' }"
    />
    <div class="submitComment">
      <el-button
        type="primary"
        :loading="commentLoading"
        plain
        @click="submitComment"
      >
        提交{{ type }}
      </el-button>
    </div>

    <el-skeleton :loading="skeletonLoading && page === 1" animated :count="3">
      <template #template>
        <div class="comment-item">
          <el-skeleton-item variant="image" class="avatar" />
          <div class="comment-content">
            <div class="info">
              <el-skeleton-item
                variant="text"
                class="userName"
                style="width: 100px"
              />
              <el-skeleton-item
                variant="text"
                class="timer"
                style="width: 60px"
              />
            </div>
            <el-skeleton-item
              variant="text"
              class="content"
              style="height: 80px"
            />
          </div>
        </div>
      </template>
      <template #default>
        <div v-for="item of list" :key="item.commentId" class="comment-item">
          <el-image
            :src="item.user.avatar"
            :preview-src-list="[item.user.avatar]"
            fit="cover"
            preview-teleported
            class="avatar"
          >
            <template #error>
              <div class="image-slot">
                <i-ep-picture />
              </div>
            </template>
          </el-image>
          <div class="comment-content">
            <div class="info">
              <p class="user-row">
                <span class="userName">{{ item.user.userName }}</span>
                <i-ep-promotion
                  class="reply-icon"
                  @click="replyHandler(item, undefined, item.user.userName)"
                />
              </p>
              <p class="timer">{{ item.createdAt }}</p>
            </div>
            <MdEditor
              class="content"
              :is-preview="true"
              :text="item.content"
              :style="{ maxHeight: '300px' }"
            />

            <div
              v-for="reply of item.replies"
              :key="reply.replyId"
              class="comment-item reply-item"
            >
              <el-image
                :src="reply.user.avatar"
                :preview-src-list="[reply.user.avatar]"
                fit="cover"
                preview-teleported
                class="avatar"
              >
                <template #error>
                  <div class="image-slot">
                    <i-ep-picture />
                  </div>
                </template>
              </el-image>
              <div class="comment-content">
                <div class="info">
                  <p class="user-row">
                    <span class="userName">{{ reply.user.userName }}</span>
                    <i-ep-promotion
                      class="reply-icon"
                      @click="
                        replyHandler(item, reply.replyId, reply.user.userName)
                      "
                    />
                  </p>
                  <p class="timer">
                    <span class="replyUser"
                      >回复@{{ reply.parent.userName }}</span
                    >{{ reply.createdAt }}
                  </p>
                </div>
                <MdEditor
                  class="content"
                  :is-preview="true"
                  :text="reply.content"
                  :style="{ maxHeight: '300px' }"
                />
              </div>
            </div>

            <div class="loadMore">
              <el-button
                v-if="item.replies.length < item.replyTotal"
                type="primary"
                text
                :loading="item.replyLoading"
                @click="loadReply(item)"
                >加载更多</el-button
              >
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
    <div ref="footer" class="footer">
      <Loading :loading="loading" />
    </div>
    <ReplyDialog ref="replyDialog" @confirm="loadReply" />
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, computed } from "vue"
import http from "@/server"
import dayjs from "dayjs"
import { useIntersectionObserver } from "@vueuse/core"
import Loading from "@/components/Loading.vue"
import MdEditor from "@/components/MdEditor.vue"
import { ElMessage } from "element-plus"
import useUserStore from "@/store/user"
import ReplyDialog from "./ReplyDialog.vue"

const props = defineProps({
  articleId: {
    type: String,
    default: "-1"
  }
})

const type = computed(() => (props.articleId === "-1" ? "留言" : "评论"))
const userStore = useUserStore()
const mdEditor = ref()
const replyDialog = ref()
const footer = ref()
const list = ref<any[]>([])
const skeletonLoading = ref(true)
const commentLoading = ref(false)
const loading = ref(false)
const page = ref(1)
// 评论总数
const total = ref(0)
// 评论 + 回复总数
const allTotal = ref(0)

async function getList(refresh = false) {
  try {
    if (page.value === 1) {
      skeletonLoading.value = true
    } else {
      loading.value = true
    }
    const res = await http.post("/comment/list", {
      articleId: props.articleId,
      page: refresh ? page.value - 1 : page.value,
      pageSize: 10
    })

    if (res.code === 0) {
      for (const item of res.data.list) {
        item.createdAt = dayjs(item.createdAt).fromNow()
        item.replyPage = 1
        for (const reply of item.replies) {
          reply.createdAt = dayjs(reply.createdAt).fromNow()
        }
      }

      list.value = [
        ...list.value,
        ...res.data.list.filter((item) => {
          return !list.value.find(
            (comment) => comment.commentId === item.commentId
          )
        })
      ]
      total.value = res.data.total
      allTotal.value = res.data.comment_reply_total

      nextTick(() => {
        const { stop } = useIntersectionObserver(
          footer,
          ([{ isIntersecting }]) => {
            stop()
            if (isIntersecting) {
              if (list.value.length < total.value && res.data.list.length) {
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
    if (list.value.length >= total.value) {
      stop()
    }
    if (!refresh) {
      page.value++
    }
  }
}
getList()

async function submitComment() {
  if (!userStore.token) {
    ElMessage.warning("未登录")
    return
  }
  const content = mdEditor.value?.text
  if (!content) {
    ElMessage.warning("留言内容不能为空")
    return
  }

  commentLoading.value = true
  const res = await http.put("/comment/create", {
    articleId: props.articleId,
    content
  })
  if (res.code === 0) {
    ElMessage.success("留言成功")
    mdEditor.value.text = ""
    getList(true)
  }
  commentLoading.value = false
}

async function loadReply(comment, refresh = false) {
  comment.replyLoading = true
  const res = await http.post("/reply/list", {
    commentId: comment.commentId,
    page: comment.replyPage
  })
  if (res.code === 0 && res.data.list?.length) {
    for (const item of res.data.list) {
      item.createdAt = dayjs(item.createdAt).fromNow()
    }

    comment.replies = [
      ...comment.replies,
      ...res.data.list.filter((item) => {
        return !comment.replies.find((reply) => reply.replyId === item.replyId)
      })
    ]
    if (refresh) {
      allTotal.value++
    } else {
      comment.replyPage += 1
    }
  }
  comment.replyLoading = false
}

function replyHandler(comment, parentId?: string, userName?: string) {
  replyDialog.value.comment = comment
  replyDialog.value.reply.userName = userName
  replyDialog.value.reply.commentId = comment.commentId
  replyDialog.value.reply.parentId = parentId
  replyDialog.value.show = true
}

const { stop } = useIntersectionObserver(footer, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    if (list.value.length < total.value) {
      getList()
    }
  }
})
</script>

<style lang="scss">
#Community-Comment {
  .total {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 30px;
  }

  .submitComment {
    display: flex;
    justify-content: flex-end;
    margin: 20px 0 50px 0;
    .el-button {
      width: 100%;
    }
  }
  .comment-item {
    display: flex;
    justify-content: space-between;
    &:last-child {
      margin-bottom: 0;
    }

    .avatar {
      width: 46px;
      height: 46px;
      object-fit: contain;
      border-radius: $border-radius;
    }
    .comment-content {
      width: calc(100% - 56px);
      .info {
        height: 46px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-bottom: 15px;
        .user-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .userName {
            display: inline-block;
            max-width: calc(100% - 50px);
            @include text-ellipsis;
          }
          .reply-icon {
            cursor: pointer;
            color: $font-color-secondary;
            transition: color $duration;
            &:hover {
              color: $color-primary;
            }
          }
        }
        .timer {
          color: $font-color-placeholder;
          .replyUser {
            display: inline-block;
            max-width: calc(100% - 100px);
            color: $color-primary;
            margin-right: 10px;
            @include text-ellipsis;
          }
        }
      }
      .content {
        margin-bottom: 25px;
        .md-editor {
          box-shadow: none;
          background-color: transparent;
          .md-editor-preview-wrapper {
            padding: 0;
          }
        }
      }
    }
    .loadMore {
      margin-bottom: 25px;
      @include flex-center;
      .el-button {
        color: $font-color-placeholder;
        background-color: transparent;
      }
    }
  }

  .footer {
    margin-bottom: 20px;
  }
}
</style>
