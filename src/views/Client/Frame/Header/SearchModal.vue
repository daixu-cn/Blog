<template>
  <div id="SearchModal" :class="{ enter: isSearch }" @click="maskClick">
    <div class="input">
      <i-ep-search class="searchIcon" />
      <el-input
        ref="input"
        v-model="keyword"
        :placeholder="$t('search.articleTitle')"
        @input="getList"
      />
      <i-ep-close class="clearIcon" @click="keyword = ''" />
    </div>
    <div class="result">
      <ul>
        <p>
          {{
            !keyword ? $t("search.popularArticles") : $t("search.searchResults")
          }}
        </p>
        <el-skeleton :loading="loading" animated :count="6">
          <template #template>
            <li class="search-item">
              <el-skeleton-item style="width: calc(100% - 48px - 1em)" />
            </li>
          </template>
          <template #default>
            <el-scrollbar height="210px">
              <ul v-if="!keyword" class="searchList">
                <li
                  v-for="item of hotList"
                  :key="item.articleId"
                  class="search-item"
                  @click="goToPage(item.articleId)"
                >
                  <p>
                    <span class="title">{{ item.title }}</span
                    ><span class="category">@{{ item.category }}</span>
                  </p>
                </li>
              </ul>
              <ul v-if="keyword && searchList.length" class="searchList">
                <li
                  v-for="item of searchList"
                  :key="item.articleId"
                  class="search-item"
                  @click="goToPage(item.articleId)"
                >
                  <p>
                    <span class="title">{{ item.title }}</span
                    ><span class="category">@{{ item.category }}</span>
                  </p>
                </li>
              </ul>
              <el-empty
                v-if="keyword && !searchList.length && !loading"
                :description="$t('search.noArticles')"
              />
            </el-scrollbar>
          </template>
        </el-skeleton>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect } from "vue"
import { useRouter } from "vue-router"
import http from "@/server"
import { categories } from "@/global/select"
import i18n from "@/locale"

const router = useRouter()
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(["close"])
const keyword = ref("")
const loading = ref(false)
const hotList = ref<any[]>([])
const searchList = ref<any[]>([])
const isSearch = ref(false)
const input = ref<HTMLInputElement>()

onMounted(() => {
  const SearchModalEL = document.querySelector("#SearchModal") as HTMLElement

  SearchModalEL.addEventListener(
    "transitionend",
    event => {
      if (event.target === SearchModalEL && !isSearch.value) {
        emit("close")
      }
    },
    false
  )
})
watchEffect(() => {
  if (props.show) {
    keyword.value = ""
    searchList.value = []
    isSearch.value = true
    input.value?.focus()
  }
})

function close() {
  isSearch.value = false
}

function maskClick(event: Event) {
  const target = event.target as HTMLElement
  if (target.getAttribute("id") === "SearchModal") {
    close()
  }
}

async function getHotList() {
  const res = await http.post("/article/list", {
    page: 1,
    pageSize: 10,
    orderBy: "views"
  })

  if (res.code === 0) {
    hotList.value = res.data.list.map(item => {
      return {
        ...item,
        category: i18n.global.t(
          categories.find(category => category.value === item.category)
            ?.label as string
        )
      }
    })
  } else {
    hotList.value = []
  }
}
getHotList()

async function getList() {
  try {
    loading.value = true
    const res = await http.get("/article/title", {
      keyword: keyword.value
    })

    if (res.code === 0) {
      searchList.value = res.data.map(item => {
        return {
          ...item,
          category: i18n.global.t(
            categories.find(category => category.value === item.category)
              ?.label as string
          )
        }
      })
    } else {
      searchList.value = []
    }
  } finally {
    loading.value = false
  }
}

function goToPage(articleId: string) {
  close()
  router.push({
    name: "ArticleDetail",
    params: { articleId }
  })
}
</script>

<style lang="scss">
#SearchModal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.48);
  transform: translateX(200px);
  opacity: 0;
  transition: all 0.5s;
  &.enter {
    z-index: 1000;
    transform: translateX(0);
    opacity: 1;
  }
  .input {
    width: 600px;
    height: 60px;
    margin: 0 auto;
    position: relative;
    .el-input {
      width: 100%;
      height: 100%;
      border: 0;
      .el-input__wrapper {
        box-shadow: initial;
        padding: 0 40px;
        background-color: transparent;
        font-size: $font-size;
        .el-input__inner {
          color: var(--el-text-color-placeholder);
        }
      }
    }
    .searchIcon,
    .clearIcon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: var(--el-text-color-placeholder);
      font-size: 16px;
    }
    .searchIcon {
      left: 10px;
    }
    .clearIcon {
      right: 10px;
      cursor: pointer;
      transition: all $duration;
      &:hover {
        color: $color-primary;
      }
    }
  }
  .result {
    width: 600px;
    height: 300px;
    margin: 0 auto;
    padding: 30px 0;
    box-sizing: border-box;
    background-color: $bg-color-overlay;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    ul {
      width: 100%;
      & > p {
        padding-left: 48px;
        color: $font-color;
        opacity: 0.5;
        font-size: 12px;
        margin-bottom: 15px;
      }
      .el-empty {
        padding: 0;
      }
      .search-item {
        width: 100%;
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        padding-left: calc(48px + 1em);
        font-size: $font-size;
        color: $font-color;
        transition: all $duration;
        &:hover {
          color: $color-primary;
          background-color: var(--el-color-primary-light-9);
          cursor: pointer;
        }

        p {
          width: calc(100% - 48px - 1em);
          display: flex;
          justify-content: space-between;
          .title {
            width: calc(100% - 80px);
            @include text-ellipsis;
          }
          .category {
            width: 60px;
            color: $font-color-placeholder;
            margin-left: 10px;
            font-size: calc(1em - 2px);
            @include text-ellipsis;
          }
        }
      }
    }
  }
  @media screen and (max-width: 850px) {
    .input,
    .result {
      width: 80%;
      ul {
        & > p {
          padding-left: calc($space + 10px);
        }
        .search-item {
          padding-left: calc($space + 10px + 1em);
          p {
            width: 100%;
          }
        }
      }
    }
    .result {
      padding: 20px 0;
    }
  }
  @media screen and (max-width: 600px) {
    .input,
    .result {
      width: 95%;
    }
  }
}
</style>
