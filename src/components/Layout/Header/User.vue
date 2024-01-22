<template>
  <div id="User" class="dropdown-container">
    <el-dropdown v-if="userStore.info" :teleported="false">
      <div class="icon-container">
        <slot />
        <span v-if="userStore.info && !slots.default" class="userName">{{
          userStore.info.userName
        }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu v-if="userStore.info">
          <el-dropdown-item
            v-if="
              userStore?.info.role === 0 &&
              !route.fullPath.startsWith('/system')
            "
            @click="goToPage('/system')"
          >
            后台系统</el-dropdown-item
          >
          <el-dropdown-item @click="goToPage('/account')">
            账户中心</el-dropdown-item
          >
          <el-dropdown-item @click="loginOut"> 退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <Icon v-else class="icon-user" @click="goToPage('/login')" />
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from "vue"
import { useRoute, useRouter } from "vue-router"
import useUserStore from "@/store/user"

const slots = useSlots()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const emits = defineEmits(["router"])

function goToPage(path: string) {
  emits("router")
  router.push(path)
}
function loginOut() {
  userStore.reset()
  goToPage("/login")
}
</script>

<style lang="scss">
#User {
  .userName {
    display: inline-block;
    max-width: 70px;
    font-size: $font-size;
    cursor: pointer;
    transition: all $duration;
    @include text-ellipsis;
    &:hover {
      color: $color-primary;
    }
  }
}
</style>
