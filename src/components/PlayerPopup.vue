<template>
  <el-dialog
    id="PlayerPopup"
    :model-value="show"
    :title="title ?? src"
    destroy-on-close
    @close="emits('onClose')"
  >
    <Player :src="src" :poster="poster" />
  </el-dialog>
</template>

<script lang="ts" setup>
import Player from "@/components/Player.vue"

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String
  },
  src: {
    type: String,
    required: true
  },
  poster: {
    type: String
  }
})

const emits = defineEmits(["onClose"])
</script>

<style lang="scss">
#PlayerPopup {
  width: 80%;
  max-width: 800px;
  .el-dialog__header {
    padding: $space;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-dialog__headerbtn {
      position: static;
      width: unset;
      height: unset;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}

@media screen and (max-width: 900px) {
  #PlayerPopup {
    width: calc(100% - 2 * $space);
  }
}
</style>
