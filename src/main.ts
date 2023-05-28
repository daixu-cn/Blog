import { createApp } from "vue"
import "@/assets/style/scss/global.scss"
import App from "@/App.vue"
import router from "@/router"
import locale from "@/locale"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import Icon from "@/components/Icon.vue"

import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

const app = createApp(App)

app
  .use(locale)
  .use(router)
  .use(createPinia().use(piniaPluginPersistedstate))
  .mount("#app")

app.component("Icon", Icon)
