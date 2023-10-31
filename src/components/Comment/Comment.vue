<template>
  <div v-if="!props.disable" id="Community-Comment">
    <h1 :id="`${type}(${allTotal})`" class="total">
      {{ type }}({{ allTotal }})
    </h1>

    <MdEditor
      ref="MdEditorRef"
      :preview="false"
      :image-base64="true"
      placeholder="内容(支持 Markdown 语法)"
      :style="{ height: '300px' }"
      @on-save="submitComment"
    />
    <div class="submitComment">
      <el-button
        type="primary"
        :loading="commentLoading"
        plain
        @click="MdEditorRef?.Editor?.triggerSave()"
      >
        {{ props.articleId === "-1" ? "提交留言" : "提交评论" }}
      </el-button>
    </div>

    <el-skeleton :loading="skeletonLoading && page === 1" animated :count="3">
      <template #template>
        <div class="comment-container">
          <div class="comment-item">
            <el-skeleton-item variant="image" class="avatar" />
            <div class="comment-info">
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
        </div>
      </template>
      <template #default>
        <div v-auto-animate class="comment-container">
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
            <div v-auto-animate class="comment-info">
              <div class="info">
                <p class="user-row">
                  <span class="userName"
                    >{{ item.user.userName
                    }}<i v-if="item.user.role === 0" class="admin"
                      >管理员</i
                    ></span
                  >
                  <span>
                    <i-ep-promotion
                      class="reply-icon"
                      @click="replyHandler(item, undefined, item.user.userName)"
                    />
                    <i-ep-deleteFilled
                      v-if="userStore.info?.userId === item.user.userId"
                      class="delete-icon"
                      @click="deleteHandler(0, item, item.commentId)"
                    />
                  </span>
                </p>
                <p class="timer">{{ item.createdAt }}</p>
              </div>
              <MdEditor
                image-align="left"
                :is-preview="true"
                :text="item.content"
                :style="{ maxHeight: '400px' }"
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
                <div class="comment-info">
                  <div class="info">
                    <p class="user-row">
                      <span class="userName"
                        >{{ reply.user.userName
                        }}<i v-if="reply.user.role === 0" class="admin"
                          >管理员</i
                        ></span
                      >
                      <span>
                        <i-ep-promotion
                          class="reply-icon"
                          @click="
                            replyHandler(
                              item,
                              reply.replyId,
                              reply.user.userName
                            )
                          "
                        />
                        <i-ep-deleteFilled
                          v-if="userStore.info?.userId === reply.user.userId"
                          class="delete-icon"
                          @click="deleteHandler(1, item, reply.replyId)"
                        />
                      </span>
                    </p>
                    <p class="timer">
                      <span class="replyUser"
                        >回复@{{ reply.parent.userName }}</span
                      >{{ reply.createdAt }}
                    </p>
                  </div>
                  <MdEditor
                    image-align="left"
                    :is-preview="true"
                    :text="reply.content"
                    :style="{ maxHeight: '400px' }"
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
import dayjs from "dayjs"
import { useIntersectionObserver } from "@vueuse/core"
import { ElMessage, ElMessageBox } from "element-plus"
import http from "@/server"
import Loading from "@/components/Loading.vue"
import MdEditor from "@/components/MdEditor.vue"
import useUserStore from "@/store/user"
import ReplyDialog from "./ReplyDialog.vue"

const props = defineProps({
  articleId: {
    type: String,
    default: "-1"
  },
  // 禁止评论
  disable: {
    type: Boolean,
    default: false
  }
})

const type = computed(() =>
  props.articleId === "-1" ? "全部留言" : "全部评论"
)
const userStore = useUserStore()
const MdEditorRef = ref<InstanceType<typeof MdEditor>>()
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
      page: refresh ? 1 : page.value,
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

      list.value = refresh
        ? res.data.list
        : [
            ...list.value,
            ...res.data.list.filter(item => {
              return !list.value.find(
                comment => comment.commentId === item.commentId
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

async function submitComment(content: string, html: string) {
  if (!userStore.token) {
    ElMessage.warning("未登录")
    return
  }
  if (!content) {
    ElMessage.warning("回复内容不能为空")
    return
  }

  commentLoading.value = true
  const res = await http.put("/comment/create", {
    articleId: props.articleId,
    content,
    html
  })
  if (res.code === 0) {
    ElMessage.success(props.articleId === "-1" ? "留言成功" : "评论成功")
    MdEditorRef.value?.reset()
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
      ...res.data.list.filter(item => {
        return !comment.replies.find(reply => reply.replyId === item.replyId)
      })
    ]

    const { length } = res.data.list
    if (refresh) {
      allTotal.value++
    } else if (
      Number.isInteger(length / 10) ||
      Number.isInteger((length + 1) / 10)
    ) {
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

/**
 * @description 删除评论/回复
 * @param {number} type 类型：0评论、1回复
 * @param {any} comment 评论信息
 * @param {string} id 评论/回复ID
 */
function deleteHandler(type: number, comment, id: string) {
  ElMessageBox.confirm("此操作将永久删除该记录,是否继续?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        try {
          instance.confirmButtonLoading = true

          const res = await http.delete(
            type === 0 ? `/comment/${id}` : `/reply/${id}`
          )
          if (res.code === 0) {
            done()
          }
        } finally {
          instance.confirmButtonLoading = false
        }
      } else {
        done()
      }
    }
  }).then(() => {
    ElMessage.success("操作成功")
    if (type === 0) {
      getList(true)
    } else {
      comment.replies.splice(
        comment.replies.findIndex(item => item.replyId === id),
        1
      )
      loadReply(comment, true)
    }
  })
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
  --padding-space: 8px;

  .total {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 30px;
  }
  > #MdEditor {
    box-sizing: border-box;
    padding: var(--padding-space);
  }
  .submitComment {
    display: flex;
    justify-content: flex-end;
    margin: 20px 0 50px 0;
    box-sizing: border-box;
    padding: var(--padding-space);
    .el-button {
      width: 100%;
    }
  }

  .comment-container {
    box-sizing: border-box;
    padding: var(--padding-space);
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
        .image-slot {
          width: 100%;
          height: 100%;
          background-color: var(--el-text-color-disabled);
          color: white;
          @include flex-center;
        }
      }
      .comment-info {
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
              max-width: calc(100% - 60px);
              @include text-ellipsis;
              .admin {
                color: $color-primary;
                font-size: calc(1em - 2px);
                font-style: italic;
                margin-left: 5px;
              }
            }
            .reply-icon,
            .delete-icon {
              cursor: pointer;
              color: $font-color-secondary;
              transition: color $duration;
              &:hover {
                color: $color-primary;
              }
            }
            .delete-icon {
              margin-left: 10px;
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
        .md-editor-previewOnly {
          margin-bottom: 25px;
          box-shadow: none;
          background-color: transparent;
          .md-editor-preview-wrapper {
            padding: 0;
            img {
              max-height: 200px;
            }
            p,
            figure {
              margin: 0;
              &:not(:last-child) {
                margin: 0 0 $space 0;
              }
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
  }
  .footer {
    margin-bottom: 20px;
  }
}
@media screen and (max-width: 1250) {
  #Community-Comment {
    --padding-space: 0;
  }
}
</style>
