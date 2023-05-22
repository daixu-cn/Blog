<template>
  <div id="SystemFrame">
    <Header />
    <div class="SystemFrame-container">
      <Menu />
      <el-scrollbar class="SystemFrame-page">
        <router-view v-slot="{ Component }">
          <transition name="route" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from "@/views/Admin/Frame/Header/Header.vue"
import Menu from "./Menu/Menu.vue"
</script>

<style lang="scss">
#SystemFrame {
  .SystemFrame-container {
    display: flex;
    height: calc(100vh - 60px);
    .SystemFrame-page {
      width: calc(100% - 200px);
      height: 100%;
      padding: $space $space 0 $space;
      box-sizing: border-box;
      background-color: #f5f5f5;
      .system-page {
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        border-radius: $border-radius;
        background-color: $bg-color;
      }
    }
  }
  @media screen and (max-width: 750px) {
    .SystemFrame-container {
      .SystemFrame-page {
        width: 100%;
      }
    }
  }
}
html.dark {
  #SystemFrame {
    .SystemFrame-container {
      .SystemFrame-page {
        background-color: #1e1e1e;
      }
    }
  }
}
</style>
