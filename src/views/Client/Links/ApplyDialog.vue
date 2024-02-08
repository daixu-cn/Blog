<template>
  <el-dialog
    id="ApplyDialog"
    v-model="show"
    align-center
    title="友联申请"
    @close="linkRef?.resetFields()"
  >
    <ul class="siteInfo">
      <li>
        <label>名称</label>
        <span class="colon">:</span>
        DAIXU BLOG
      </li>
      <li>
        <label>地址</label>
        <span class="colon">:</span>
        https://daixu.cn
      </li>
      <li>
        <label>图标</label>
        <span class="colon">:</span>
        {{ `${ASSET_PREFIX}/image/favicon.png` }}
      </li>
      <li>
        <label>头像</label>
        <span class="colon">:</span>
        {{ `${ASSET_PREFIX}/image/avatar.png` }}
      </li>
      <li>
        <label>描述</label>
        <span class="colon">:</span>
        daixu个人博客 - 记录学习、分享生活, 本站用于IT技术交流,
        web技术分享及日常生活记录。
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
        <el-input v-model="link.name" placeholder="网站名称" />
      </el-form-item>
      <el-form-item prop="url">
        <el-input v-model="link.url" placeholder="网站地址" type="url" />
      </el-form-item>
      <el-form-item prop="description">
        <el-input v-model="link.description" placeholder="网站描述" />
      </el-form-item>
      <el-form-item prop="logo">
        <el-input v-model="link.logo" placeholder="网站LOGO" />
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="link.email" placeholder="站长邮箱" type="email" />
      </el-form-item>
      <el-form-item prop="qq">
        <el-input v-model="link.qq" placeholder="站长QQ" type="number" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="confirm">
          提交申请
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
import { ASSET_PREFIX } from "@/global/env"

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
      message: "网站名称不能为空",
      trigger: "blur"
    }
  ],
  url: [
    {
      required: true,
      message: "网站地址不能为空",
      trigger: "blur"
    }
  ],
  description: [
    {
      required: true,
      message: "网站描述不能为空",
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
      ElMessage.success("申请成功,等待审核...")
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
  width: 500px;
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
        word-break: break-all;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .el-input__wrapper {
      box-shadow: none;
      border-bottom: 1px solid $border-color;
      .el-input__inner::-webkit-inner-spin-button,
      .el-input__inner::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }
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
@media screen and (max-width: 500px) {
  #ApplyDialog {
    width: calc(100% - $space);
  }
}
</style>
