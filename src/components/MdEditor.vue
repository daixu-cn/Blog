<template>
  <div id="MdEditor">
    <MdPreview
      v-if="props.isPreview"
      :class="className"
      :model-value="props.text"
      :no-img-zoom-in="true"
      v-bind="MdEditorProps"
      @onGetCatalog="onGetCatalog"
    />
    <MdEditor
      v-else
      v-bind="MdEditorProps"
      ref="Editor"
      v-model="text"
      :class="className"
      :preview="preview"
      :placeholder="props.placeholder"
      :no-img-zoom-in="true"
      @onChange="onChange"
    />
    <ImageViewer
      :show="Boolean(previewImgUrl.length)"
      :url-list="previewImgUrl"
      @close="previewImgUrl = []"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, reactive, onMounted, computed } from "vue"
import { MdPreview, MdEditor, ToolbarNames, HeadList } from "md-editor-v3"
import { nanoid } from "nanoid"
import useThemeStore from "@/store/theme"
import resumeUpload from "@/utils/resumeUpload"
import "md-editor-v3/lib/style.css"
import ImageViewer from "@/components/ImageViewer.vue"

const previewImgUrl = ref<string[]>([])
const emits = defineEmits(["onGetCatalog", "onChange"])
const props = defineProps({
  class: {
    type: String
  },
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
  },
  style: {
    type: Object,
    default: () => {}
  }
})

const className = computed(() => {
  return props.class ?? `MdEditor-${nanoid()}`
})
const Editor = ref()
const preview = ref(props.preview)
const themeStore = useThemeStore()
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
  style: props.style,
  previewTheme: "vuepress",
  toolbars,
  showCodeRowNumber: true,
  tableShape: [9, 9],
  footers: [],
  language: "zh-cn",
  onUploadImg
})
const text = ref(props.text)
watchEffect(() => {
  MdEditorProps.theme = themeStore.isDarkMode ? "dark" : "light"
  MdEditorProps.codeTheme = themeStore.isDarkMode ? "atom" : "paraiso"
})
async function onUploadImg(files: File[], callback) {
  const res = await Promise.all(
    files.map(file => {
      return new Promise(resolve => {
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
  callback(res.map(image => image))
}

onMounted(() => {
  Editor.value?.on("preview", (status: boolean) => (preview.value = status))
  if (props.isPreview) {
    const el = document.querySelector(`.${className.value}`)
    el?.addEventListener("click", e => {
      if (e.target instanceof HTMLImageElement) {
        const src = e.target?.getAttribute("src")
        if (src) {
          previewImgUrl.value = [src]
        }
      }
    })
  }
})

function onGetCatalog(list: HeadList[]) {
  emits("onGetCatalog", list)
}
function onChange(value: string) {
  emits("onChange", value)
}

defineExpose({
  text,
  Editor
})
</script>

<style lang="scss">
#MdEditor {
  width: 100%;
  .md-editor {
    width: 100%;
    border: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    font-family: $font-family;
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
        figure:has(> img) {
          width: 100%;
          display: inline-block;
        }
        img {
          max-height: 600px;
          object-fit: contain;
          cursor: pointer;
        }
        h1 {
          font-size: 2em;
        }
        h2 {
          font-size: 1.8em;
        }
        h3 {
          font-size: 1.6em;
        }
        h4 {
          font-size: 1.4em;
        }
        h5 {
          font-size: 1.2em;
        }
        h5 {
          font-size: 1.1em;
        }
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

  @media screen and (max-width: 750px) {
    .md-editor {
      .md-editor-preview-wrapper {
        .md-editor-preview {
          .medium-zoom-image {
            max-height: initial;
          }
        }
      }
    }
  }
}
.medium-zoom-overlay {
  background: rgba(0, 0, 0, 0.05) !important;
}
</style>
