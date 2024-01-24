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
import usePlayer from "@/store/player"

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

const { setPlayer, removePlayer } = usePlayer()
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

/**
 * @description 获取视频类型
 * @param {string} url 视频地址
 * @return {string} 视频类型
 */
async function getVideoType(url: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const response = await fetch(url, { method: "HEAD" })

      if (response.ok) {
        const type = response.headers.get("Content-Type")

        if (type) {
          resolve(type)
        } else {
          reject(response)
        }
      } else {
        reject(response)
      }
    } catch (error) {
      reject(error)
    }
  })
}

function setupDefault(type: string) {
  if (player.value) {
    player.value.source = {
      type: "video",
      sources: [
        {
          src: props.src,
          type
        }
      ]
    }
  }
}

function setupHls(video: HTMLMediaElement) {
  if (Hls.isSupported()) {
    const hls = new Hls()
    hls.loadSource(props.src)
    hls.attachMedia(video)
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = props.src
  } else {
    ElMessage.error("不支持本站视频，建议更换谷歌浏览器")
  }
}

watch(
  () => props.src,
  () => {
    nextTick(async () => {
      try {
        const video = document.getElementById(id.value) as HTMLMediaElement

        if (!player.value) {
          player.value = new Plyr(video, options)
          player.value.on("play", event => {
            setPlayer(event.detail.plyr)
            emits("play", event.detail.plyr)
          })
        }

        const type = await getVideoType(props.src)
        if (type.startsWith("video/")) {
          setupDefault(type)
        } else {
          setupHls(video)
        }
      } catch (error) {
        ElMessage.error("视频加载失败")
      }
    })
  },
  {
    immediate: true
  }
)

onBeforeUnmount(() => {
  removePlayer()
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
