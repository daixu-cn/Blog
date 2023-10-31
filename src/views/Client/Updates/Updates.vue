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
        <el-timeline v-auto-animate>
          <el-timeline-item
            v-for="item in list"
            :key="item.updateId"
            :timestamp="item.createdAt"
          >
            <span v-html="item.content"></span>
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
import dayjs from "dayjs"
import { useIntersectionObserver } from "@vueuse/core"
import nzh from "nzh"
import http from "@/server"
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
        ...res.data.list.map(item => {
          const contentList = item.content.split("\t")
          const content =
            contentList.length <= 1
              ? item.content
              : contentList
                  .map((content: string, index: number) => {
                    return `${nzh.cn.encodeS(index + 1)}、${content}`
                  })
                  .join("<br />")

          return {
            ...item,
            content,
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
  .el-timeline-item__content {
    line-height: 1.5em;
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
