<template>
  <el-dialog
    id="ApplyDialog"
    v-model="show"
    align-center
    :title="i18n.global.t('Links.apply')"
    @close="linkRef?.resetFields()"
  >
    <ul class="siteInfo">
      <li>
        <label>{{ $t("Links.label.name") }}</label>
        <span class="colon">:</span>
        DAIXU BLOG
      </li>
      <li>
        <label>{{ $t("Links.label.url") }}</label>
        <span class="colon">:</span>
        https://daixu.cn
      </li>
      <li>
        <label>{{ $t("Links.label.favicon") }}</label>
        <span class="colon">:</span>
        https://api.daixu.cn/favicon.png
      </li>
      <li>
        <label>{{ $t("Links.label.desc") }}</label>
        <span class="colon">:</span>
        {{ $t("Links.info.description") }}
      </li>
    </ul>
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
          type="url"
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
          type="email"
        />
      </el-form-item>
      <el-form-item prop="qq">
        <el-input
          v-model="link.qq"
          :placeholder="i18n.global.t('Links.qq')"
          type="number"
        />
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
import { ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import http from "@/server"
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
    .siteInfo {
      background-color: var(--el-color-primary-light-9);
      padding: $space;
      border-radius: $border-radius;
      margin-bottom: 18px;
      li {
        margin-bottom: $space;
        line-height: 1.5em;
        color: $font-color-secondary;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
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
