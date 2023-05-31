<template>
  <el-dialog
    id="ApplyDialog"
    v-model="show"
    :title="i18n.global.t('Links.apply')"
    @close="linkRef?.resetFields()"
  >
    <el-form
      ref="linkRef"
      :model="link"
      :rules="rules"
      status-icon
      label-width="0"
    >
      <el-form-item prop="name">
        <el-input
          v-model="link.name"
          :placeholder="i18n.global.t('Links.name')"
        />
      </el-form-item>
      <el-form-item prop="url">
        <el-input
          v-model="link.url"
          :placeholder="i18n.global.t('Links.url')"
        />
      </el-form-item>
      <el-form-item prop="description">
        <el-input
          v-model="link.description"
          :placeholder="i18n.global.t('Links.description')"
        />
      </el-form-item>
      <el-form-item prop="logo">
        <el-input
          v-model="link.logo"
          :placeholder="i18n.global.t('Links.logo')"
        />
      </el-form-item>
      <el-form-item prop="email">
        <el-input
          v-model="link.email"
          :placeholder="i18n.global.t('Links.email')"
        />
      </el-form-item>
      <el-form-item prop="qq">
        <el-input v-model="link.qq" :placeholder="i18n.global.t('Links.qq')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="confirm">
          {{ $t("Links.submit") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import http from "@/server"
import { ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import i18n from "@/locale"

const show = ref(false)
const loading = ref(false)
const link = reactive({
  name: null,
  description: null,
  logo: null,
  url: null,
  email: null,
  qq: null
})
const linkRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: i18n.global.t("Links.rules.name"),
      trigger: "blur"
    }
  ],
  url: [
    {
      required: true,
      message: i18n.global.t("Links.rules.url"),
      trigger: "blur"
    }
  ],
  description: [
    {
      required: true,
      message: i18n.global.t("Links.rules.description"),
      trigger: "blur"
    }
  ]
})

async function confirm() {
  const valid = await linkRef.value?.validate()
  if (valid) {
    loading.value = true
    const res = await http.put("/link/create", link)
    if (res.code === 0) {
      ElMessage.success(i18n.global.t("Links.applySuccess"))
      show.value = false
    }
    loading.value = false
  }
}

defineExpose({
  show
})
</script>

<style lang="scss">
#ApplyDialog {
  .el-dialog__body {
    padding-bottom: 0;
    .el-input__wrapper {
      box-shadow: none;
      border-bottom: 1px solid $border-color;
    }
    .el-form-item__error {
      padding-left: 11px;
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
