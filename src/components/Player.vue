<template>
  <div id="Player" v-loading="loading" element-loading-text="加载中...">
    <video :id="id" playsinline controls :data-poster="props.poster" />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  watch,
  nextTick,
  onBeforeUnmount,
  reactive,
  PropType,
  computed
} from "vue"
import Plyr from "plyr"
import Hls from "hls.js"
import { ElMessage } from "element-plus"
import { nanoid } from "nanoid"

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

const id = computed(() => {
  return `player-${nanoid()}`
})
const loading = ref(false)
const player = ref<Plyr>()
const options = reactive<Plyr.Options>({
  i18n: {
    speed: "速度",
    normal: "正常"
  },
  captions: {
    active: true,
    language: "auto",
    update: true
  },
  ...props.plyrProps
})

watch(
  () => props.src,
  () => {
    nextTick(() => {
      if (Hls.isSupported()) {
        const video = document.getElementById(id.value) as HTMLMediaElement
        if (!player.value) {
          player.value = new Plyr(video, options)
          player.value.on("play", event => {
            emits("play", event.detail.plyr)
          })
        }
        const hls = new Hls()
        hls.loadSource(props.src)
        hls.attachMedia(video)
      } else {
        ElMessage.error("不支持本站视频，建议更换谷歌浏览器")
      }
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
