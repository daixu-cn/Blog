module.exports = {
  types: [
    { value: "feat", name: "feat: 新功能、新特性" },
    { value: "fix", name: "fix: 修改 bug" },
    { value: "docs", name: "docs: 文档变更" },
    {
      value: "style",
      name: "style: 代码格式修改, 注意不是 css 修改（例如分号修改）"
    },
    { value: "refactor", name: "refactor: 代码重构" },
    { value: "perf", name: "perf: 性能优化" },
    { value: "test", name: "test: 测试用例新增、修改" },
    { value: "revert", name: "revert: 回退" },
    { value: "build", name: "build: 影响项目构建或依赖项修改" },
    { value: "chore", name: "chore: 其他修改（不在上述类型中的修改）" }
  ],
  // allowCustomScopes为true时生效
  scopes: [
    { name: "global" },
    { name: "pages" },
    { name: "components" },
    { name: "styles" },
    { name: "utils" },
    { name: "assets" }
  ],
  // 消息步骤，正常只需要选择
  messages: {
    type: "请选择提交类型:",
    scope: "scope:",
    customScope: "自定义的 scope:",
    subject: "简要描述(必填):",
    body: '详细描述,使用"|"换行(可选):',
    footer: "请输入要关闭的issue(可选):",
    confirmCommit: "确认提交？(y/n)"
  },
  allowCustomScopes: true,
  // 跳过问题：issue相关
  skipQuestions: ["footer"]
}
