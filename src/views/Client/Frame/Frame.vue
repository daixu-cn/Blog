<template>
  <div id="Frame">
    <Header />
    <div id="main">
      <router-view v-slot="{ Component }">
        <transition name="route" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from "@/views/Client/Frame/Header/Header.vue"
</script>

<style lang="scss">
#Frame {
  #main {
  }
}
</style>
