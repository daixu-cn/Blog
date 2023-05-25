<template>
  <div id="MdEditor">
    <MdPreview
      v-if="props.isPreview"
      :model-value="props.text"
      v-bind="MdEditorProps"
    />
    <MdEditor v-else v-model="text" v-bind="MdEditorProps" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, reactive } from "vue"
import useThemeStore from "@/store/theme"
import useLocaleStore from "@/store/locale"
import resumeUpload from "@/utils/resumeUpload"
import { MdPreview, MdEditor, ToolbarNames } from "md-editor-v3"
import "md-editor-v3/lib/style.css"

const props = defineProps({
  // 预览模式
  isPreview: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ""
  }
})

const themeStore = useThemeStore()
const localeStore = useLocaleStore()
const toolbars: ToolbarNames[] = [
  "bold",
  "underline",
  "italic",
  "strikeThrough",
  "-",
  "title",
  "quote",
  "unorderedList",
  "orderedList",
  "task",
  "-",
  "codeRow",
  "code",
  "link",
  "image",
  "table",
  "mermaid",
  "katex",
  "=",
  "preview",
  "pageFullscreen"
]
const MdEditorProps = reactive<any>({
  previewTheme: "vuepress",
  toolbars,
  showCodeRowNumber: true,
  tableShape: [9, 9],
  footers: [],
  onUploadImg
})
const text = ref(props.text)

watchEffect(() => {
  MdEditorProps.theme = themeStore.isDarkMode ? "dark" : "light"
  MdEditorProps.codeTheme = themeStore.isDarkMode ? "atom" : "paraiso"
  MdEditorProps.language = localeStore.current === "zh-cn" ? "zh-CN" : "en-US"
})
async function onUploadImg(files: File[], callback) {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((resolve) => {
        resumeUpload(file, {
          url: "/upload/file",
          methods: "put",
          params: {
            module: "0"
          },
          onSuccess(image) {
            resolve(image)
          }
        })
      })
    })
  )
  callback(res.map((image) => image))
}

defineExpose({
  text
})
</script>

<style lang="scss">
#MdEditor {
  .md-editor {
    border: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .md-editor-toolbar-wrapper {
      .md-editor-toolbar-item {
        padding: 0 6px;
        margin-left: 4px;
      }
    }
    .md-editor-dropdown {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .md-editor-menu {
        border: 0;
        .md-editor-menu-item {
          padding: 0 24px;
          line-height: 34px;
        }
      }
    }
  }
}
</style>
