/**
 * @Description: WebSocket 监听更新推送，通知页面刷新
 * @Author: daixu
 * @Date: 2023-12-20 13:33:04
 */

import { ElMessage } from "element-plus"
import socket from "@/server/ws"
import Tags from "@/server/ws/tags"

// // 延迟刷新时间,单位：秒
const DURATION = 3000

socket.on("connect", () => {
  socket.on(Tags.CHECKER, ({ code, tag }) => {
    if (code === 0) {
      if (tag === Tags.CHECKER) {
        ElMessage({
          message: `检测到新版本，${DURATION / 1000}秒后将自动更新！`,
          type: "warning",
          duration: DURATION,
          onClose: () => {
            window.location.reload()
          }
        })
      }
    }
  })
})
