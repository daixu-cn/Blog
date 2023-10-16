<template>
  <div id="External-FinalChoice-TurntableModel" @click="start">
    <canvas class="turntable" />
    <div class="arrow"></div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, watch, nextTick } from "vue"
import tinycolor from "tinycolor2"
import useThemeStore from "@/store/theme"
import { getRandomIntInclusive } from "@/utils/util"
import { TableData } from "./types"

const themeStore = useThemeStore()
const props = defineProps({
  optionsList: {
    type: Array as PropType<TableData[]>,
    default: () => []
  }
})
let animation: Animation | undefined

function drawCarousel() {
  const html = document.querySelector("html") as HTMLElement
  const style = getComputedStyle(html, null)
  const primaryColor = style.getPropertyValue("--el-color-primary")
  const fontSize = style.getPropertyValue("--el-font-size-base")
  const fontFamily = style.getPropertyValue("--el-font-family")

  const canvas = document.querySelector(
    "#External-FinalChoice-TurntableModel .turntable"
  ) as HTMLCanvasElement
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

  // 画布大小
  const squareSize = 300
  // 角度转弧度
  const deg = Math.PI / 180
  // 半径
  const radius = squareSize / 2
  // 每个扇形的角度
  const angle = (100 / props.optionsList.length / 100) * 360
  // 起始角度
  let startAngle = 45

  canvas.width = squareSize
  canvas.height = squareSize
  ctx.clearRect(0, 0, squareSize, squareSize)

  for (let i = 0, len = props.optionsList.length; i < len; i++) {
    // 开始一个新的路径
    ctx.beginPath()
    // 绘制扇形
    ctx.arc(
      squareSize / 2,
      squareSize / 2,
      radius,
      startAngle * deg,
      (startAngle + angle) * deg
    )
    // 给扇形设置颜色
    ctx.fillStyle = tinycolor(primaryColor)
      .lighten(i * 5)
      .toString()

    // 连接到圆心，形成扇形
    ctx.lineTo(squareSize / 2, squareSize / 2)
    // 填充扇形区域
    ctx.fill()
    // 保存画布状态
    ctx.save()

    // 添加文本
    ctx.fillStyle = "#fff"
    ctx.font = `${fontSize} ${fontFamily}`
    ctx.translate(squareSize / 2, squareSize / 2)
    ctx.rotate((startAngle + angle / 2 + 90) * deg)
    ctx.fillText(
      props.optionsList[i].option,
      -ctx.measureText(props.optionsList[i].option).width / 2,
      -radius / 2
    )

    // 恢复画布状态
    ctx.restore()

    startAngle += angle
  }
}

function start() {
  if (animation?.playState !== "running") {
    const arrow = document.querySelector(
      "#External-FinalChoice-TurntableModel .arrow"
    )
    const turntable = document.querySelector(
      "#External-FinalChoice-TurntableModel .turntable"
    )

    // 旋转圈数
    const turns = getRandomIntInclusive(360 * 15, 360 * 20)
    // 结束时旋转圈数
    const overTurns = turns + getRandomIntInclusive(0, 360 * 2)
    // 动画配置
    const options: AnimationEffectTiming = {
      easing: "cubic-bezier(.47,.17,0,.99)",
      duration: 1000 * 5,
      fill: "forwards"
    }

    animation = arrow?.animate(
      [
        { transform: "translate(-50%, -95%) rotate(0deg)" },
        {
          transform: `translate(-50%, -95%) rotate(${overTurns}deg)`
        }
      ],
      options
    )
    turntable?.animate(
      [
        { transform: "rotate(0deg)" },
        {
          transform: `rotate(-${overTurns}deg)`
        }
      ],
      options
    )
  }
}

watch(
  () => props.optionsList,
  () => {
    nextTick(drawCarousel)
  },
  { immediate: true }
)
watch(
  () => themeStore.current,
  () => {
    nextTick(drawCarousel)
  }
)
</script>

<style lang="scss">
#External-FinalChoice-TurntableModel {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  @include flex-center;

  .arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -95%);
    transform-origin: bottom center;
    &::before {
      content: "";
      display: block;
      width: 6px;
      height: 30px;
      background-color: $color-danger;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
    }
    &::after {
      content: "";
      position: absolute;
      transform: translate(calc(-50% + 3px), calc(-100% - 30px));
      display: block;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-color: transparent transparent $color-danger transparent;
    }
  }
}
</style>
