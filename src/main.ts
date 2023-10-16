import { createApp } from "vue"
import "@/assets/style/scss/global.scss"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

import "web-animations-js"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn"
import localizedFormat from "dayjs/plugin/localizedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import Icon from "@/components/Icon.vue"
import router from "@/router"
import App from "@/App.vue"

dayjs.locale("zh-cn")
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

const app = createApp(App)

app.use(router).use(createPinia().use(piniaPluginPersistedstate)).mount("#app")

app.component("Icon", Icon)
