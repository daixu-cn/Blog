<template>
  <div id="MdEditor">
    <MdPreview
      v-if="props.isPreview"
      :model-value="props.text"
      v-bind="MdEditorProps"
    />
    <MdEditor
      v-else
      ref="editorRef"
      v-model="text"
      v-bind="MdEditorProps"
      :preview="preview"
      :placeholder="props.placeholder"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, reactive, onMounted } from "vue"
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
  },
  preview: {
    type: Boolean,
    default: true
  },
  isUpload: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: ""
  }
})

const editorRef = ref()
const preview = ref(props.preview)
const themeStore = useThemeStore()
const localeStore = useLocaleStore()
const toolbars = reactive<ToolbarNames[]>([
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
  props.isUpload ? "image" : -1,
  "table",
  "mermaid",
  "katex",
  "=",
  "preview",
  "pageFullscreen"
])
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
onMounted(() => {
  editorRef.value?.on("preview", (status: boolean) => (preview.value = status))
})

defineExpose({
  text
})
</script>

<style lang="scss">
#MdEditor {
  .md-editor {
    border: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    & ::-webkit-scrollbar-corner,
    & ::-webkit-scrollbar-track {
      background-color: v-bind(
        "preview?(themeStore.isDarkMode?'#2d2d2d':'#e2e2e2'):'transparent'"
      );
    }

    .md-editor-preview-wrapper {
      padding: 0;
      .md-editor-preview {
        padding: 0 20px;
      }
    }
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
