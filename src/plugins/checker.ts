/**
 * @Description: 检测网站更新，通知刷新页面
 * @Author: daixu
 * @Date: 2023-12-20 13:33:04
 */

import { ElMessage } from "element-plus"

// 延迟刷新时间,单位：秒
const DURATION = 3000

export default async function checker() {
  if (import.meta.env.MODE === "development") {
    clearInterval(timer)
    return
  }

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

checker()
const timer = setInterval(checker, 1000 * 10)
