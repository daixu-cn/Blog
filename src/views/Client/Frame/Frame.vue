<template>
  <div id="Frame">
    <Header />

    <el-scrollbar wrap-class="Frame-main" noresize>
      <router-view v-slot="{ Component }">
        <transition name="route" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-scrollbar>

    <el-backtop
      :right="20"
      :bottom="20"
      :visibility-height="2300"
      style="z-index: 1"
    />
  </div>
</template>

<script lang="ts" setup>
import Header from "@/views/Client/Frame/Header/Header.vue"
</script>

<style lang="scss">
#Frame {
  .Frame-main {
    @include media-width;
    padding-top: 20px;
    box-sizing: border-box;
    margin: 0 auto;
    position: relative;
  }
  @media screen and (max-width: 1250px) {
    .Frame-main {
      padding: 20px 20px 0 20px;
    }
  }
}
</style>
