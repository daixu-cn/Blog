<template>
  <div id="InfiniteScroll">
    <div :id="mutationId">
      <slot />
    </div>

    <div ref="footer" class="footer">
      <Loading :loading="loading && !isOver" />
      <p v-show="isOver && showEnd" class="over">全部加载～</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  watch,
  onUnmounted,
  PropType
} from "vue"
import Loading from "@/components/Loading.vue"
import {
  useIntersectionObserver,
  useMutationObserver,
  UseMutationObserverOptions
} from "@vueuse/core"
import { nanoid } from "nanoid"

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  isOver: {
    type: Boolean,
    default: false
  },
  showEnd: {
    type: Boolean,
    default: true
  },
  id: {
    type: String,
    default: null
  },
  mutationOptions: {
    type: Object as PropType<UseMutationObserverOptions>,
    default: () => ({
      subtree: false
    })
  }
})
const emits = defineEmits(["onLoad"])

const mutationId = computed(() => {
  return `InfiniteScroll-${props.id ?? nanoid()}`
})

const footer = ref()
const observer = reactive({
  intersection: {
    isIntersecting: false,
    stop: () => {}
  },
  mutation: {
    stop: () => {}
  }
})

onMounted(() => {
  const intersectionObserver = useIntersectionObserver(
    footer,
    ([{ isIntersecting }]) => {
      observer.intersection.isIntersecting = isIntersecting
      if (isIntersecting && !props.isOver) {
        emits("onLoad")
      }
    }
  )
  observer.intersection.stop = intersectionObserver.stop

  const el = document.getElementById(props.id ?? mutationId.value)
  const mutationObserver = useMutationObserver(
    el,
    () => {
      if (observer.intersection.isIntersecting) {
        emits("onLoad")
      }
    },
    {
      childList: true,
      ...props.mutationOptions
    }
  )
  observer.mutation.stop = mutationObserver.stop
})

function stop() {
  observer.intersection.stop()
  observer.mutation.stop()
}

watch(
  () => props.isOver,
  value => {
    if (value) {
      stop()
    }
  }
)
onUnmounted(stop)
</script>

<style lang="scss">
#InfiniteScroll {
  .footer {
    margin-bottom: $space;
    .over {
      text-align: center;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
