<template>
  <el-config-provider
    v-if="isRouterAlive"
    :locale="localeStore.element"
    v-bind="ElConfigProviderConfig as ConfigProviderProps"
  >
    <NotFound v-if="isPeep" />
    <router-view v-else v-slot="{ Component }">
      <transition name="route" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, provide } from "vue"
import { addListener, launch } from "devtools-detector"
import type { ConfigProviderProps } from "element-plus"
import NotFound from "@/views/Error/NotFound.vue"
import useUserStore from "@/store/user"
import useThemeStore from "@/store/theme"
import useLocaleStore from "@/store/locale"

const isPeep = ref(false)
if (import.meta.env.MODE !== "development") {
  addListener(isOpen => {
    isPeep.value = isOpen
  })
  launch()
}

const isRouterAlive = ref(true)
const userStore = useUserStore()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()

// 初始化用户信息
userStore.getUser()
// 初始化主题
themeStore.setTheme()
// 初始化语言
localeStore.setLocale()

const ElConfigProviderConfig = reactive({
  size: "default",
  zIndex: 0,
  button: {
    autoInsertSpace: true
  }
})

function reload() {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}
provide("reload", reload)
</script>

<style lang="scss">
.route-enter-from,
.route-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}
.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.route-enter-active,
.route-leave-active {
  transition: all 0.5s;
}
</style>
