import { defineStore } from "pinia"
import { useCssVar, useDark, useToggle } from "@vueuse/core"
import tinycolor from "tinycolor2"
import themes, { ThemeType } from "@/global/theme"

interface ThemeColors {
  [key: string]: string
}
const colorTypes = [
  "--el-color-primary",
  "--el-color-success",
  "--el-color-warning",
  "--el-color-danger",
  "--el-color-info"
]
function generateDerivedColors(prefix: string, baseColor: string): ThemeColors {
  const derivedColors: ThemeColors = {}
  const isDark = useDark().value
  const lightMix = isDark ? "#141414" : "#ffffff"
  const darkMix = isDark ? "#ffffff" : "#000000"

  derivedColors[`${prefix}`] = tinycolor(baseColor).toHexString()

  // 生成浅色派生颜色
  for (let level = 1; level <= 9; level++) {
    const propName = `${prefix}-light-${level}`
    derivedColors[propName] = tinycolor
      .mix(lightMix, baseColor, 100 - level * 10)
      .toHexString()
  }

  // 生成深色派生颜色
  derivedColors[`${prefix}-dark-2`] = tinycolor
    .mix(darkMix, baseColor, 80)
    .toHexString()

  return derivedColors
}

export default defineStore("theme", {
  state: () => ({
    current: (localStorage.getItem("theme") ??
      import.meta.env.VITE_APP_DEFAULE_THEME) as ThemeType,
    isDarkMode: useDark()
  }),
  actions: {
    setTheme(theme?: ThemeType) {
      return new Promise<void>(async (resolve, reject) => {
        try {
          const isTheme = themes.find((item) => item.theme === theme)

          const THEME: ThemeType = isTheme
            ? theme ?? this.current
            : this.current

          const module = await import(
            `@/assets/style/scss/theme/${THEME}.module.scss`
          )
          const el = document.documentElement
          el.setAttribute("style", "")

          Object.keys(module.default).forEach((attr) => {
            if (colorTypes.includes(attr)) {
              const colors = generateDerivedColors(attr, module.default[attr])
              for (const key in colors) {
                useCssVar(key, el).value = colors[key]
              }
            } else {
              useCssVar(attr, el).value = module.default[attr]
            }
          })

          this.current = THEME
          localStorage.setItem("theme", THEME)
          resolve()
        } catch (err) {
          localStorage.removeItem("theme")
          reject(err)
        }
      })
    },
    toggleThemeMode(mode?: boolean) {
      this.isDarkMode = mode ?? !this.isDarkMode
      useToggle(this.isDarkMode)
      this.setTheme(this.current)
    }
  }
})
