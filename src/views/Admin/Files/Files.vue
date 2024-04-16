<template>
  <div id="SystemFiles" class="system-page">
    <el-form
      ref="formRef"
      :inline="true"
      :model="formSearch"
      class="form-search"
    >
      <el-form-item label="关键字" prop="keyword">
        <el-input
          v-model="formSearch.keyword"
          :disabled="loading"
          placeholder="文件名"
          @keydown.enter="getList(1)"
        />
      </el-form-item>
      <el-form-item label="目录" prop="directory">
        <el-cascader
          v-model="formSearch.directory"
          :disabled="loading"
          :options="directories"
          :props="{ checkStrictly: true }"
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
        <el-table-column prop="name" label="" width="50px" align="center">
          <template #header>
            <div
              v-if="formSearch.directory.length"
              class="icon back"
              @click="back"
            >
              <Icon class="icon-back" size="1.3em" />
            </div>
          </template>
          <template #default="scope">
            <div class="icon">
              <Icon :class="scope.row.icon" size="23px" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="文件名" show-overflow-tooltip>
          <template #default="scope">
            <el-link
              target="_blank"
              type="primary"
              @click="jumpTo(scope.row)"
              >{{ scope.row.name }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="size" label="文件大小" width="120px" />
        <el-table-column
          prop="lastModified"
          label="更新时间"
          align="center"
          width="200px"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" width="130">
          <template #header>
            <MediaUpload
              :params="{ path: formSearch.directory }"
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
            </MediaUpload>
          </template>
          <template #default="scope">
            <div v-if="!scope.row.directory" class="table-operator">
              <MediaUpload
                :params="{
                  path: formSearch.directory,
                  replace: scope.row.path ?? ''
                }"
                @on-success="refuresh"
                @on-loading="_loading => (loading = _loading)"
              >
                <el-button link type="primary"> 替换 </el-button>
              </MediaUpload>

              <el-button
                link
                type="primary"
                @click="deleteAction(scope.row.path)"
              >
                删除
              </el-button>
            </div>
            <div v-else>-</div>
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
import MediaUpload from "@/components/MediaUpload.vue"
import { Directories } from "./Files"

const formRef = ref<FormInstance>()
const loading = ref(false)
const uploadLogin = ref(false)
const directories = ref([])
const formSearch = reactive<{ keyword: string; directory: string[] }>({
  keyword: "",
  directory: []
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
      value: `${item.name}/`,
      label: item.name,
      children: directorysFormat(item.subDirectories)
    }
  })
}

async function getDirectorys() {
  const res = await http.get("/file/directory", {
    path: "/upload"
  })

  if (res.code === 0) {
    directories.value = directorysFormat(res.data)
  }
}
async function getList(page = table.page) {
  try {
    loading.value = true
    const res = await http.post("/file/list", {
      ...formSearch,
      directorie: formSearch.directory?.join(""),
      page,
      pageSize: table.pageSize
    })
    if (res.code === 0) {
      for (const item of res.data.list) {
        item.icon = item.directory
          ? "icon-folder"
          : `icon-${item.name.split(".").pop().toUpperCase()}`
        item.name = item.directory ? `${item.name}/` : item.name
        item.lastModified = item.lastModified
          ? dayjs(item.lastModified).format("L LTS")
          : "-"

        const { value, unit } = byteSize(item.size)
        item.size = item.size ? `${value}${unit}` : "-"
      }
      table.list = res.data.list
      table.total = res.data.total
      table.page = page
    }
  } finally {
    loading.value = false
  }
}

function jumpTo(row) {
  if (row.directory) {
    formSearch.directory.push(row.name)
    getList(1)
  } else {
    window.open(`${row.url}`)
  }
}
function back() {
  formSearch.directory.pop()
  getList(1)
}
function refuresh() {
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
  .icon {
    @include flex-center;
  }
  .back {
    cursor: pointer;
    transition: all $duration;
    &:hover {
      color: $color-primary;
    }
  }
}
</style>
