<template>
  <div v-if="screenfull.isEnabled" id="FullScreen" class="dropdown-container">
    <Icon
      v-if="!isFullscreen"
      class="icon-fullscreen"
      @click="screenfull.toggle()"
    />
    <Icon v-else class="icon-fullscreen-exit" @click="screenfull.toggle()" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import screenfull from "screenfull"

const isFullscreen = ref(screenfull.isFullscreen)

screenfull.onchange?.(() => {
  isFullscreen.value = screenfull.isFullscreen
})
</script>
