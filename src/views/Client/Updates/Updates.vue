<template>
  <div id="Updates">
    <el-skeleton :loading="skeleton && page === 1" animated>
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
        <InfiniteScroll
          id="UpdatesList"
          :loading="loading"
          :is-over="list.length >= total"
          :show-end="false"
          :mutation-options="{ subtree: true }"
          @on-load="getList"
        >
          <el-timeline id="UpdatesList" v-auto-animate>
            <el-timeline-item
              v-for="item in list"
              :key="item.updateId"
              :timestamp="item.createdAt"
            >
              <span v-html="item.content"></span>
            </el-timeline-item>
          </el-timeline>
        </InfiniteScroll>
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import dayjs from "dayjs"
import nzh from "nzh"
import http from "@/server"
import InfiniteScroll from "@/components/InfiniteScroll.vue"

const skeleton = ref(true)
const loading = ref(false)
const list = reactive<any[]>([])
const page = ref(1)
const total = ref(0)

async function getList() {
  try {
    if (page.value === 1) {
      skeleton.value = true
    } else {
      loading.value = true
    }
    const res = await http.post("/update/list", {
      page: page.value,
      pageSize: 10
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
    }
  } finally {
    skeleton.value = false
    loading.value = false

    page.value++
  }
}
getList()
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
}
</style>
