export type ThemeType = "clear-spring-green" | "ethereal-orchid-purple"

interface Theme {
  title: string
  theme: ThemeType
  color: string
}

const themes: Theme[] = [
  {
    title: "清泉翠",
    theme: "clear-spring-green",
    color: "#45d6bb"
  },
  {
    title: "薰衣草紫",
    theme: "ethereal-orchid-purple",
    color: "#9191fe"
  }
]

export default themes
