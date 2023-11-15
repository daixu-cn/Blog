<template>
  <div id="MdEditor">
    <MdPreview
      v-if="props.isPreview"
      v-bind="MdEditorProps"
      :class="className"
      :model-value="props.text"
      :no-img-zoom-in="true"
      @onGetCatalog="onGetCatalog"
    />
    <MdEditor
      v-else
      v-bind="MdEditorProps"
      ref="Editor"
      v-model="text"
      v-loading="loading"
      :class="className"
      :preview="preview"
      :placeholder="props.placeholder"
      :no-img-zoom-in="true"
      @onChange="onChange"
      @onSave="onSave"
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
import type { ExposeParam } from "md-editor-v3"
import { nanoid } from "nanoid"
import useThemeStore from "@/store/theme"
import resumeUpload from "@/utils/resumeUpload"
import "md-editor-v3/lib/style.css"
import ImageViewer from "@/components/ImageViewer.vue"

const previewImgUrl = ref<string[]>([])
const emits = defineEmits(["onGetCatalog", "onChange", "onSave", "onLoading"])
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
  placeholder: {
    type: String,
    default: ""
  },
  style: {
    type: Object,
    default: () => {}
  },
  imageAlign: {
    type: String,
    default: "center"
  }
})

const className = computed(() => {
  return props.class ?? `MdEditor-${nanoid()}`
})
const Editor = ref<ExposeParam>()
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
  "image",
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
  editorId: `MdEditor-${Math.random().toString(16).slice(2)}`,
  onUploadImg
})
const text = ref(props.text)
const loading = ref(false)

watchEffect(() => {
  MdEditorProps.theme = themeStore.isDarkMode ? "dark" : "light"
  MdEditorProps.codeTheme = themeStore.isDarkMode ? "atom" : "paraiso"
})
async function onUploadImg(files: File[], callback) {
  emits("onLoading", true)
  loading.value = true

  try {
    const res = await Promise.all(
      files.map(file => {
        return new Promise(resolve => {
          resumeUpload(file, {
            url: "/upload/file",
            methods: "put",
            onSuccess(image) {
              resolve(image)
            }
          })
        })
      })
    )

    callback(res.map(image => image))
  } finally {
    loading.value = false
    emits("onLoading", false)
  }
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
async function onSave(value: string, html: Promise<string>) {
  emits("onSave", value, await Promise.resolve(html))
}
function reset() {
  text.value = ""
}

defineExpose({
  text,
  reset,
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
    @include scrollbar;

    .md-editor-preview-wrapper {
      padding: 0;
      .md-editor-preview {
        padding: 0 20px;
        figure:has(> img) {
          width: 100%;
          display: inline-block;
          text-align: v-bind("props.imageAlign");
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
