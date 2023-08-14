<template>
  <div id="Player">
    <video id="player" playsinline controls :data-poster="props.poster" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onBeforeUnmount, reactive } from "vue"
import Plyr from "plyr"

const emits = defineEmits(["play"])
const props = defineProps({
  src: {
    type: String,
    default: ""
  },
  poster: {
    type: String,
    default: ""
  }
})
const player = ref<Plyr>()
const options = reactive<Plyr.Options>({
  i18n: {
    speed: "速度",
    normal: "正常"
  }
})

watch(
  () => props.src,
  () => {
    nextTick(() => {
      if (!player.value) {
        player.value = new Plyr("#player", options)
      }
      player.value.source = {
        type: "video",
        sources: [
          {
            src: props.src,
            type: "video/mp4"
          }
        ]
      }
      player.value.on("play", () => {
        emits("play")
      })
    })
  },
  {
    immediate: true
  }
)

onBeforeUnmount(() => {
  player.value?.destroy()
})
</script>

<style lang="scss">
#Player {
  width: 100%;
  .plyr {
    &:fullscreen {
      video {
        max-height: initial;
      }
    }
    video {
      height: 100%;
      max-height: 600px;
    }
  }

  @media screen and (max-width: 750px) {
    .plyr {
      video {
        max-height: initial;
      }
    }
  }
}
</style>
