<template>
  <div id="SystemComments" class="system-page">
    <el-form
      ref="formRef"
      :inline="true"
      :model="formSearch"
      class="form-search"
      label-width="70px"
    >
      <el-form-item label="关键字" prop="keyword">
        <el-input
          v-model="formSearch.keyword"
          :disabled="loading"
          placeholder="评论ID/用户ID/评论内容"
          @keydown.enter="getList(1)"
        />
      </el-form-item>
      <el-form-item label="文章ID" prop="articleId">
        <el-input
          v-model="formSearch.articleId"
          :disabled="loading"
          placeholder="请输入文章ID"
          @keydown.enter="getList(1)"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="formSearch.startTime"
          type="date"
          placeholder="请选择开始时间"
          :disabled="loading"
          @change="getList(1)"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="formSearch.endTime"
          type="date"
          placeholder="请选择结束时间"
          :disabled="loading"
          @change="getList(1)"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          class="query-reset"
          @click="getList(1)"
          >查询</el-button
        >
        <el-button :loading="loading" class="query-reset" @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div v-loading="loading" class="table">
      <el-table
        :data="table.list"
        row-key="commentId"
        :row-class-name="rowClassHandler"
        :expand-row-keys="[expandRowId]"
        @expand-change="expandChange"
        @row-click="rowClick"
      >
        <el-table-column type="expand">
          <template #default="">
            <div v-loading="reply.loading" class="replies">
              <el-table :data="reply.list">
                <el-table-column label="用户头像" align="center">
                  <template #default="scope">
                    <el-image
                      :src="scope.row.user.avatar"
                      :preview-src-list="[scope.row.user.avatar]"
                      fit="cover"
                      class="avatar"
                      preview-teleported
                    >
                      <template #error>
                        <el-avatar>
                          <i-ep-userFilled />
                        </el-avatar>
                      </template>
                    </el-image>
                  </template>
                </el-table-column>
                <el-table-column label="用户名" align="center">
                  <template #default="scope">
                    {{ scope.row.user.userName }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="content"
                  label="回复内容"
                  align="center"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="createdAt"
                  label="回复时间"
                  align="center"
                  show-overflow-tooltip
                />
                <el-table-column label="操作" align="center" width="100">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      @click="deleteReply(scope.row.replyId)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-model:current-page="reply.page"
                small
                :page-size="reply.pageSize"
                layout="total, prev, pager, next"
                :total="reply.total"
                @current-change="getReply"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户头像" align="center">
          <template #default="scope">
            <el-image
              :src="scope.row.user.avatar"
              :preview-src-list="[scope.row.user.avatar]"
              fit="cover"
              class="avatar"
              preview-teleported
            >
              <template #error>
                <el-avatar>
                  <i-ep-userFilled />
                </el-avatar>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template #default="scope">
            {{ scope.row.user.userName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="articleId"
          label="文章/留言板"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-link
              v-if="scope.row.article"
              :href="`/article/${scope.row.article.articleId}`"
              target="_blank"
              type="primary"
              >{{ scope.row.article.title }}</el-link
            >
            <span v-else>留言板</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="评论内容"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createdAt"
          label="评论时间"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" width="100">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="deleteComment(scope.row.commentId)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="table.page"
        small
        :page-size="table.pageSize"
        layout="total, prev, pager, next"
        :total="table.total"
        @current-change="getList"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { ElMessageBox, ElMessage } from "element-plus"
import type { FormInstance } from "element-plus"
import dayjs from "dayjs"
import http from "@/server"

const formRef = ref<FormInstance>()
const loading = ref(false)
const formSearch = reactive({
  keyword: "",
  articleId: "",
  startTime: "",
  endTime: ""
})
const table = reactive({
  list: [],
  page: 1,
  pageSize: 10,
  total: 0
})
const reply = reactive({
  loading: false,
  list: [],
  page: 1,
  pageSize: 10,
  total: 0
})
const expandRowId = ref("")

function rowClassHandler({ row }) {
  if (row?.replyTotal === 0) {
    return "hiddenExpand"
  }
}
function expandChange(row) {
  if (expandRowId.value === row.commentId) {
    reply.list = []
    reply.page = 1
    reply.pageSize = 10
    reply.total = 0
    expandRowId.value = ""
  } else {
    expandRowId.value = row.commentId
    getReply()
  }
}
function rowClick(row) {
  if (row.replyTotal > 0) {
    expandChange(row)
  }
}
async function getReply(page = 1) {
  reply.loading = true
  const res = await http.post("/reply/list", {
    commentId: expandRowId.value,
    page,
    pageSize: reply.pageSize
  })
  if (res.code === 0) {
    for (const item of res.data.list) {
      item.createdAt = dayjs(item.createdAt).format("L LTS")
    }
    reply.list = res.data.list
    reply.total = res.data.total
    reply.page = page
  }
  reply.loading = false
}

async function getList(page = 1) {
  try {
    loading.value = true
    const res = await http.post("/comment/list", {
      ...formSearch,
      page,
      pageSize: table.pageSize
    })

    if (res.code === 0) {
      for (const item of res.data.list) {
        item.page = 1
        item.pageSize = 10
        item.total = item.replyTotal
        item.createdAt = dayjs(item.createdAt).format("L LTS")
      }

      table.list = res.data.list
      table.total = res.data.total
      table.page = page
    }
  } finally {
    loading.value = false
  }
}
getList()

function reset() {
  formRef.value?.resetFields()
  getList(1)
}

function deleteComment(commentId: string) {
  ElMessageBox.confirm("此操作将永久删除该评论，是否继续?", "提示", {
    type: "warning",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true
        const res = await http.delete(`/comment/${commentId}`)
        if (res.code === 0) {
          done()
        }
        instance.confirmButtonLoading = false
      } else {
        done()
      }
    }
  }).then(() => {
    ElMessage.success("删除成功")
    getList()
  })
}
function deleteReply(replyId) {
  ElMessageBox.confirm("此操作将永久删除该回复，是否继续?", "提示", {
    type: "warning",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true
        const res = await http.delete(`/reply/${replyId}`)
        if (res.code === 0) {
          done()
        }
        instance.confirmButtonLoading = false
      } else {
        done()
      }
    }
  }).then(() => {
    ElMessage.success("删除成功")
    getReply()
  })
}
</script>

<style lang="scss">
#SystemComments {
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .hiddenExpand {
    .el-table__expand-column {
      .el-table__expand-icon {
        display: none;
      }
    }
  }
  .replies {
    box-sizing: border-box;
    h3 {
      font-size: 1.35rem;
      margin-bottom: 1em;
      font-weight: 700;
    }
    .el-table {
      border: 0 !important;
      .el-table__header-wrapper thead tr th {
        background-color: transparent !important;
        padding: 8px 0 !important;
      }
    }
  }
}
</style>
