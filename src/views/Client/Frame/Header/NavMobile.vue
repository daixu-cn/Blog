<template>
  <div id="NavMobile">
    <el-drawer
      v-model="drawer"
      direction="ltr"
      :with-header="false"
      :z-index="1000"
      size="280px"
    >
      <div class="user">
        <el-image
          src="/src/assets/image/mobileBg.png"
          fit="cover"
          class="mobileBg"
        />
        <div class="user-info">
          <el-image
            src="/src/assets/image/avatar.png"
            fit="cover"
            class="avatar"
          />
          <div class="signature">
            <p>daixu</p>
            <p>{{ $t("site.signature") }}</p>
          </div>
        </div>
      </div>
      <el-menu :default-active="path">
        <el-menu-item
          v-for="item of menus"
          :key="item.path"
          :index="item.path"
          @click="goToPage(item.path)"
        >
          <span>{{ $t(item.name) }}</span>
        </el-menu-item>
      </el-menu>
      <ul class="footer">
        <li v-if="!userStore.info" class="login" @click="goToPage('/login')">
          {{ $t("login.login") }}
        </li>
        <User v-else @router="drawer = false">
          <li>
            <el-image
              src="/src/assets/image/avatar.png"
              fit="cover"
              class="avatar"
            />

            {{ userStore.info.userName }}
          </li>
        </User>
      </ul>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import menus from "@/global/menus"
import { useRoute, useRouter } from "vue-router"
import useUserStore from "@/store/user"
import User from "./User.vue"

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const drawer = ref(false)
const path = ref(`/${route.path.split("/")[1]}`)

function goToPage(path: string) {
  drawer.value = false
  router.push(path)
}

defineExpose({ drawer })
</script>

<style lang="scss">
#NavMobile {
  .el-overlay {
    backdrop-filter: blur(2px);
    .el-drawer__body {
      position: relative;
      padding: 0;
      .user {
        position: relative;
        width: 100%;
        height: 150px;
        .mobileBg {
          width: 100%;
          height: 100%;
        }
        .user-info {
          width: 80%;
          height: 80px;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
          display: flex;
          padding: $space;
          box-sizing: border-box;
          background-color: $bg-color;
          border-radius: $border-radius;
          .avatar {
            margin-right: 10px;
          }
          .signature {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            P {
              &:last-child {
                color: #ccc;
                font-size: 12px;
              }
            }
          }
        }
      }
      .el-menu {
        width: 60%;
        margin: 70px auto 0 auto;
        border: 0;
        .el-menu-item {
          height: 40px;
          line-height: 40px;
          padding: 0;
          background-color: transparent;
        }
      }
      .footer {
        width: 95%;
        border-top: 1px solid $border-color;
        box-sizing: border-box;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 0;
        li {
          width: 100%;
          display: flex;
          align-items: center;
          padding: $space;
          box-sizing: border-box;
          .avatar {
            width: 20px;
            height: 20px;
            border-radius: 2px;
            margin-right: $space;
          }
        }
        .login {
          justify-content: center;
        }
        #User {
          .el-dropdown {
            width: 100%;
            outline: 0;
            .el-tooltip__trigger {
              width: 100%;
              outline: 0;
            }
            .el-popper {
              width: 100%;
              left: 0;
              .el-popper__arrow {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
