<template>
  <div id="SystemUpdates" class="system-page">
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
          placeholder="更新ID/内容"
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
      <el-table :data="table.list">
        <el-table-column
          prop="content"
          label="更新内容"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createdAt"
          label="创建时间"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="updatedAt"
          label="更新时间"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" width="130">
          <template #header>
            <el-button
              type="primary"
              :icon="Plus"
              class="operator"
              @click="actionDialogRef && actionDialogRef.openDialog()"
              >创建更新</el-button
            >
          </template>
          <template #default="scope">
            <el-button link type="primary" @click="editAction(scope.row)">
              编辑
            </el-button>
            <el-button
              link
              type="primary"
              @click="deleteAction(scope.row.updateId)"
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
    <ActionDialog ref="actionDialogRef" @confirm="getList" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { ElMessageBox, ElMessage } from "element-plus"
import type { FormInstance } from "element-plus"
import { Plus } from "@element-plus/icons-vue"
import dayjs from "dayjs"
import http from "@/server"
import ActionDialog from "./ActionDialog.vue"

const formRef = ref<FormInstance>()
const actionDialogRef = ref<InstanceType<typeof ActionDialog>>()
const loading = ref(false)
const formSearch = reactive({
  keyword: "",
  startTime: "",
  endTime: ""
})
const table = reactive({
  list: [],
  page: 1,
  pageSize: 10,
  total: 0
})

async function getList(page = 1) {
  try {
    loading.value = true
    const res = await http.post("/update/list", {
      ...formSearch,
      page,
      pageSize: table.pageSize
    })

    if (res.code === 0) {
      for (const item of res.data.list) {
        item.updatedAt = dayjs(item.updatedAt).format("L LTS")
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

function editAction(row) {
  if (actionDialogRef.value) {
    const { list } = actionDialogRef.value
    list.splice(0, list.length, ...row.content.split("\t"), "")
    actionDialogRef.value.updateId = row.updateId
    actionDialogRef.value.openDialog()
  }
}
function deleteAction(updateId) {
  ElMessageBox.confirm("此操作将永久删除该更新，是否继续?", "提示", {
    type: "warning",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true
        const res = await http.delete(`/update/${updateId}`)
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
</script>
