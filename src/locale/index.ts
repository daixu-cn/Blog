import { createI18n } from "vue-i18n"
import { DEFAULE_LOCALE } from "@/global/env"

interface Locales {
  [key: string]: {
    [key: string]: string
  }
}

const messages: Locales = {}
const modules = import.meta.glob<any>("@/locale/*", { eager: true })
for (const path in modules) {
  const fileName = path.match(/\/([a-z]{2}-[a-z]{2}|[a-z]{2})\.ts$/)?.[1]
  if (fileName) {
    messages[fileName] = modules[path].default
  }
}

export default createI18n({
  allowComposition: true,
  locale: DEFAULE_LOCALE,
  messages
})
