import { defineStore } from "pinia"
import { useCssVar, useDark, useToggle } from "@vueuse/core"
import tinycolor from "tinycolor2"
import zhCn from "element-plus/dist/locale/zh-cn.mjs"
import themes, { ThemeType } from "@/global/theme"
import { DEFAULE_THEME } from "@/global/env"

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

/**
 * @description 根据主色调生成派生颜色
 * @param {string} prefix 生成生颜色的前缀
 * @param {string} baseColor 主色调
 * @return {ThemeColors}
 */
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

/**
 * @description 设置 favicon 图标颜色
 * @param {string} color 颜色
 * @return
 */
function setFavicon(color: string) {
  document.querySelector("link[rel*='icon']")?.remove()

  const link = document.createElement("link")
  link.type = "image/x-icon"
  link.rel = "shortcut icon"
  link.href = `data:image/svg+xml,<svg fill="${tinycolor(
    color
  ).toRgbString()}" t="1685958754209" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2728" width="32" height="32"><path d="M646.37864 894.546824a395.665573 395.665573 0 0 0 41.086916-8.076447c-13.542288-3.464986-27.256183-6.207034-41.086916-8.218844-13.691987-2.055624-27.391277-3.559917-41.083264-4.929115-13.695639-1.369199-31.089939-2.190718-46.698805-2.877143a991.482443 991.482443 0 0 0 28.0704-25.748239 649.029409 649.029409 0 0 0 52.72693-54.778903 668.870012 668.870012 0 0 0-63.545426 41.086916c-12.461534 9.175457-24.787974 18.486009-36.840574 28.209145 0-13.691987-1.504293-27.387626-3.012237-41.083264-1.230453-11.501269-2.738397-22.871096-4.79037-34.237271a302.658642 302.658642 0 0 0-8.080098-34.237271 275.146875 275.146875 0 0 0-7.945004 34.237271c-2.055624 11.366175-3.559917 22.73235-4.794021 34.237271-1.504293 13.691987-2.464558 27.391277-3.012237 41.083264a1246.102291 1246.102291 0 0 0-36.840574-28.209145 705.568189 705.568189 0 0 0-63.545426-41.086916 692.277833 692.277833 0 0 0 52.591836 54.778903c9.127992 9.131643 18.577288 17.75942 28.347891 25.886984-15.612517 0-31.363779 1.504293-46.972645 2.873492-15.612517 1.369199-27.391277 2.738397-41.086915 4.794021a396.330091 396.330091 0 0 0-41.083265 8.215193c13.691987 3.563568 27.387626 5.88938 41.083265 8.080098 13.691987 2.190718 27.391277 3.563568 41.086915 4.794021 13.691987 1.234104 31.360128 2.329463 46.972645 2.877143a1269.400576 1269.400576 0 0 0-28.347891 25.886984 692.255926 692.255926 0 0 0-52.591836 54.775252 705.568189 705.568189 0 0 0 63.545426-41.083265c12.465185-9.175457 24.65288-18.48966 36.840574-27.391277 0.547679 13.786918 1.507944 27.482557 2.877143 41.086916a391.006646 391.006646 0 0 0 12.874119 68.474541 378.665602 378.665602 0 0 0 12.870468-68.474541c1.507944-13.695639 2.464558-27.391277 3.015889-41.086916 12.048949 9.588042 24.375389 19.037339 36.840574 27.391277a668.891919 668.891919 0 0 0 63.541774 41.083265 670.261118 670.261118 0 0 0-52.723279-54.778903 991.489745 991.489745 0 0 0-28.077702-25.748239c15.612517 0 31.089939-1.504293 46.698805-2.873492 15.616168-1.369199 27.391277-2.877143 41.086915-4.929115" p-id="2729"></path><path d="M914.252332 360.577574c47.246484-95.865819 48.754429-228.29472-56.969621-288.827909-97.370112-55.739168-234.322846-54.778903-379.899706-24.240295-95.044299 17.438115-239.573266 67.883048-433.586902 151.331147 111.387055-55.965542 202.093733-97.508857 272.123685-124.626294A976.319023 976.319023 0 0 1 694.172804 1.080754c188.989588 5.480446 349.357446 115.724677 255.821092 346.352512-56.330661 139.413641-179.357732 292.479105-369.081211 459.192743 165.344439-166.804918 276.457655-315.488947 333.339647-446.048435z" p-id="2730"></path></svg>`
  document.getElementsByTagName("head")[0].appendChild(link)
}

export default defineStore("theme", {
  state: () => ({
    // 当前主题
    current: (localStorage.getItem("theme") ?? DEFAULE_THEME) as ThemeType,
    // 是否黑暗模式
    isDarkMode: useDark(),
    // element-plus 组建库的全局配置（属性参考官网 <el-config-provider />）
    ElConfigProviderConfig: {
      locale: zhCn,
      size: "default",
      zIndex: 0,
      button: {
        autoInsertSpace: true
      }
    }
  }),
  actions: {
    /**
     * @description 设置主题
     * @param {ThemeType} theme 主题的文件名
     */
    setTheme(theme?: ThemeType) {
      return new Promise<void>(async (resolve, reject) => {
        try {
          const isTheme = themes.find(item => item.theme === theme)

          const THEME: ThemeType = isTheme
            ? theme ?? this.current
            : this.current

          const module = await import(
            `@/assets/style/scss/theme/${THEME}.module.scss`
          )

          const el = document.documentElement
          el.setAttribute("style", "")

          Object.keys(module.default).forEach(attr => {
            if (attr === "--el-color-primary") {
              setFavicon(module.default[attr])
            }

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

    /**
     * @description 切换主题模式
     * @param {boolean} mode 主题模式/如果不传默认取相反
     */
    toggleThemeMode(mode?: boolean) {
      this.isDarkMode = mode ?? !this.isDarkMode
      useToggle(this.isDarkMode)
      this.setTheme(this.current)
    }
  }
})
