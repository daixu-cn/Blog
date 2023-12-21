module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "perf",
        "docs",
        "refactor",
        "style",
        "chore",
        "ci",
        "build",
        "test",
        "revert",
        "---"
      ]
    ],
    // 要求提交消息主题(subject)使用句首大写形式
    "subject-case": [2, "always", "sentence-case"]
  }
}
