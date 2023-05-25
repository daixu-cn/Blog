import { defineStore } from "pinia"
import dayjs from "dayjs"
import locales, { LocaleType } from "@/global/locale"
import i18n from "@/locale"
import { DEFAULE_LOCALE } from "@/global/env"

const dayjs_modules = import.meta.glob("/node_modules/dayjs/esm/locale/*.js")
const element_modules = import.meta.glob(
  "/node_modules/element-plus/dist/locale/*.mjs"
)

export default defineStore("locale", {
  state: () => ({
    current: (localStorage.getItem("locale") ??
      navigator.language.toLocaleLowerCase() ??
      DEFAULE_LOCALE) as LocaleType,
    element: undefined
  }),
  actions: {
    setLocale(locale?: LocaleType) {
      return new Promise<void>(async (resolve, reject) => {
        try {
          const isLocale = locales.find((item) => item.locale === locale)

          const LOCALE: LocaleType = isLocale
            ? locale ?? this.current
            : this.current

          const dayjs_locale: any = await dayjs_modules[
            `/node_modules/dayjs/esm/locale/${LOCALE}.js`
          ]()
          const element_locale: any = await element_modules[
            `/node_modules/element-plus/dist/locale/${LOCALE}.mjs`
          ]()

          dayjs.locale(dayjs_locale.default)
          this.element = element_locale.default

          this.current = LOCALE
          i18n.global.locale = LOCALE
          localStorage.setItem("locale", LOCALE)
          resolve()
        } catch (err) {
          localStorage.removeItem("locale")
          reject(err)
        }
      })
    }
  }
})
