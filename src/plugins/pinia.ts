import app from "@/global/app"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

app.use(createPinia().use(piniaPluginPersistedstate))
