<template>
  <div id="Menu">
    <ul>
      <li
        v-for="item of menus"
        :key="item.path"
        :class="{ active: route.path.startsWith(item.path) }"
        @click="goToPage(item.path)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router"
import menus from "@/global/menus"

const router = useRouter()
const route = useRoute()

function goToPage(path: string) {
  router.push(path)
}
</script>

<style lang="scss">
#Menu {
  ul {
    display: flex;
    li {
      margin-right: calc($space + 10px);
      transition: all $duration;
      position: relative;
      &:last-child {
        margin-right: 0;
      }
      &::after {
        content: "";
        width: 0;
        height: 3px;
        background-color: $color-primary;
        display: inline-block;
        position: absolute;
        left: 0;
        bottom: -10px;
        transition: all $duration;
      }
      &:hover {
        color: $color-primary;
        cursor: pointer;
        &::after {
          width: 100%;
        }
      }
      &.active {
        color: $color-primary;
        &::after {
          width: 100%;
        }
      }
    }
  }
}
</style>
