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
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "revert",
        "build",
        "chore"
      ]
    ],
    // subject 大小写不做校验
    "subject-case": [0]
  }
}
