<template>
  <div id="Locale" class="dropdown-container">
    <el-dropdown :teleported="false">
      <div class="icon-container">
        <Icon class="icon-earth" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item of locales"
            :key="item.locale"
            :disabled="item.locale === localeStore.current"
            @click="localeChange(item.locale)"
            >{{ $t(`locale.${item.locale}`) }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { inject } from "vue"
import locales, { LocaleType } from "@/global/locale"
import useLocaleStore from "@/store/locale"

const reload = inject<() => void>("reload")
const localeStore = useLocaleStore()

function localeChange(locale: LocaleType) {
  localeStore.setLocale(locale)
  reload?.()
}
</script>
