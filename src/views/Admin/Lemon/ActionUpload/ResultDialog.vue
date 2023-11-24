<template>
  <el-dialog
    id="SystemLemon-ResultDialog"
    :model-value="props.show"
    title="上传结果"
    destroy-on-close
    append-to-body
    @close="emits('close')"
  >
    <ul class="result">
      <li v-for="item of props.result" :key="item.uid">
        <p class="fileName">
          {{ item.name }}
        </p>

        <el-icon
          class="status"
          :class="{ 'is-loading': item.status === 'ready' }"
        >
          <i-ep-loading v-if="item.status === 'ready'" class="loading-icon" />
          <i-ep-successFilled
            v-else-if="item.status === 'success'"
            class="success-icon"
          />
          <i-ep-circleCloseFilled
            v-else-if="item.status === 'fail'"
            class="fail-icon"
          />
        </el-icon>
      </li>
    </ul>
  </el-dialog>
</template>

<script lang="ts" setup>
import { PropType } from "vue"
import type { UploadFile } from "element-plus"

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  result: {
    type: Array as PropType<UploadFile[]>,
    default: () => []
  }
})
const emits = defineEmits(["close"])
</script>

<style lang="scss">
#SystemLemon-ResultDialog {
  .result {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $space;
      &:last-child {
        margin-bottom: 0;
      }

      .fileName {
        @include text-ellipsis;
      }
      .status {
        margin-left: $space;
        .loading-icon {
          color: $color-primary;
        }
        .success-icon {
          color: $color-success;
        }
        .fail-icon {
          color: $color-danger;
        }
      }
    }
  }
}
</style>
