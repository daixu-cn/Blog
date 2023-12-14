<template>
  <div id="Lemon">
    <el-skeleton :loading="skeleton && page === 1" animated>
      <template #template>
        <Waterfall :list="skeletonList" v-bind="waterfallProps">
          <template #item="{ item }">
            <el-skeleton-item variant="image" :style="item.style" />
          </template>
        </Waterfall>
      </template>
      <template #default>
        <InfiniteScroll
          id="Lemon-container"
          :loading="loading"
          :is-over="list.length >= total"
          :show-end="false"
          @on-load="getList"
        >
          <Waterfall id="Lemon-container" :list="list" v-bind="waterfallProps">
            <template #item="{ item, index }">
              <div class="card" @click="handleAsset(item, index)">
                <div v-if="item.mediaType === 'IMAGE'" class="asset-img">
                  <LazyImg :url="item.path" />
                  <div class="summary">
                    <p v-if="item.description" class="description">
                      {{ item.description }}
                    </p>
                    <p class="time">{{ item.createdAt }}</p>
                  </div>
                </div>
                <div v-else-if="item.mediaType === 'VIDEO'" class="asset-video">
                  <Player
                    :src="item.path"
                    :plyr-props="{ controls: ['play-large'] }"
                  />
                </div>
              </div>
            </template>
          </Waterfall>
        </InfiniteScroll>
      </template>
    </el-skeleton>

    <ImageViewer
      :show="viewer.show"
      :url-list="urlList"
      :initial-index="viewer.index"
      @close="viewer.show = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from "vue"
import { LazyImg, Waterfall } from "vue-waterfall-plugin-next"
import dayjs from "dayjs"
import ImageViewer from "@/components/ImageViewer.vue"
import Player from "@/components/Player.vue"
import http from "@/server"
import { getRandomIntInclusive } from "@/utils/util"
import { ASSET_PREFIX } from "@/global/env"
import InfiniteScroll from "@/components/InfiniteScroll.vue"

const waterfallProps = {
  rowKey: "lemonId",
  imgSelector: "path",
  hasAroundGutter: false,
  crossOrigin: false,
  gutter: 10,
  // width: 200,
  delay: 300,
  backgroundColor: "transparent",
  loadProps: {
    loading: `${ASSET_PREFIX}/image/pic-loading.png`,
    error: `${ASSET_PREFIX}/image/pic-fail.png`
  },
  breakpoints: {
    2200: { rowPerView: 6 },
    1100: { rowPerView: 5 },
    1000: { rowPerView: 4 },
    900: { rowPerView: 3 },
    800: { rowPerView: 2 }
  }
}
const skeletonList: any[] = Array(20)
  .fill({})
  .map(() => {
    return {
      style: {
        height: `${getRandomIntInclusive(100, 300)}px`
      }
    }
  })
const list = reactive<any[]>([])
const urlList = computed(() =>
  list.filter(item => item.mediaType === "IMAGE").map(item => item.path)
)
const viewer = reactive({
  show: false,
  index: 0
})
const skeleton = ref(true)
const loading = ref(false)
const page = ref(1)
const total = ref(0)

function handleAsset(row, index: number) {
  if (row.mediaType === "IMAGE") {
    viewer.index = index
    viewer.show = true
  }
}

async function getList() {
  try {
    if (page.value !== 1) {
      loading.value = true
    }

    const res = await http.post("/lemon/list", {
      page: page.value,
      pageSize: 10
    })
    if (res.code === 0) {
      list.push(
        ...res.data.list.map(item => {
          return {
            ...item,
            createdAt: dayjs(item.createdAt).format("L")
          }
        })
      )
      total.value = res.data.total
    }
  } finally {
    skeleton.value = false
    loading.value = false

    page.value++
    loading.value = false
  }
}
getList()
</script>

<style lang="scss">
#Lemon {
  .card {
    position: relative;
    cursor: pointer;
    overflow: hidden;

    .asset-img {
      [lazy="loading"],
      [lazy="loaded"],
      [lazy="error"] {
        border-radius: $border-radius;
      }
    }

    &:hover {
      .summary {
        transform: translateY(0);
      }
    }
    .summary {
      width: 100%;
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      box-sizing: border-box;
      padding: 10px;
      transform: translateY(100%);
      transition: all $duration;
      border-top-right-radius: $space;
      border-top-left-radius: $space;
      .description {
        text-align: center;
        margin: $space 0;
        line-height: 1.5em;
      }
      .time {
        text-align: right;
        word-break: break-all;
        font-size: 12px;
      }
    }
  }
}
</style>
