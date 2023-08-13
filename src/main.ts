import { createApp } from "vue"
import "@/assets/style/scss/global.scss"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import Icon from "@/components/Icon.vue"
import locale from "@/locale"
import router from "@/router"
import App from "@/App.vue"

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

const app = createApp(App)

app
  .use(locale)
  .use(router)
  .use(createPinia().use(piniaPluginPersistedstate))
  .mount("#app")

app.component("Icon", Icon)
