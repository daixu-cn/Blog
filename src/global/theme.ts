export type ThemeType = "clear-spring-green" | "ethereal-orchid-purple"

interface Theme {
  theme: ThemeType
  color: string
}

const themes: Theme[] = [
  {
    theme: "clear-spring-green",
    color: "#45d6bb"
  },
  {
    theme: "ethereal-orchid-purple",
    color: "#9191fe"
  }
]

export default themes
