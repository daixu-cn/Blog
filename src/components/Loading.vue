<template>
  <div v-show="props.loading" id="Loading">
    <div class="container">
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="shadow"></div>
      <div class="shadow"></div>
      <div class="shadow"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
#Loading {
  --height: 60px;

  width: 100%;
  height: calc(var(--height) + 6px);
  margin-bottom: $space;

  .container {
    width: 200px;
    height: var(--height);
    margin: 0 auto;
    position: relative;
    z-index: 1;

    .circle {
      width: 20px;
      height: 20px;
      position: absolute;
      border-radius: 50%;
      background-color: $font-color-placeholder;
      opacity: 0.3;
      left: 15%;
      transform-origin: 50%;
      animation: jump 0.5s alternate infinite ease;
      &:nth-child(2) {
        left: 45%;
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        left: auto;
        right: 15%;
        animation-delay: 0.3s;
      }
    }

    .shadow {
      width: 20px;
      height: 4px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.1);
      position: absolute;
      top: calc(var(--height) + 2px);
      transform-origin: 50%;
      z-index: -1;
      left: 15%;
      filter: blur(1px);
      animation: shadow 0.5s alternate infinite ease;

      &:nth-child(4) {
        left: 45%;
        animation-delay: 0.2s;
      }

      &:nth-child(5) {
        left: auto;
        right: 15%;
        animation-delay: 0.3s;
      }
    }

    @keyframes jump {
      0% {
        top: var(--height);
        height: 5px;
        border-radius: 50px 50px 25px 25px;
        transform: scaleX(1.7);
      }

      40% {
        height: 20px;
        border-radius: 50%;
        transform: scaleX(1);
      }

      100% {
        top: 0%;
      }
    }

    @keyframes shadow {
      0% {
        transform: scaleX(1.5);
      }

      40% {
        transform: scaleX(1);
        opacity: 0.7;
      }

      100% {
        transform: scaleX(0.2);
        opacity: 0.4;
      }
    }
  }
}
html.dark {
  #Loading {
    .container {
      .circle {
        background-color: $font-color;
      }
      .shadow {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
  }
}
</style>
