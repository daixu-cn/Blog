<template>
  <svg id="Icon" :class="[props.class, identifier]">
    <use :xlink:href="`#${props.class}`" :fill="props.color" />
  </svg>
</template>

<script lang="ts" setup>
import { onMounted, computed } from "vue"
import { nanoid } from "nanoid"

const identifier = computed(() => {
  return `Icon-${nanoid()}`
})
const props = defineProps({
  class: {
    type: String,
    require: true
  },
  color: {
    type: String,
    default: "currentColor"
  },
  size: {
    type: String,
    default: "1em"
  },
  // 描边动画颜色(如果不传表示不开启动画)
  stroke: {
    type: String
  },
  // 描边宽度
  strokeWidth: {
    type: String,
    default: "10px"
  }
})

onMounted(() => {
  if (props.stroke) {
    const icon = document.querySelector<SVGSymbolElement>(
      `.${identifier.value}`
    )
    const use = document.querySelector<SVGUseElement>(
      `.${identifier.value} use`
    )
    const href = use?.getAttribute("xlink:href")
    if (href) {
      // 找到对应的图标容器
      const container = document.querySelector(href)
      const paths = container?.querySelectorAll<SVGPathElement>("path") ?? []

      for (const path of paths) {
        const length = Math.ceil(path.getTotalLength()).toString()
        path.setAttribute("length", length)
        path.style.strokeDasharray = length
        path.style.strokeDashoffset = length
        path.style.stroke = props.stroke
        path.style.strokeWidth = props.strokeWidth
      }

      icon?.addEventListener("mouseenter", () => {
        for (const path of paths) {
          path.style.strokeDashoffset = "0"
        }
      })
      icon?.addEventListener("mouseleave", () => {
        for (const path of paths) {
          const length = path.getAttribute("length") ?? "0"
          path.style.strokeDasharray = length
          path.style.strokeDashoffset = length
        }
      })
    }
  }
})
</script>

<style lang="scss">
#Icon {
  width: v-bind("props.size");
  height: v-bind("props.size");
  fill: v-bind("props.color");
}

svg symbol[id^="icon-"] path {
  transition: stroke-dashoffset 1s;
}
</style>
