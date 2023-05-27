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
          placeholder="ID/标题/描述"
          @keydown.enter="getList(1)"
        />
      </el-form-item>
      <el-form-item label="文章类别" prop="category">
        <el-select
          v-model="formSearch.category"
          placeholder="请选择文章类别"
          :disabled="loading"
          clearable
          @change="getList(1)"
        >
          <el-option
            v-for="item of categories"
            :key="item.value"
            :label="i18n.global.t(item.name)"
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
          prop="title"
          label="标题"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column prop="category" label="文章类别" align="center" />
        <el-table-column
          prop="description"
          label="描述"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column prop="poster" label="预览图" align="center">
          <template #default="scope">
            <el-image
              style="width: 50px; max-height: 50px"
              :src="scope.row.poster"
              :preview-src-list="[scope.row.poster]"
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
          prop="video"
          label="视频"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-link
              v-if="scope.row.video"
              :href="scope.row.video"
              target="_blank"
              type="primary"
              >{{ scope.row.video }}</el-link
            >
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="views"
          label="浏览量"
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
            <el-button
              type="primary"
              :icon="Plus"
              class="operator"
              @click="goToActionMD(0)"
              >创建文章</el-button
            >
          </template>
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="viewAction(scope.row.articleId)"
            >
              查看
            </el-button>
            <el-button
              link
              type="primary"
              @click="goToActionMD(scope.row.articleId)"
            >
              编辑
            </el-button>
            <el-button
              link
              type="primary"
              @click="deleteAction(scope.row.articleId)"
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
import { categories } from "@/global/select"
import i18n from "@/locale"
import { ElMessageBox, ElMessage } from "element-plus"
import type { FormInstance } from "element-plus"
import http from "@/server"
import dayjs from "dayjs"
import { Plus } from "@element-plus/icons-vue"
import { useRouter } from "vue-router"

const router = useRouter()
const formRef = ref<FormInstance>()
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

async function getList(page = 1) {
  try {
    loading.value = true
    const res = await http.post("/article/list", {
      ...formSearch,
      page,
      pageSize: table.pageSize
    })

    if (res.code === 0) {
      table.list = res.data.list.map((item) => {
        return {
          ...item,
          category: categories.find(
            (category) => category.value === item.category
          )?.label,
          views: item.views.toLocaleString(),
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

function viewAction(articleId: string) {
  const { href } = router.resolve({
    name: "ArticleDetail",
    params: {
      articleId
    }
  })
  window.open(href, "_blank")
}
function goToActionMD(articleId) {
  router.push({
    name: "SystemArticleMD",
    params: { articleId }
  })
}
function deleteAction(articleId) {
  ElMessageBox.confirm("此操作将永久删除该文章，是否继续?", "提示", {
    type: "warning",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true
        const res = await http.delete(`/article/${articleId}`)
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