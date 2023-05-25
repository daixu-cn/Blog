import HTTP from "@/server/http"
import { BASE_API } from "@/global/env"

export default new HTTP({
  baseURL: BASE_API,
  timeout: 1000 * 30
})
