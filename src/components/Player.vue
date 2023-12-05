<template>
  <div :id="PlayerID" />
</template>

<script lang="ts" setup>
import { ref, watch, computed, nextTick, onBeforeUnmount, PropType } from "vue"
import { nanoid } from "nanoid"
import Player, { IPlayerOptions } from "xgplayer"
import HlsJsPlayer from "xgplayer-hls.js"

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
  options: {
    type: Object as PropType<IPlayerOptions>,
    default: () => ({})
  }
})

const PlayerID = computed(() => {
  return `Player-${nanoid()}`
})
const player = ref<Player>()

watch(
  () => props.src,
  () => {
    nextTick(() => {
      if (!player.value) {
        player.value = new Player({
          id: PlayerID.value,
          url: props.src, // 视频地址
          poster: props.poster, // 封面图
          width: "100%",
          height: document.body.clientWidth * 0.6,
          fluid: true,
          playsinline: true, // 内联模式
          videoInit: true, // 显示视频首帧
          rotateFullscreen: true, // 横屏全屏
          // 视频旋转
          rotate: {
            clockwise: false, // 旋转方向是否为顺时针
            innerRotate: true // 只旋转内部video
          },
          playbackRate: [0.5, 1, 1.5, 2, 4], // 倍速播放
          plugins: [HlsJsPlayer],
          ...props.options
        })
      }

      player.value.once("play", () => {
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
