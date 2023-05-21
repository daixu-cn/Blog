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
            v-if="userStore?.info.role === 0"
            @click="goToPage('/system')"
          >
            {{ $t("menu.system") }}</el-dropdown-item
          >
          <el-dropdown-item @click="goToPage('/account')">
            {{ $t("menu.account") }}</el-dropdown-item
          >
          <el-dropdown-item @click="loginOut">
            {{ $t("login.signOut") }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <Icon v-else class="icon-user" @click="goToPage('/login')" />
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from "vue"
import useUserStore from "@/store/user"
import { useRouter } from "vue-router"

const slots = useSlots()
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
    width: 70px;
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
