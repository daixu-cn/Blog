import { createApp } from "vue"
import "@/assets/style/scss/global.scss"
import App from "@/App.vue"
import router from "@/router"
import locale from "@/locale"
import { createPinia } from "pinia"
import Icon from "@/components/Icon.vue"

import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"

dayjs.extend(localizedFormat)

const app = createApp(App)

app.use(locale).use(router).use(createPinia()).mount("#app")

app.component("Icon", Icon)
