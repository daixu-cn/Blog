<template>
  <div id="SystemHeader">
    <div class="container">
      <div class="nav">
        <div class="logo" @click="goToPage('Frame')">
          <Icon class="icon-logo" />
        </div>
      </div>
      <div class="mobileMenu">
        <Icon class="icon-menu-list" @click="NavMobileRef.drawer = true"></Icon>
      </div>
      <div class="shortcut">
        <FullScreen />
        <Locale />
        <Theme />
        <Mode />
        <User />
      </div>
    </div>
  </div>
  <NavMobile ref="NavMobileRef" />
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import User from "@/views/Client/Frame/Header/User.vue"
import NavMobile from "@/views/Client/Frame/Header/NavMobile.vue"
import FullScreen from "@/views/Client/Frame/Header/FullScreen.vue"
import Locale from "@/views/Client/Frame/Header/Locale.vue"
import Theme from "@/views/Client/Frame/Header/Theme.vue"
import Mode from "@/views/Client/Frame/Header/Mode.vue"

const router = useRouter()
const NavMobileRef = ref()

function goToPage(name: string) {
  router.push({ name })
}
</script>

<style lang="scss">
#SystemHeader {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 60px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
  background-image: radial-gradient(transparent 1px, $bg-color 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  .container {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    #Icon {
      font-size: 20px;
      transition: all $duration;
      &:hover {
        color: $color-primary;
        cursor: pointer;
      }
    }
    .nav {
      display: flex;
      align-items: center;
      .logo {
        height: 100%;
        margin-right: 30px;
        color: $color-primary;
        transition: all $duration;
        #Icon {
          font-size: 60px;
        }
        &:hover {
          cursor: pointer;
          opacity: 0.6;
        }
      }
    }
    .mobileMenu {
      display: none;
      align-items: center;
    }
    .shortcut {
      display: flex;
      align-items: center;

      .dropdown-container {
        height: 20px;
        margin-right: calc($space + 10px);
        color: $font-color;
        &:last-child {
          margin-right: 0;
        }
        .el-dropdown {
          color: inherit;
          .icon-container {
            height: 20px;
            font-size: 20px;
            outline: 0;
          }
          .el-popper__arrow {
            display: none;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1250px) {
    .container {
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
  @media screen and (max-width: 750px) {
    .container {
      padding: 0 10px;
      .nav {
        display: none;
      }
      .mobileMenu {
        display: flex;
      }
      .shortcut {
        #Mode {
          margin-right: 0;
        }
        #User {
          display: none;
        }
      }
    }
  }
}
</style>
