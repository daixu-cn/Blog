<template>
  <div v-show="show" id="Loading">
    <div class="container">
      <span class="girl"></span>
      <div class="boys">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue"

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  delay: {
    type: Number,
    default: 0
  }
})

const show = ref(false)
let timer: number

watchEffect(() => {
  if (props.loading) {
    if (props.delay) {
      timer = setTimeout(() => {
        show.value = true
      }, props.delay)
    } else {
      show.value = true
    }
  } else {
    clearTimeout(timer)
    show.value = false
  }
})
</script>

<style lang="scss" scoped>
#Loading {
  width: 100%;

  .container {
    width: 8em;
    height: 1em;
    margin: 0 auto;
    font-size: 35px;
    display: flex;
    justify-content: space-between;
    span {
      width: 1em;
      height: 1em;
      --duration: 1.5s;
    }
  }
  .girl {
    animation: slide var(--duration) ease-in-out infinite alternate;

    &::before {
      content: "";
      position: absolute;
      width: inherit;
      height: inherit;
      border-radius: 15%;
      box-shadow: 0 0 0.1em rgba(0, 0, 0, 0.3);
      background-color: hotpink;
    }
  }

  @keyframes slide {
    from {
      transform: translateX(0);
      filter: brightness(1);
    }

    to {
      transform: translatex(calc(8em - (1em * 1.25)));
      filter: brightness(1.45);
    }
  }

  .boys {
    width: 6em;
    display: flex;
    justify-content: space-between;
    span {
      animation: var(--duration) ease-in-out infinite alternate;
      &::before {
        content: "";
        position: absolute;
        width: inherit;
        height: inherit;
        border-radius: 15%;
        box-shadow: 0 0 0.1em rgba(0, 0, 0, 0.3);
        background-color: dodgerblue;
        animation: var(--duration) ease-in-out infinite alternate;
      }
      &:nth-child(1) {
        animation-name: jump-off-1;
        &::before {
          filter: brightness(1);
          animation-name: jump-down-1;
        }
      }

      &:nth-child(2) {
        animation-name: jump-off-2;
        &::before {
          filter: brightness(1.15);
          animation-name: jump-down-2;
        }
      }

      &:nth-child(3) {
        animation-name: jump-off-3;
        &::before {
          filter: brightness(1.3);
          animation-name: jump-down-3;
        }
      }

      &:nth-child(4) {
        animation-name: jump-off-4;
        &::before {
          filter: brightness(1.45);
          animation-name: jump-down-4;
        }
      }
    }
  }
  @keyframes jump-off-1 {
    0%,
    15% {
      transform: rotate(0deg);
    }

    35%,
    100% {
      transform-origin: -50% center;
      transform: rotate(-180deg);
    }
  }

  @keyframes jump-off-2 {
    0%,
    30% {
      transform: rotate(0deg);
    }

    50%,
    100% {
      transform-origin: -50% center;
      transform: rotate(-180deg);
    }
  }

  @keyframes jump-off-3 {
    0%,
    45% {
      transform: rotate(0deg);
    }

    65%,
    100% {
      transform-origin: -50% center;
      transform: rotate(-180deg);
    }
  }

  @keyframes jump-off-4 {
    0%,
    60% {
      transform: rotate(0deg);
    }

    80%,
    100% {
      transform-origin: -50% center;
      transform: rotate(-180deg);
    }
  }

  @keyframes jump-down-1 {
    5% {
      transform: scale(1, 1);
    }

    15% {
      transform-origin: center bottom;
      transform: scale(1.3, 0.7);
    }

    20%,
    25% {
      transform-origin: center bottom;
      transform: scale(0.8, 1.4);
    }

    40% {
      transform-origin: center top;
      transform: scale(1.3, 0.7);
    }

    55%,
    100% {
      transform: scale(1, 1);
    }
  }

  @keyframes jump-down-2 {
    20% {
      transform: scale(1, 1);
    }

    30% {
      transform-origin: center bottom;
      transform: scale(1.3, 0.7);
    }

    35%,
    40% {
      transform-origin: center bottom;
      transform: scale(0.8, 1.4);
    }

    55% {
      transform-origin: center top;
      transform: scale(1.3, 0.7);
    }

    70%,
    100% {
      transform: scale(1, 1);
    }
  }

  @keyframes jump-down-3 {
    35% {
      transform: scale(1, 1);
    }

    45% {
      transform-origin: center bottom;
      transform: scale(1.3, 0.7);
    }

    50%,
    55% {
      transform-origin: center bottom;
      transform: scale(0.8, 1.4);
    }

    70% {
      transform-origin: center top;
      transform: scale(1.3, 0.7);
    }

    85%,
    100% {
      transform: scale(1, 1);
    }
  }

  @keyframes jump-down-4 {
    50% {
      transform: scale(1, 1);
    }

    60% {
      transform-origin: center bottom;
      transform: scale(1.3, 0.7);
    }

    65%,
    70% {
      transform-origin: center bottom;
      transform: scale(0.8, 1.4);
    }

    85% {
      transform-origin: center top;
      transform: scale(1.3, 0.7);
    }

    100%,
    100% {
      transform: scale(1, 1);
    }
  }
}
</style>
