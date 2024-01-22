<template>
  <div id="Theme" class="dropdown-container">
    <el-dropdown :teleported="false">
      <div class="icon-container">
        <Icon class="icon-bg-colors" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item of themes"
            :key="item.theme"
            :disabled="item.theme === themeStore.current"
            @click="themeChange(item.theme)"
          >
            <span
              class="color-item"
              :style="{ backgroundColor: item.color }"
            ></span>
            {{ item.title }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import themes, { ThemeType } from "@/global/theme"
import useThemeStore from "@/store/theme"

const themeStore = useThemeStore()
function themeChange(theme: ThemeType) {
  themeStore.setTheme(theme)
}
</script>

<style lang="scss">
#Theme {
  margin-right: calc($space + 10px);
  .el-dropdown {
    .color-item {
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-right: 10px;
      border-radius: 2px;
    }
  }
}
</style>
