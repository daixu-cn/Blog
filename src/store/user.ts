import { defineStore } from "pinia"

interface Info {
  userId: number
  userName: string
  avatar: string
  email: string
  emailService: boolean
  role: number
  createdAt: string
  updatedAt: number
}
interface State {
  info: Info | null
  token: string | null
}

export default defineStore("user", {
  state: (): State => ({
    info: null,
    token: localStorage.getItem("token") ?? null
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUser(info: Info) {
      this.info = info
    },
    reset() {
      this.info = null
      this.token = null
      localStorage.removeItem("token")
    }
  }
})
