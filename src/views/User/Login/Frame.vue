<template>
  <div id="LoginFrame">
    <Snowflake>
      <router-view v-slot="{ Component }">
        <transition name="login-route-animation" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </Snowflake>
  </div>
</template>

<script lang="ts" setup>
import Snowflake from "@/components/Snowflake.vue"
</script>

<style lang="scss">
#LoginFrame {
  $color-primary: rgba(#45d6bb, 0.5);
  $color-box-shadow: rgba($color-primary, 0.2);

  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(232 232 232 / 20%);

  .login-route-animation-enter-from,
  .login-route-animation-leave-to {
    opacity: 0;
    transform: translateY(-10%);
  }
  .login-route-animation-enter-to,
  .login-route-animation-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
  .login-route-animation-enter-active,
  .login-route-animation-leave-active {
    transition: all 0.5s;
  }

  .module {
    width: 350px;
    box-sizing: border-box;
    padding: 25px 35px;
    border-radius: 40px;
    background-color: aliceblue;
    border: 5px solid #fff;
    box-shadow: $color-box-shadow 0px 30px 30px -20px;

    .title {
      text-align: center;
      font-size: 32px;
      color: $color-primary;
      font-weight: 900;
      user-select: none;
      letter-spacing: 0.5em;
      text-indent: 0.5em;
      @include flex-center;
    }

    .form {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      input {
        caret-color: $color-primary;
        width: 100%;
        padding: 15px 20px;
        box-sizing: border-box;
        border: 0;
        outline: none;
        box-shadow: $color-box-shadow 0px 10px 10px -5px;
        border-inline: 2px solid transparent;
        margin-top: 20px;
        background-color: #fff;
        border-radius: 20px;
        color: $font-color-secondary;
        &:first-child {
          margin-top: 0;
        }
        &::placeholder {
          font-weight: bold;
          color: #acb7c9;
        }
        &:focus {
          animation: input-animation 2s infinite;
        }
        @keyframes input-animation {
          50% {
            box-shadow: rgba($color-primary, 0.5) 0px 23px 10px -20px;
          }
        }
      }
    }
    .action,
    .action-small {
      width: 100%;
      margin-bottom: 20px;
      height: 45px;
      line-height: 45px;
      color: #fff;
      user-select: none;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      border-radius: 20px;
      border: 0;
      background: linear-gradient(
        to right,
        rgba($color-primary, 0.3),
        rgba(#a6c1ee, 0.7),
        rgba($color-primary, 0.3)
      );
      background-size: 200%;
      box-shadow: $color-box-shadow 0px 23px 10px -20px;
      &:hover {
        animation: action-animation 3s infinite;
      }
      &:active {
        border-color: transparent;
      }
      @keyframes action-animation {
        50% {
          background-position: 200%;
        }
      }
    }
    .code-container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      .code {
        width: 55%;
      }
      .action-small {
        width: calc(45% - $space);
        height: 45px;
        line-height: 45px;
        letter-spacing: 0;
        margin: 0;
      }
      .disabled {
        background: #f5f7fa;
        border-color: transparent;
        color: #c0c4cc;
        cursor: not-allowed;
      }
    }

    .auth {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-bottom: 30px;
      span {
        color: $color-primary;
        cursor: pointer;
      }
      p {
        cursor: pointer;
        color: rgba(#000, 0.3);
        span {
          margin-left: 5px;
        }
      }
    }
  }
  @media screen and (max-width: 400px) {
    .frame {
      width: 90%;
      padding: 40px 20px;
    }
  }
}
</style>
