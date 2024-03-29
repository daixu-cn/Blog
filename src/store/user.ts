import { defineStore } from "pinia"
import http from "@/server"

interface Info {
  userId: number
  userName: string
  avatar: string
  email: string
  emailService: boolean
  role: 0 | 1
  qq: boolean
  github: boolean
  google: boolean
  createdAt: string
  updatedAt: number
}
interface State {
  info: Info | null
  token: string | null
}

export default defineStore("user", {
  persist: true,
  state: (): State => ({
    info: null,
    token: localStorage.getItem("token") ?? null
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem("token", token)
    },
    setUser(info: Info) {
      this.info = info
    },
    reset() {
      this.info = null
      this.token = null
      localStorage.removeItem("token")
    },
    async getUserInfo() {
      if (localStorage.getItem("token")) {
        const res = await http.get("/user/info")
        if (res.code === 0) {
          this.info = res.data
        } else {
          this.reset()
        }
      }
    }
  }
})
