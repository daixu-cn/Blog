<template>
  <div id="SystemUsers" class="system-page">
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
          placeholder="用户ID/用户名/邮箱"
          @keydown.enter="getList(1)"
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
        <el-table-column label="用户头像" align="center" width="80px">
          <template #default="scope">
            <el-image
              :src="scope.row.avatar"
              :preview-src-list="[scope.row.avatar]"
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
        <el-table-column
          prop="userName"
          label="用户名"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="role"
          label="用户角色"
          align="center"
          show-overflow-tooltip
          width="80px"
        />
        <el-table-column
          prop="emailService"
          label="邮箱服务"
          align="center"
          width="80px"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.emailService"
              disabled
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            />
          </template>
        </el-table-column>
        <el-table-column prop="qq" label="QQ" align="center" width="75px">
          <template #default="scope">
            <el-text v-if="scope.row.qq" type="primary">
              <i-ep-check />
            </el-text>
            <el-text v-else type="danger">
              <i-ep-close />
            </el-text>
          </template>
        </el-table-column>
        <el-table-column
          prop="github"
          label="GitHub"
          align="center"
          width="75px"
        >
          <template #default="scope">
            <el-text v-if="scope.row.github" type="primary">
              <i-ep-check />
            </el-text>
            <el-text v-else type="danger">
              <i-ep-close />
            </el-text>
          </template>
        </el-table-column>
        <el-table-column
          prop="google"
          label="Google"
          align="center"
          width="75px"
        >
          <template #default="scope">
            <el-text v-if="scope.row.google" type="primary">
              <i-ep-check />
            </el-text>
            <el-text v-else type="danger">
              <i-ep-close />
            </el-text>
          </template>
        </el-table-column>
        <el-table-column
          prop="updatedAt"
          label="更新时间"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createdAt"
          label="注册时间"
          align="center"
          show-overflow-tooltip
        />
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
import type { FormInstance } from "element-plus"
import http from "@/server"
import dayjs from "dayjs"

const formRef = ref<FormInstance>()
const loading = ref(false)
const formSearch = reactive({
  keyword: ""
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
    const res = await http.post("/user/list", {
      ...formSearch,
      page,
      pageSize: table.pageSize
    })

    if (res.code === 0) {
      table.list = res.data.list.map((item) => {
        return {
          ...item,
          role: item.role === 0 ? "管理员" : "普通用户",
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
</script>

<style lang="scss">
#SystemUsers {
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>
