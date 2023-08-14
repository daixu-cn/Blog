<template>
  <div id="SystemMenu">
    <el-scrollbar>
      <el-menu :default-active="active" router>
        <el-menu-item
          v-for="item of adminMenus"
          :key="item.path"
          :index="item.path"
        >
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useRoute } from "vue-router"
import { adminMenus } from "@/global/menus"

const route = useRoute()

const active = ref(route.fullPath.split("/").slice(0, 3).join("/"))
</script>

<style lang="scss">
#SystemMenu {
  width: 200px;
  height: 100%;
  .el-menu {
    padding: 10px 5px;
    box-sizing: border-box;
    border-right-color: rgba(5, 5, 5, 0.06);
    .el-menu-item {
      user-select: none;
      margin-bottom: 15px;
      height: 40px;
      line-height: 40px;
      border-radius: 8px;
      &:last-child {
        margin-bottom: 0;
      }
      svg {
        margin-right: 10px;
      }
      &:hover {
        background-color: var(--el-color-info-light-9);
      }
      &.is-active {
        background-color: var(--el-menu-hover-bg-color);
      }
    }
  }
}
@media screen and (max-width: 750px) {
  #SystemMenu {
    display: none;
  }
}
</style>
