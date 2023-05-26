<template>
  <div id="SystemLinks" class="system-page">
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
          placeholder="ID/名称/描述/URL"
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
        <el-table-column prop="logo" label="LOGO" align="center">
          <template #default="scope">
            <el-image
              style="width: 50px; max-height: 50px"
              :src="scope.row.logo"
              :preview-src-list="[scope.row.logo]"
              fit="cover"
              preview-teleported
            >
              <template #error>
                <div class="image-slot">
                  <i-ep-picture />
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="网站名称"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="description"
          label="网站描述"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="video"
          label="网站地址"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-link :href="scope.row.url" target="_blank" type="primary">{{
              scope.row.url
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="申请时间"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column prop="check" label="核验状态" align="center">
          <template #default="scope">
            <el-switch
              :value="scope.row.check"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
              @change="checkChange(scope.row.linkId, scope.row.check)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          label="站长邮箱"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" width="130">
          <template #default="scope">
            <el-button link type="primary" @click="editAction(scope.row)">
              编辑
            </el-button>
            <el-button
              link
              type="primary"
              @click="deleteAction(scope.row.linkId)"
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
import http from "@/server"
import dayjs from "dayjs"
import ActionDialog from "./ActionDialog.vue"

const formRef = ref<FormInstance>()
const actionDialogRef = ref()
const loading = ref(false)
const formSearch = reactive({
  keyword: "",
  category: "",
  startTime: "",
  endTime: ""
})
const table = reactive({
  list: [],
  page: 1,
  pageSize: 10,
  total: 0
})

async function checkChange(linkId, check) {
  const res = await http.patch("/link/update", {
    linkId,
    check: check ? 0 : 1
  })
  if (res.code === 0) {
    ElMessage.success("操作成功")
  }
  getList()
}

async function getList(page = 1) {
  try {
    loading.value = true
    const res = await http.post("/link/list", {
      ...formSearch,
      page,
      pageSize: table.pageSize
    })

    if (res.code === 0) {
      for (const item of res.data.list) {
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
  for (const key in actionDialogRef.value.link) {
    actionDialogRef.value.link[key] = row[key]
  }
  actionDialogRef.value.show = true
}
function deleteAction(linkId) {
  ElMessageBox.confirm("此操作将永久删除该友联，是否继续?", "提示", {
    type: "warning",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true
        const res = await http.delete(`/link/${linkId}`)
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
