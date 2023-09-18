<template>
  <Teleport to="#app">
    <div id="Artile-Catalog">
      <div class="catalog">
        <h1>目录</h1>
        <el-skeleton :loading="loading" animated>
          <template #template>
            <el-skeleton :rows="7" animated />
          </template>
          <template #default>
            <el-scrollbar height="70vh" tag="ul">
              <li
                v-for="(item, index) of catalog"
                :key="index"
                :data-level="item.level"
                :data-text="item.text"
                @click="goToAnchor(item.text)"
              >
                {{ item.text }}
              </li>
            </el-scrollbar>
          </template>
        </el-skeleton>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { HeadList } from "md-editor-v3"

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  catalog: {
    type: Array as () => HeadList[],
    default: () => []
  }
})

function goToAnchor(text: string) {
  const { top } = (
    document.getElementById(text) as HTMLElement
  ).getBoundingClientRect()

  window.scrollBy({
    top: Math.ceil(top) - 80,
    behavior: "smooth"
  })
}
</script>

<style lang="scss">
#Artile-Catalog {
  @include media-width;
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);

  z-index: 1;
  display: flex;
  justify-content: flex-end;
  .catalog {
    width: 300px;
    border-radius: $border-radius;
    box-sizing: border-box;
    padding: 0 10px;
    h1 {
      position: relative;
      padding: 10px 20px 10px 25px;
      font-weight: 700;
      border-bottom: 1px solid $border-color;
      margin-bottom: 10px;
      margin-top: 0;
      color: var(--el-text-color-regular);
      &::before,
      &::after {
        content: "";
        position: absolute;
        width: 2px;
        height: 12px;
        background: $color-primary;
        top: 50%;
        transform: skew(-15deg) translateY(-50%);
        left: 4px;
        bottom: 10%;
      }
      &::after {
        left: 10px;
      }
    }
    ul {
      li {
        position: relative;
        box-sizing: border-box;
        padding: 0 8px 0 12px;
        line-height: 44px;
        border-radius: $border-radius;
        cursor: pointer;
        transition: all $duration;
        color: var(--el-text-color-regular);
        @include text-ellipsis;
        &::before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: transparent;
          position: absolute;
          left: 0;
          top: 50%;
          transform: scale(0) translateY(-50%);
          transition: all $duration;
        }
        &[data-level="2"] {
          margin-left: 15px;
          color: var(--el-color-info-light-2);
        }
        &[data-level="3"] {
          margin-left: 30px;
          color: var(--el-color-info-light-3);
        }
        &[data-level="4"] {
          margin-left: 45px;
          color: var(--el-color-info-light-4);
        }
        &[data-level="5"] {
          margin-left: 60px;
          color: var(--el-color-info-light-5);
        }
        &[data-level="6"] {
          margin-left: 75px;
          color: var(--el-color-info-light-6);
        }
        &:hover {
          color: $color-primary;
          &::before {
            background-color: $color-primary;
            transform: scale(1) translateY(-50%);
          }
        }
        &.active {
          color: $color-primary;
          &::before {
            background-color: $color-primary;
            transform: scale(1) translateY(-50%);
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1300px) {
  #Artile-Catalog {
    display: none;
  }
}
</style>
