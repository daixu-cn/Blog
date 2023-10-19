<template>
  <div id="EditableInput">
    <div v-if="!form.isEditable" class="notEdit">
      <span class="defaultValue">{{ defaultValue }} </span>
      <div class="suffix">
        <span v-if="props.unit" class="unit">{{ props.unit }}</span>
        <el-icon v-if="!props.isRead" class="edit-icon" @click="edit">
          <i-ep-edit />
        </el-icon>
      </div>
    </div>
    <el-input
      v-if="form.isEditable"
      ref="input"
      v-model.trim="form.value"
      :disabled="form.loading"
    >
      <template #suffix>
        <el-icon v-show="form.loading" class="is-loading">
          <i-ep-loading />
        </el-icon>
        <el-icon v-show="!form.loading" class="saveIcon" @click="save()">
          <i-ep-circleCheck />
        </el-icon>
        <el-icon v-show="!form.loading" @click="cancel()">
          <i-ep-circleClose />
        </el-icon>
      </template>
    </el-input>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick } from "vue"
import { ElMessage } from "element-plus"
import http from "@/server"

interface EditableFrom {
  loading: boolean
  isEditable: boolean
  value: string | number
}

const props = defineProps({
  // 是否为只读模式
  isRead: {
    type: Boolean,
    default: false
  },
  // 是否自定义处理编辑函数
  isCustom: {
    type: Boolean,
    default: false
  },
  params: {
    type: Object,
    default: () => {}
  },
  // 修改的接口
  url: {
    type: String,
    default: ""
  },
  // 修改的属性
  attr: {
    type: String,
    default: ""
  },
  // 修改的原始值
  defaultValue: {
    type: [String, Number],
    default: ""
  },
  // 修改请求的类型
  method: {
    type: String,
    default: "patch"
  },
  // 数据单位
  unit: {
    type: String,
    default: ""
  },
  // 当该组件为可编辑状态下，并且该值为 true 则编辑按钮只会在鼠标移入该组件下显示
  editOnHover: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(["save", "cancel", "customEditing"])
const form = reactive<EditableFrom>({
  loading: false,
  isEditable: false,
  value: props.defaultValue
})
const input = ref()

function edit() {
  if (props.isCustom) {
    emits("customEditing")
  } else {
    form.isEditable = true
    nextTick(() => input.value?.focus())
  }
}
async function save() {
  try {
    form.loading = true
    const res = await http[props.method](props.url, {
      [props.attr]: form.value,
      ...props.params
    })
    if (res.code === 0) {
      ElMessage.success("编辑成功!")
      form.isEditable = false

      emits("save", res.data)
    } else {
      ElMessage.error(res.msg)
    }
  } finally {
    form.loading = false
  }
}
function cancel() {
  form.value = props.defaultValue
  form.isEditable = false

  emits("cancel")
}
</script>
<style lang="scss">
#EditableInput {
  width: 250px;
  height: 32px;
  background-color: #fafafa;
  .notEdit {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 11px;
    box-sizing: border-box;

    .defaultValue {
      display: inline-block;
      @include text-ellipsis;
    }

    .suffix {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .edit-icon {
        margin-left: $space;
        transition: all $duration;
        opacity: v-bind("props.editOnHover ? 0 : 1");
      }

      .unit {
        color: $font-color-placeholder;
        user-select: none;
        margin-left: $space;
      }
    }

    &:hover {
      .suffix {
        .edit-icon {
          opacity: 1;
        }
      }
    }
  }
  .el-input {
    .el-input__wrapper {
      box-shadow: none;
      padding: 0 11px;
      background-color: transparent;
      .el-input__inner {
        font-size: $font-size;
        font-family: $font-family;
        height: 32px;
        line-height: 32px;
      }
      .saveIcon {
        margin: 0 5px;
      }
    }
  }
  .el-icon {
    color: $color-primary;
    cursor: pointer;
    font-size: 16px;
  }
}
html.dark {
  #EditableInput {
    background-color: $bg-color-overlay;
  }
}
</style>
