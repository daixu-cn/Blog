<template>
  <div id="SystemFiles" class="system-page">
    <el-form
      ref="formRef"
      :inline="true"
      :model="formSearch"
      class="form-search"
      label-width="70px"
    >
      <el-form-item label="文件目录" prop="directorie">
        <el-cascader
          v-model="formSearch.directorie"
          :disabled="loading"
          :options="directories"
          :props="{ checkStrictly: true }"
          clearable
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
        <el-table-column prop="name" label="文件名" show-overflow-tooltip>
          <template #default="scope">
            <el-link :href="scope.row.path" target="_blank" type="primary">{{
              scope.row.name
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="size"
          label="文件大小"
          sortable
          show-overflow-tooltip
          :formatter="sizeFormatter"
        />
        <el-table-column
          prop="ctimeMs"
          label="更新时间"
          align="center"
          sortable
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" width="130">
          <template #header>
            <FileUpload
              @on-success="refuresh"
              @on-loading="_loading => (uploadLogin = _loading)"
            >
              <el-button
                class="operator"
                type="primary"
                :icon="Plus"
                :loading="uploadLogin"
                >上传文件</el-button
              >
            </FileUpload>
          </template>
          <template #default="scope">
            <div class="table-operator">
              <FileUpload
                :replace-files="scope.row.path"
                @on-success="refuresh"
                @on-loading="_loading => (loading = _loading)"
              >
                <el-button link type="primary"> 替换 </el-button>
              </FileUpload>

              <el-button
                link
                type="primary"
                @click="deleteAction(scope.row.path)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="table.page"
        v-model:page-size="table.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="table.total"
        small
        @current-change="getList"
        @size-change="getList(table.page)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { ElMessageBox, ElMessage } from "element-plus"
import type { FormInstance } from "element-plus"
import { Plus } from "@element-plus/icons-vue"
import dayjs from "dayjs"
import byteSize from "byte-size"
import http from "@/server"
import { Directories } from "./Files"
import FileUpload from "./FileUpload.vue"

const formRef = ref<FormInstance>()
const loading = ref(false)
const uploadLogin = ref(false)
const directories = ref([])
const formSearch = reactive<{ directorie: string[] }>({
  directorie: []
})
const table = reactive({
  list: [],
  page: 1,
  pageSize: 10,
  total: 0
})

function directorysFormat(directoryList: Directories[]) {
  return directoryList.map(item => {
    return {
      value: `/${item.name}`,
      label: item.name,
      children: directorysFormat(item.subDirectories)
    }
  })
}
function sizeFormatter(row) {
  const size = byteSize(row.size)
  return `${size.value}${size.unit}`
}

async function getDirectorys() {
  const res = await http.get("/file/directory", {
    path: "/upload"
  })

  if (res.code === 0) {
    directories.value = directorysFormat(res.data)
  }
}
async function getList(page = 1) {
  try {
    loading.value = true
    const res = await http.post("/file/list", {
      ...formSearch,
      directorie: formSearch.directorie.join(""),
      page,
      pageSize: table.pageSize
    })

    if (res.code === 0) {
      for (const item of res.data.list) {
        item.ctimeMs = dayjs(item.ctimeMs).format("L LTS")

        const size = byteSize(item.size)
        item.sizeFormat = `${size.value}${size.unit}`
      }
      table.list = res.data.list
      table.total = res.data.total
      table.page = page
    }
  } finally {
    loading.value = false
  }
}
function refuresh(path?: string) {
  if (path) {
    formSearch.directorie = ["/upload", "/*"]
  }

  getDirectorys()
  getList()
}
refuresh()

function reset() {
  formRef.value?.resetFields()
  table.pageSize = 10
  getList(1)
}
function deleteAction(path: string) {
  ElMessageBox.confirm("此操作将永久删除该文件，是否继续?", "提示", {
    type: "warning",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true
        const res = await http.delete(`/upload/file`, { path })
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

<style lang="scss">
#SystemFiles {
  .table-operator {
    div {
      display: inline;
    }
    .el-button:last-child {
      margin-left: 12px;
    }
  }
}
</style>
