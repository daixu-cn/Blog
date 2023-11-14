<template>
  <div id="Account">
    <ul>
      <li class="start">
        <label class="avatar-label"> 头像: </label>
        <el-upload
          v-loading="uploadLoading"
          :action="`${BASE_API}/upload/file`"
          method="put"
          :headers="{ Authorization: `Bearer ${userStore.token}` }"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :show-file-list="false"
        >
          <el-image :src="userStore.info?.avatar" fit="cover" class="avatar" />
          <div class="avatar-edit">
            <i-ep-edit />
          </div>
        </el-upload>
      </li>
      <li>
        <label> 用户名: </label>
        <EditableInput
          :default-value="userStore.info?.userName"
          url="/user/update"
          attr="userName"
          @save="refresh"
        />
      </li>
      <li>
        <label> 邮箱: </label>
        <EditableInput
          is-custom
          :default-value="userStore.info?.email"
          url="/user/update"
          attr="userName"
          @custom-editing="emailChangeDialog.show = true"
          @save="refresh"
        />
      </li>
      <li>
        <label> QQ: </label>
        <EditableInput
          is-custom
          :default-value="userStore.info?.qq ? '已绑定' : ''"
          url="/user/update"
          attr="userName"
          @custom-editing="OAuth('qq')"
          @save="refresh"
        />
      </li>
      <li>
        <label> GitHub: </label>
        <EditableInput
          is-custom
          :default-value="userStore.info?.github ? '已绑定' : ''"
          url="/user/update"
          attr="userName"
          @custom-editing="OAuth('github')"
          @save="refresh"
        />
      </li>
      <li>
        <label> Google: </label>
        <EditableInput
          is-custom
          :default-value="userStore.info?.google ? '已绑定' : ''"
          url="/user/update"
          attr="userName"
          @custom-editing="OAuth('google')"
          @save="refresh"
        />
      </li>
      <li class="start">
        <label> 邮箱服务: </label>
        <el-switch
          :model-value="userStore.info?.emailService"
          :loading="emailServiceLoading"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          @change="emailServiceChange"
        />
      </li>
    </ul>
    <EmailChangeDialog ref="emailChangeDialog" @confirm="refresh" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { ElMessage } from "element-plus"
import type { UploadProps } from "element-plus"
import { OAuth, BASE_API } from "@/global/env"
import useUserStore from "@/store/user"
import http from "@/server"
import EditableInput from "@/components/EditableInput.vue"
import EmailChangeDialog from "./EmailChangeDialog.vue"

const userStore = useUserStore()
const emailChangeDialog = ref()
const uploadLoading = ref(false)
const emailServiceLoading = ref(false)

const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  if (!rawFile.type.startsWith("image")) {
    ElMessage.error("图片格式异常")
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("图片格式不能超过2MB!")
    return false
  }
  uploadLoading.value = true
  return true
}
const uploadSuccess: UploadProps["onSuccess"] = res => {
  if (res.code === 0) {
    updateUser("avatar", res.data)
  } else {
    ElMessage.error(res.message)
  }
}

async function updateUser(key: string, value) {
  try {
    const res = await http.patch("/user/update", {
      [key]: value
    })
    if (res.code === 0) {
      ElMessage.success("修改成功")
      refresh(res.data)
    }
  } finally {
    if (key === "avatar") {
      uploadLoading.value = false
    } else if (key === "emailService") {
      emailServiceLoading.value = false
    }
  }
}
function refresh(userInfo) {
  userStore.setUser(userInfo)
}
function emailServiceChange(value) {
  emailServiceLoading.value = true
  updateUser("emailService", value ? 1 : 0)
}
</script>

<style lang="scss">
#Account {
  ul {
    width: 550px;
    margin: 40px auto 0 auto;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
      label {
        flex-shrink: 0;
        width: 100px;
        margin-right: 20px;
        text-align: right;
        @include text-ellipsis;
      }
      .avatar-label {
        align-self: self-start;
      }
      .el-upload {
        width: 90px;
        height: 90px;
        position: relative;

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: $border-radius;
        }
        .avatar-edit {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: transparent;
          color: transparent;
          cursor: pointer;
          font-size: 16px;
          transform: scale(0) rotate(90deg);
          opacity: 0;
          transition: all $duration;
          border-radius: $border-radius;
          @include flex-center;
        }
        &:hover {
          .avatar-edit {
            background-color: rgba(29, 33, 41, 0.5);
            color: $color-primary;
            transform: scale(1) rotate(0);
            opacity: 1;
          }
        }
      }
      &.start {
        justify-content: flex-start;
      }
      #EditableInput {
        flex-shrink: 0;
        width: calc(100% - 100px);
      }
    }
  }
  @media screen and (max-width: 500px) {
    ul {
      width: 100%;
    }
  }
}
</style>
