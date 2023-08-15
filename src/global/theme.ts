// 主题文件
export type ThemeType = "clear-spring-green" | "ethereal-orchid-purple"

interface Theme {
  title: string
  theme: ThemeType
  color: string
}
// 主题数组
const themes: Theme[] = [
  {
    // 颜色中文标题
    title: "清泉翠",
    // 主题的文件名
    theme: "clear-spring-green",
    // 主题颜色
    color: "#45d6bb"
  },
  {
    title: "薰衣草紫",
    theme: "ethereal-orchid-purple",
    color: "#9191fe"
  }
]

export default themes
