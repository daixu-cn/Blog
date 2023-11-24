<template>
  <div id="SystemArticle" class="system-page">
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
          placeholder="ID/文件地址/描述"
          @keydown.enter="getList(1)"
        />
      </el-form-item>
      <el-form-item label="文件类型" prop="mediaType">
        <el-select
          v-model="formSearch.mediaType"
          placeholder="请选择文件类型"
          :disabled="loading"
          clearable
          @change="getList(1)"
        >
          <el-option
            v-for="item of lemonMediaType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
          prop="path"
          label="媒体文件"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="mediaType"
          label="文件类型"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="description"
          label="描述"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="updatedAt"
          label="更新时间"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createdAt"
          label="创建时间"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" width="165">
          <template #header>
            <ActionUpload @reset="reset" />
          </template>
          <template #default="scope">
            <el-button link type="primary" @click="editAction(scope.row)">
              编辑
            </el-button>
            <el-button
              link
              type="primary"
              @click="deleteAction(scope.row.lemonId)"
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
    <EditDialog ref="editDialogRef" @confirm="getList" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { ElMessageBox, ElMessage } from "element-plus"
import type { FormInstance } from "element-plus"
import dayjs from "dayjs"
import http from "@/server"
import { lemonMediaType } from "@/global/select"
import EditDialog from "./EditDialog.vue"
import ActionUpload from "./ActionUpload/ActionUpload.vue"

const formRef = ref<FormInstance>()
const editDialogRef = ref<InstanceType<typeof EditDialog>>()
const loading = ref(false)
const formSearch = reactive({
  keyword: "",
  mediaType: "",
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
    const res = await http.post("/lemon/list", {
      ...formSearch,
      page,
      pageSize: table.pageSize
    })

    if (res.code === 0) {
      table.list = res.data.list.map(item => {
        return {
          ...item,
          mediaType: lemonMediaType.find(
            mediaType => mediaType.value === item.mediaType
          )?.label,
          updatedAt: dayjs(item.updatedAt).format("L LTS"),
          createdAt: dayjs(item.createdAt).format("L LTS")
        }
      })
      table.page = page
      table.total = res.data.total
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
function deleteAction(lemonId: string) {
  ElMessageBox.confirm("此操作将永久删除该柠檬记录，是否继续?", "提示", {
    type: "warning",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true
        const res = await http.delete(`/lemon/${lemonId}`)
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

function editAction(row) {
  if (editDialogRef.value) {
    for (const key in editDialogRef.value.form) {
      editDialogRef.value.form[key] = row[key]
    }
    editDialogRef.value?.openDialog()
  }
}
</script>
