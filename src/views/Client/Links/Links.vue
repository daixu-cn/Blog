<template>
  <div id="Links">
    <el-skeleton :loading="skeleton && page === 1" animated>
      <template #template>
        <div id="link-container">
          <div v-for="item of 10" :key="item" class="link-item">
            <el-skeleton-item variant="image" class="logo" />
            <div class="info">
              <el-skeleton-item variant="text" class="name" />
              <el-skeleton-item variant="h1" class="description" />
            </div>
          </div>
          <i v-for="item of 4" :key="item" class="placeholder" />
        </div>
      </template>
      <template #default>
        <InfiniteScroll
          id="link-container"
          :loading="loading"
          :is-over="list.length >= total"
          :show-end="false"
          @on-load="getList"
        >
          <div id="link-container" v-auto-animate>
            <a
              v-for="item in list"
              :key="item.linkId"
              class="link-item"
              target="_blank"
              :href="item.url"
            >
              <el-image class="logo" :src="item.logo ?? ''" fit="contain">
                <template #error>
                  <div class="image-slot">
                    <i-ep-picture />
                  </div>
                </template>
              </el-image>

              <div class="info">
                <p class="name">{{ item.name }}</p>
                <div class="description">{{ item.description }}</div>
              </div>
            </a>
            <a class="link-item apply" @click="applyDialog.show = true">
              <i-ep-plus />友联申请
            </a>

            <i v-for="item of 4" :key="item" class="placeholder" />
          </div>
        </InfiniteScroll>
      </template>
    </el-skeleton>

    <ApplyDialog ref="applyDialog" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import dayjs from "dayjs"
import http from "@/server"
import InfiniteScroll from "@/components/InfiniteScroll.vue"
import ApplyDialog from "./ApplyDialog.vue"

const applyDialog = ref()
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
    const res = await http.post("/link/list", {
      check: 1,
      page: page.value,
      pageSize: 10
    })

    if (res.code === 0) {
      list.push(
        ...res.data.list.map(item => {
          return {
            ...item,
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
#Links {
  --shadow-color: #c8d0e7;

  #link-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .link-item {
      width: calc(25% - 15px);
      padding: 10px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      border-radius: $border-radius;
      box-shadow:
        inset 3px 3px 8px var(--shadow-color),
        inset -3px -3px 8px $bg-color;
      text-decoration: none;
      color: $font-color;
      box-sizing: border-box;
      transition: all $duration;
      .logo {
        width: 70px;
        height: 70px;
        .image-slot {
          width: 100%;
          height: 100%;
          @include flex-center;
        }
      }
      .info {
        width: calc(100% - 80px);
        user-select: none;
        .name {
          transition: color $duration;
          @include text-ellipsis;
        }
        .description {
          transition: color $duration;
          color: $font-color-secondary;
          margin-top: 10px;
          @include more-text-ellipsis(2);
        }
      }
      &:hover {
        box-shadow:
          inset 3px 3px 8px var(--shadow-color),
          inset 3px 3px 8px var(--shadow-color);

        .info {
          .name,
          .description {
            color: $color-primary;
          }
        }
      }
      &.apply {
        color: $color-primary;
        justify-content: center;
        font-size: 1.1em;
        min-height: 80px;
        svg {
          margin-right: 5px;
        }
      }
    }
    .placeholder {
      width: calc(25% - 15px);
      height: 0;
    }
  }

  @media screen and (max-width: 1000px) {
    #link-container {
      .link-item,
      .placeholder {
        width: calc(100% / 3 - 20px);
      }
    }
  }
  @media screen and (max-width: 800px) {
    #link-container {
      .link-item,
      .placeholder {
        width: calc(50% - 10px);
      }
    }
  }
  @media screen and (max-width: 550px) {
    #link-container {
      .link-item,
      .placeholder {
        width: 100%;
      }
    }
  }
}
html.dark {
  #Links {
    --shadow-color: #495671;
  }
}
</style>
