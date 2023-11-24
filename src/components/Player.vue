<template>
  <div id="Player" v-loading="loading" element-loading-text="加载中...">
    <video id="player" playsinline controls :data-poster="props.poster" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onBeforeUnmount, reactive, PropType } from "vue"
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
  },
  plyrProps: {
    type: Object as PropType<Plyr.Options>,
    default: () => ({})
  }
})

const loading = ref(false)
const player = ref<Plyr>()
const options = reactive<Plyr.Options>({
  i18n: {
    speed: "速度",
    normal: "正常"
  },
  ...props.plyrProps
})
// 记录上次的播放时间
let playLastTime = 0

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
      player.value.on("play", event => {
        emits("play", event.detail.plyr)
      })

      player.value.on("seeking", event => {
        const instance = event.detail.plyr

        if (instance.currentTime > playLastTime) {
          loading.value = true
          instance.play()
        }

        playLastTime = instance.currentTime
      })
      player.value.on("timeupdate", event => {
        const { currentTime } = event.detail.plyr

        if (currentTime > playLastTime && loading.value) {
          loading.value = false
        }

        playLastTime = currentTime
      })
      player.value.on("waiting", () => {
        loading.value = true
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
