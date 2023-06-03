<template>
  <div id="Player">
    <video id="player" playsinline controls :data-poster="props.poster" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onBeforeUnmount, reactive } from "vue"
import Plyr from "plyr"
import i18n from "@/locale"

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
    speed: i18n.global.t("plyr.speed"),
    normal: i18n.global.t("plyr.normal")
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
    height: 100%;
  }
}
</style>
