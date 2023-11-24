<template>
  <div>
    <el-image-viewer
      v-if="props.show"
      :url-list="props.urlList"
      :initial-index="props.initialIndex"
      teleported
      @close="emits('close')"
    />
  </div>
</template>

<script lang="ts" setup>
import { PropType, watch } from "vue"

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  urlList: {
    type: Array as PropType<string[]>,
    default() {
      return []
    }
  },
  initialIndex: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(["close"])
const body = document.querySelector("body") as HTMLBodyElement

watch(
  () => props.show,
  show => {
    body.style.overflow = show ? "hidden" : ""
  }
)
</script>
