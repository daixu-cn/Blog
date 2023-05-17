export type LocaleType = "zh-cn" | "en" | "ja"

interface Locale {
  locale: LocaleType
}

const locales: Locale[] = [
  {
    locale: "zh-cn"
  },
  {
    locale: "en"
  },
  {
    locale: "ja"
  }
]
export default locales
