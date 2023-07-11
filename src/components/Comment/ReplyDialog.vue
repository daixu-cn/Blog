<template>
  <el-dialog
    id="ReplyDialog"
    v-model="show"
    :title="`@${reply?.userName}`"
    @opened="mdEditor?.Editor?.focus()"
    @close="reset"
  >
    <MdEditor
      ref="mdEditor"
      :preview="false"
      :is-upload="false"
      :placeholder="i18n.global.t('Reply.placeholder')"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="confirm">
          {{ $t("Reply.submit") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import http from "@/server"
import { ElMessage } from "element-plus"
import useUserStore from "@/store/user"
import MdEditor from "@/components/MdEditor.vue"
import i18n from "@/locale"

const emits = defineEmits(["confirm"])
const userStore = useUserStore()
const mdEditor = ref<InstanceType<typeof MdEditor> | null>(null)
const show = ref(false)
const loading = ref(false)
const comment = ref()
const reply = reactive<any>({
  userName: null,
  content: null,
  commentId: null,
  parentId: null
})

async function confirm() {
  if (!userStore.token) {
    ElMessage.warning(i18n.global.t("login.notLogged"))
    return
  }
  reply.content = mdEditor.value?.text

  if (!reply.content) {
    ElMessage.warning(i18n.global.t("Reply.rules.content"))
    return
  }

  loading.value = true
  const res = await http.put("/reply/create", reply)
  if (res.code === 0) {
    ElMessage.success(i18n.global.t("Reply.success"))
    emits("confirm", comment.value, true)
    reset()
  }
  loading.value = false
}
function reset() {
  mdEditor.value!.text = ""
  reply.user = null
  reply.content = null
  reply.commentId = null
  reply.parentId = null
  show.value = false
}
defineExpose({
  show,
  reply,
  comment
})
</script>

<style lang="scss">
#ReplyDialog {
  width: 800px;
  .el-dialog__header {
    .el-dialog__title {
      color: $color-primary;
      &::after {
        display: none;
      }
    }
  }
  .el-dialog__body {
    padding: 20px 30px;
    .md-editor {
      height: 350px;
    }
  }
  .dialog-footer {
    width: 100%;
    .el-button {
      width: 100%;
    }
  }
}
@media screen and (max-width: 900px) {
  #ReplyDialog {
    width: 90%;
  }
}
</style>
