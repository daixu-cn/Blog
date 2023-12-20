/**
 * @Description: 检测到文件变化后，刷新浏览器
 * @Author: daixu
 * @Date: 2023-12-20 13:33:04
 */

import { ElMessage } from "element-plus"

// 延迟刷新时间,单位：秒
const DURATION = 3000

// Hash值校验
export default async function refresh() {
  const selectors = `head script[type="module"][src^="/static/js/"]`
  const response = await fetch(`/?timestamp=${Date.now()}`)
  const content = await response.text()
  const parser = new DOMParser()
  const latest = parser
    .parseFromString(content, "text/html")
    .querySelector<HTMLScriptElement>(selectors)?.src

  const current = document.querySelector<HTMLScriptElement>(selectors)?.src

  if (latest && current !== latest) {
    clearInterval(timer)
    window.location.reload()
    ElMessage({
      message: `检测到新版本，${DURATION / 1000}秒后自动更新！`,
      type: "warning",
      duration: DURATION,
      onClose: () => {
        window.location.reload()
      }
    })
  }
}

const timer = setInterval(refresh, 2000)
