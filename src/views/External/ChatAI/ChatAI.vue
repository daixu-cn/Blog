<template>
  <div id="ChatAI">
    <h1>Google Gemini AI</h1>
    <el-scrollbar ref="scrollbar" :height="height">
      <ul v-auto-animate class="history">
        <li v-for="(item, index) of history" :key="index">
          <span class="role" :class="item.role !== 'user' && 'role-model'"
            >{{ item.role === "user" ? "我" : "Gemini AI" }}:
          </span>

          <MdEditor :is-preview="true" :text="item.parts" />
        </li>
      </ul>
      <el-empty v-show="history.length === 0" description="来和AI聊聊吧!" />
    </el-scrollbar>
    <div v-loading="loading" class="chat">
      <div v-auto-animate class="images">
        <div v-for="(item, index) of images" :key="item" class="image">
          <el-image
            :preview-src-list="images"
            :initial-index="index"
            :src="item"
            fit="cover"
          />
          <span class="remove" @click="remove(index)"><i-ep-closeBold /></span>
        </div>
        <i class="placeholder"></i>
      </div>

      <el-input
        ref="input"
        v-model="message"
        placeholder="请输入聊天内容"
        autofocus
        :disabled="loading"
        @keyup.enter="send"
      >
        <template #prepend>
          <el-upload
            :on-change="onUploadChange"
            :auto-upload="false"
            :show-file-list="false"
            :limit="16"
            multiple
          >
            <el-button :icon="PictureFilled" />
          </el-upload>
        </template>
        <template #append>
          <el-button :icon="Upload" @click="send" />
        </template>
      </el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, watch } from "vue"
import { Upload, PictureFilled } from "@element-plus/icons-vue"
import http from "@/server"
import MdEditor from "@/components/MdEditor.vue"
import type { UploadRawFile, UploadProps, ElScrollbar } from "element-plus"
import { ElMessage, ElUpload } from "element-plus"
import { History } from "./types"

const scrollbar = ref<InstanceType<typeof ElScrollbar>>()
const input = ref()
const loading = ref(false)
const message = ref("")
const height = ref(window.innerHeight - 230)
const files = reactive<UploadRawFile[]>([])
const images = reactive<string[]>([])
const history = reactive<History[]>([])

function scrollToBottom() {
  nextTick(() => {
    scrollbar.value?.scrollTo({
      top: document.querySelector(".history")?.scrollHeight ?? Number.MAX_VALUE,
      behavior: "smooth"
    })
  })
}
watch(images, () => {
  nextTick(() => {
    if (images.length) {
      setTimeout(() => {
        const imagesHeight =
          document.querySelector(".images")?.clientHeight ?? 0
        height.value = window.innerHeight - imagesHeight - 240

        scrollToBottom()
      }, 300)
    } else {
      height.value = window.innerHeight - 230
    }
  })
})

function remove(index: number) {
  files.splice(index, 1)
  images.splice(index, 1)
}
const onUploadChange: UploadProps["onChange"] = rawFile => {
  if (rawFile.raw) {
    const { type } = rawFile.raw
    const mimeRule = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/heic",
      "image/heif"
    ]
    if (mimeRule.includes(type)) {
      const imageUrl = window.URL.createObjectURL(
        new Blob([rawFile.raw], { type: rawFile.raw.type })
      )
      images.push(imageUrl)
      files.push(rawFile.raw)
    } else {
      ElMessage.error("仅支持: png、jpeg、webp、heic、heif 格式的图片")
    }
  }
}
async function send() {
  try {
    if (message.value === "") return

    const formData = new FormData()
    formData.append(`message`, message.value)
    if (files.length) {
      for (const file of files) {
        formData.append(`file`, file)
      }
    }

    const url = files.length ? "/ai/chat/image" : "/ai/chat"
    const params = files.length
      ? formData
      : {
          message: message.value,
          history
        }

    loading.value = true
    const res = await http.post(url, params)

    if (res.code === 0) {
      let imgs = ""
      for (const item of images) {
        imgs += `<img src="${item}" width="100" height="100"></img>`
      }
      history.push(
        {
          role: "user",
          parts: `${message.value}<div style="margin-top:20px;">${imgs}</div>`
        },
        {
          role: "model",
          parts: res.data
        }
      )
      scrollToBottom()
    }
  } finally {
    loading.value = false
    files.splice(0)
    images.splice(0)
    message.value = ""
    input.value?.focus()
  }
}
</script>

<style lang="scss">
#ChatAI {
  width: 100%;
  h1 {
    color: $color-primary;
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
  }
  .history {
    li {
      margin-bottom: $space;
      .role {
        color: $color-primary;
        margin-right: 10px;
        font-weight: 700;
        font-size: 18px;
        margin-bottom: $space;
      }
      .role-model {
        color: $color-danger;
      }
      .md-editor {
        box-shadow: none;
      }
    }
  }
  .chat {
    position: fixed;
    bottom: 50px;
    width: 80%;
    .images {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .image {
        width: 100px;
        height: 100px;
        position: relative;
        margin-right: 10px;
        margin-bottom: 10px;
        .el-image {
          width: 100%;
          height: 100%;
          font-size: 0;
        }
        .remove {
          @include flex-center;
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 20px;
          background-color: rgba(0, 0, 0, 0.2);
          color: #fff;
          cursor: pointer;
          transition: all $duration;
          font-size: 12px;
          &:hover {
            color: $color-primary;
          }
        }
      }
      .placeholder {
        display: inline-block;
        width: 100px;
        height: 0;
        margin-left: auto;
        margin-right: 0;
      }
    }
    .el-input__inner {
      height: 50px;
    }
  }
  @media screen and (max-width: 1250px) {
    .chat {
      width: calc(100% - 40px);
      bottom: 20px;
    }
  }
}
</style>
