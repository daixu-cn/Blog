import { AxiosResponse } from "axios"
import { ElMessage } from "element-plus"

export default function (response: AxiosResponse) {
  const code = response.data?.code

  if (code !== 0) {
    if (code === 401 || code === 403) {
      localStorage.removeItem("token")
    }

    if (code === 12009) {
      ElMessage.warning("已获取上次中断文件，继续上传中...")
      return response.data
    }
    if (code === 12011) {
      return response.data
    }

    ElMessage.error(response.data.message)
  }
  return response.data
}
