import { io } from "socket.io-client"

const socket = io(import.meta.env.VITE_APP_WEB_SOCKET_API, {
  transports: ["websocket", "polling"]
})

export default socket
