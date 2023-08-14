interface Window {
  mozRequestAnimationFrame: (callback: FrameRequestCallback) => number
  webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number
  msRequestAnimationFrame: (callback: FrameRequestCallback) => number
}
