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
    <el-backtop :right="20" :bottom="20" :visibility-height="2300" />
  </div>
</template>

<script lang="ts" setup>
import Header from "@/views/Client/Frame/Header/Header.vue"
</script>

<style lang="scss">
#Frame {
  #main {
    width: $main-width;
    padding-top: 20px;
    box-sizing: border-box;
    margin: 0 auto;
  }
  @media screen and (max-width: 1250px) {
    #main {
      width: 100%;
      padding: 20px 20px 0 20px;
    }
  }
}
</style>
