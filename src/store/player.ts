import { defineStore } from "pinia"
import Plyr from "plyr"

interface State {
  player: Plyr | null
}

export default defineStore("player", {
  persist: false,
  state: (): State => ({
    player: null
  }),
  actions: {
    setPlayer(player: Plyr) {
      this.player?.pause()
      this.player = player
    },
    removePlayer() {
      this.player?.destroy()
      this.player = null
    }
  }
})
