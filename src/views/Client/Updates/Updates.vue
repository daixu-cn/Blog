<template>
  <div id="Updates">
    <el-skeleton :loading="skeletonLoading && page === 1" animated>
      <template #template>
        <el-timeline>
          <el-timeline-item v-for="item of 8" :key="item">
            <el-skeleton-item variant="h3" />
            <br />
            <el-skeleton-item variant="text" />
          </el-timeline-item>
        </el-timeline>
      </template>
      <template #default>
        <el-timeline>
          <el-timeline-item
            v-for="item in list"
            :key="item.updateId"
            :timestamp="item.createdAt"
          >
            {{ item.content }}
          </el-timeline-item>
        </el-timeline>
      </template>
    </el-skeleton>
    <div ref="footer" class="footer">
      <Loading :loading="loading" />
      <p v-if="list.length >= total && !skeletonLoading" class="loadingEnd">
        加载结束～
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick } from "vue"
import http from "@/server"
import dayjs from "dayjs"
import { useIntersectionObserver } from "@vueuse/core"
import Loading from "@/components/Loading.vue"

const footer = ref()
const list = reactive<any[]>([])
const skeletonLoading = ref(true)
const loading = ref(false)
const page = ref(1)
const total = ref(0)

async function getList() {
  try {
    if (page.value === 1) {
      skeletonLoading.value = true
    } else {
      loading.value = true
    }
    const res = await http.post("/update/list", {
      page: page.value,
      pageSize: 20
    })

    if (res.code === 0) {
      list.push(
        ...res.data.list.map((item) => {
          return {
            ...item,
            createdAt: dayjs(item.createdAt).format("L LTS"),
            updatedAt: dayjs(item.updatedAt).format("L LTS")
          }
        })
      )
      total.value = res.data.total

      nextTick(() => {
        const { stop } = useIntersectionObserver(
          footer,
          ([{ isIntersecting }]) => {
            stop()
            if (isIntersecting) {
              if (list.length < total.value) {
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
    if (list.length >= total.value) {
      stop()
    }
    page.value++
  }
}
getList()

const { stop } = useIntersectionObserver(footer, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    if (list.length < total.value) {
      getList()
    }
  }
})
</script>

<style lang="scss">
#Updates {
  .el-skeleton {
    .el-skeleton__text {
      width: 30%;
      margin-top: 8px;
    }
  }
  .footer {
    margin-bottom: 20px;
    .loadingEnd {
      text-align: center;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
