<template>
  <el-dialog
    id="SystemUpdates-ActionDialog"
    v-model="show"
    :title="updateId ? '编辑更新' : '新建更新'"
    @close="reset"
  >
    <TransitionGroup tag="ul" name="fade" class="updates-list">
      <li v-for="(_, index) of list" :key="index">
        <el-input
          v-model="list[index]"
          :placeholder="`第 ${nzh.cn.encodeS(index + 1)} 条更新:`"
          :autosize="{ maxRows: 3 }"
          type="textarea"
          @input="lastListChange(index)"
        />
      </li>
    </TransitionGroup>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="confirm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue"
import { ElMessage } from "element-plus"
import nzh from "nzh"
import http from "@/server"

const emits = defineEmits(["confirm"])
const show = ref(false)
const loading = ref(false)
const updateId = ref("")
const list = reactive<string[]>([""])

function openDialog() {
  show.value = true
}
function lastListChange(index: number) {
  if (index === list.length - 1 && list[index]) {
    list.push("")
    return
  }
  if (index !== list.length - 1 && !list[index]) {
    list.splice(index, 1)
  }
}
async function confirm() {
  const content = list
    .map(content => content.trim())
    .join("\t")
    .slice(0, -1)

  if (!content) {
    ElMessage.error("请至少输入一条更新内容")
    return
  }

  try {
    loading.value = true

    const url = updateId.value ? "/update/update" : "/update/create"
    const methods = updateId.value ? "patch" : "put"
    const res = await http[methods](url, {
      updateId: updateId.value,
      content
    })

    if (res.code === 0) {
      ElMessage.success("操作成功")
      show.value = false
      emits("confirm")
    }
  } finally {
    loading.value = false
  }
}
function reset() {
  updateId.value = ""
  list.splice(0, list.length, "")
}

defineExpose({
  openDialog,
  updateId,
  list
})
</script>

<style lang="scss">
#SystemUpdates-ActionDialog {
  .el-dialog__body {
    padding-bottom: 0;
    .updates-list {
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $space;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
      transform: translateX(30px);
    }
  }
  .dialog-footer {
    width: 100%;
    .el-button {
      width: 100%;
    }
  }
}
</style>
