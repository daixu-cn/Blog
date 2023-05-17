<template>
  <div id="NotFound">
    <canvas v-if="isCanvas" id="canvas"></canvas>
    <div v-else id="text-notFound">对不起! 您访问的页面不存在</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"

const isCanvas = ref(true)
onMounted(() => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement
  if (!canvas || !canvas.getContext) {
    isCanvas.value = false
    return false
  }
  function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  // canvas
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

  let X = (canvas.width = window.innerWidth)
  let Y = (canvas.height = window.innerHeight)
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame ||
    function (cb) {
      setTimeout(cb, 17)
    }
  function drawGround() {
    ctx.beginPath()
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.rect(0, Y, X, Y - Y * -0.1)
    ctx.fill()
  }
  const radius = 150

  function drawMoon() {
    ctx.save()
    ctx.beginPath()
    ctx.font = "80px Palatino"
    ctx.strokeStyle = "gray"
    ctx.textAlign = "center"
    ctx.strokeText("404", X / 2 + 20, Y / 3 + 30)
    const col = "255, 255, 255"
    const g = ctx.createRadialGradient(X / 2, Y / 3, radius, X / 3, Y / 3, 0)
    g.addColorStop(0, `rgba(${col}, ${1 * 1})`)
    g.addColorStop(0.5, `rgba(${col}, ${1 * 0.2})`)
    g.addColorStop(1, `rgba(${col}, ${1 * 0})`)
    ctx.fillStyle = g
    ctx.arc(X / 2, Y / 3, radius, Math.PI * 2, 0)
    ctx.fill()
    ctx.restore()
  }

  let snowNum = 80
  let backSnowNum = 80
  const snows: Snow[] = []
  const backSnows: Snow[] = []
  if (X < 768) {
    snowNum = 25
    backSnowNum = 25
  }
  class Snow {
    private ctx: CanvasRenderingContext2D

    private x = 0

    private y = 0

    private r = 0

    private c = ""

    private v = { x: 0, y: 0 }

    constructor(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      g: number
    ) {
      this.ctx = ctx
      this.init(x, y, r, g)
    }

    private init(x: number, y: number, r: number, g: number): void {
      this.x = x
      this.y = y
      this.r = r
      this.c = "255, 255, 255"
      this.v = {
        x: 0,
        y: g
      }
    }

    private updatePosition(): void {
      this.y += this.v.y
    }

    private wrapPosition(): void {
      const X = this.ctx.canvas.width
      const Y = this.ctx.canvas.height

      if (this.x - this.r > X) {
        this.x = 0
      }
      if (this.x + this.r < 0) {
        this.x = X
      }
      if (this.y - this.r > Y) {
        this.y = 0
      }
      if (this.y + this.r < 0) {
        this.y = Y
      }
    }

    private draw(): void {
      const { ctx } = this
      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = this.gradient()
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, 0)
      ctx.fill()
      ctx.closePath()
      ctx.restore()
    }

    private gradient(): CanvasGradient {
      const col = this.c
      const g = this.ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.r
      )
      g.addColorStop(0, `rgba(${col}, ${1 * 1})`)
      g.addColorStop(0.5, `rgba(${col}, ${1 * 0.2})`)
      g.addColorStop(1, `rgba(${col}, ${1 * 0})`)
      return g
    }

    public resize(): void {
      const X = this.ctx.canvas.width
      const Y = this.ctx.canvas.height
      this.x = rand(0, X)
      this.y = rand(0, Y)
    }

    public render(): void {
      this.updatePosition()
      this.wrapPosition()
      this.draw()
    }
  }

  for (let i = 0; i < backSnowNum; i++) {
    const snow = new Snow(
      ctx,
      rand(0, X),
      rand(0, Y),
      rand(1, 5),
      Math.random()
    )
    backSnows.push(snow)
  }
  for (let i = 0; i < snowNum; i++) {
    const snow = new Snow(
      ctx,
      rand(0, X),
      rand(0, Y),
      rand(10, 15),
      Math.random() + 0.3
    )
    snows.push(snow)
  }
  let treeNum = 30
  const trees: Tree[] = []
  let backTreeNum = 16
  const backTrees: Tree[] = []
  if (X < 768) {
    treeNum = 15
    backTreeNum = 8
  }
  class Tree {
    ctx: CanvasRenderingContext2D

    x = 0

    y = 0

    t = 0

    w = 0

    c = ""

    splitNum = 0

    tSplit = 0

    bSplit = 0

    constructor(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      t: number,
      w: number,
      c: string
    ) {
      this.ctx = ctx
      this.init(x, y, t, w, c)
    }

    init(x: number, y: number, t: number, w: number, c: string) {
      this.x = x
      this.y = y
      this.t = t
      this.w = w
      this.c = c
      this.splitNum = rand(10, 30)
      this.tSplit = this.t / this.splitNum
      this.bSplit = this.w / this.splitNum
    }

    draw() {
      const { ctx } = this
      ctx.lineCap = "round"
      ctx.lineWidth = 3
      ctx.strokeStyle = this.c
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x, this.y - this.t)
      ctx.stroke()
      ctx.lineWidth = 1
      for (let i = 1, j = this.splitNum; i < this.splitNum; i++, j--) {
        const bX1 = this.x + this.bSplit * j
        const bX2 = this.x - this.bSplit * j
        const branchRad = Math.PI / 8 // assuming a 45 degree angle for branches
        const bY =
          this.y - Math.tan(branchRad) * this.bSplit * j - this.tSplit * i
        ctx.moveTo(this.x, this.y - this.tSplit * i)
        ctx.lineTo(bX1, bY)
        ctx.stroke()
        ctx.moveTo(this.x, this.y - this.tSplit * i)
        ctx.lineTo(bX2, bY)
        ctx.stroke()
      }
    }

    resize() {
      this.x = rand(0, X)
      this.y = Y
    }

    render() {
      this.draw()
    }
  }
  for (let i = 0; i < backTreeNum; i++) {
    const tree = new Tree(
      ctx,
      rand(0, X),
      Y,
      rand(200, 400),
      rand(50, 100),
      "rgb(126, 158, 209)"
    )
    backTrees.push(tree)
  }
  for (let i = 0; i < treeNum; i++) {
    const tree = new Tree(
      ctx,
      rand(0, X),
      Y,
      rand(100, 300),
      rand(20, 100),
      "rgb(255, 255, 255)"
    )
    trees.push(tree)
  }
  function render() {
    ctx.clearRect(0, 0, X, Y)
    drawMoon()
    drawGround()
    for (let i = 0; i < backSnows.length; i++) {
      backSnows[i].render()
    }
    for (let i = 0; i < backTrees.length; i++) {
      backTrees[i].render()
    }
    for (let i = 0; i < trees.length; i++) {
      trees[i].render()
    }
    for (let i = 0; i < snows.length; i++) {
      snows[i].render()
    }
    requestAnimationFrame(render)
  }
  render()
  function onResize() {
    X = canvas.width = window.innerWidth
    Y = canvas.height = window.innerHeight
    drawMoon()
    drawGround()
    for (let i = 0; i < backSnows.length; i++) {
      backSnows[i].resize()
    }
    for (let i = 0; i < backTrees.length; i++) {
      backTrees[i].resize()
    }
    for (let i = 0; i < trees.length; i++) {
      trees[i].resize()
    }
    for (let i = 0; i < snows.length; i++) {
      snows[i].resize()
    }
  }
  window.addEventListener("resize", function () {
    onResize()
  })
})
</script>

<style lang="scss">
#NotFound {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background: #74ebd5;
  background: -webkit-linear-gradient(to bottom, #acb6e5, #74ebd5);
  background: linear-gradient(to bottom, #acb6e5, #74ebd5);
  canvas#canvas {
    width: 100vw;
    height: 100vh;
    letter-spacing: 20px;
    background: #74ebd5; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to bottom,
      #acb6e5,
      #74ebd5
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to bottom,
      #acb6e5,
      #74ebd5
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
  div#text-notFound {
    width: 100%;
    height: 100%;
    @include flex-center;
    color: white;
    font-size: 30px;
  }
  @media screen and (max-width: 435px) {
    div#text-notFound {
      font-size: 7vw;
    }
  }
}
</style>
