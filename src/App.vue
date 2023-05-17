<template>
  <el-config-provider v-bind="(ElConfigProviderConfig as ConfigProviderProps)">
    <NotFound v-if="isPeep" />
    <router-view v-else v-slot="{ Component }">
      <transition name="route" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import { addListener, launch } from "devtools-detector"
import NotFound from "@/views/Error/NotFound.vue"
import useThemeStore from "@/store/theme"
import useLocaleStore from "@/store/locale"
import type { ConfigProviderProps } from "element-plus"

const isPeep = ref(false)
if (import.meta.env.MODE !== "development") {
  addListener((isOpen) => {
    isPeep.value = isOpen
  })
  launch()
}

const theme = useThemeStore()
const locale = useLocaleStore()

// 初始化主题
theme.setTheme()
// 初始化语言
locale.setLocale()

const ElConfigProviderConfig = reactive({
  locale: locale.element,
  size: "default",
  zIndex: 0,
  button: {
    autoInsertSpace: true
  }
})
</script>

<style lang="scss">
.route-enter-from,
.route-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: scale(1);
}
.route-enter-active,
.route-leave-active {
  transition: all 0.3s;
}
</style>
