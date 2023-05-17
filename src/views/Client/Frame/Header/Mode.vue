<template>
  <div id="Mode" class="dropdown-container">
    <Icon
      v-if="themeStore.isDarkMode"
      class="icon-dark"
      @click="toggleThemeMode"
    />
    <Icon v-else class="icon-light" @click="toggleThemeMode" />
  </div>
</template>

<script lang="ts" setup>
import useThemeStore from "@/store/theme"

const themeStore = useThemeStore()
function toggleThemeMode() {
  themeStore.toggleThemeMode()
}
</script>
