<template>
  <div id="Header" :class="{ hidden: isSearch }">
    <div class="container">
      <div class="nav">
        <div class="logo" @click="goToPage('Frame')">
          <Icon class="icon-logo" />
        </div>
        <Menu />
      </div>
      <div class="mobileMenu">
        <Icon class="icon-menu-list" @click="NavMobileRef.drawer = true"></Icon>
      </div>
      <div class="shortcut">
        <Search @open="isSearch = true" />
        <FullScreen />
        <Theme />
        <Mode />
        <Checker v-if="userStore.info?.role === 0" />
        <User />
      </div>
    </div>
  </div>
  <SearchModal :show="isSearch" @close="searchClose" />
  <NavMobile ref="NavMobileRef" />
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import useUserStore from "@/store/user"
import NavMobile from "./NavMobile.vue"
import Menu from "./Menu.vue"
import Search from "./Search.vue"
import SearchModal from "./SearchModal.vue"
import FullScreen from "./FullScreen.vue"
import Theme from "./Theme.vue"
import Mode from "./Mode.vue"
import Checker from "./Checker.vue"
import User from "./User.vue"

const userStore = useUserStore()
const isSearch = ref(false)
const NavMobileRef = ref()
const router = useRouter()

function goToPage(name: string) {
  router.push({ name })
}

function searchClose() {
  isSearch.value = false
  const SearchModalEL = document.querySelector("#SearchModal") as HTMLElement
  SearchModalEL.style.display = "none"
}
</script>

<style lang="scss">
#Header {
  position: sticky;
  top: 0;
  z-index: 3;
  height: 60px;
  box-sizing: border-box;
  border-bottom: 1px solid $border-color;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  transition:
    transform 0.5s,
    opacity 0.5s;
  &.hidden {
    transform: scale(0);
    opacity: 0;
  }
  .container {
    @include media-width;
    height: 100%;
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
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
  @media screen and (max-width: 800px) {
    .container {
      .nav {
        .logo {
          display: none;
        }
      }
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
        #User {
          display: none;
        }
        #Mode {
          margin-right: 0;
        }
      }
    }
  }
}
html.dark {
  #Header {
    background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>
