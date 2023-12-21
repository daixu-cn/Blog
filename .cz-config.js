module.exports = {
  // 提交类型
  types: [
    { value: "feat", name: "feat: 新功能" },
    { value: "fix", name: "fix: 修复 Bug" },
    { value: "perf", name: "perf: 提高性能的代码" },
    { value: "docs", name: "docs: 文档变更" },
    { value: "refactor", name: "refactor: 重构代码，不涉及功能新增或修复" },
    {
      value: "style",
      name: "style: 代码风格、格式化等改动 (空格、格式、缺少分号等)"
    },
    {
      value: "chore",
      name: "chore: 对构建过程、辅助工具或其他与项目开发相关的变动。通常仅针对项目的开发环境、工具链、配置文件等方面的修改 (示例: 添加 dayjs 依赖、修改 .cz-config.js 配置项)"
    },
    {
      value: "ci",
      name: "ci: 通常用于表示对持续集成(Continuous Integration)配置的修改。主要涉及项目的自动化构建、测试和部署流程 (示例: 更新部署脚本以支持多环境部署)"
    },
    {
      value: "build",
      name: "build: 影响构建系统或外部依赖项 (示例: 优化打包输出，减小文件体积)"
    },
    {
      value: "test",
      name: "test: 增加或修改测试代码 (示例: 添加用户登录测试)"
    },
    { value: "revert", name: "revert: 代码回退" },
    { value: "-" }
  ],
  // 范围/作用域
  scopes: [{ name: "-" }],
  // 覆盖消息及步骤提示
  messages: {
    type: "请选择提交类型:",
    scope: "范围/作用域 (可选):",
    customScope: "自定义范围/作用域:",
    subject: "简要描述:",
    body: '详细描述 (可选，使用 "|" 换行):',
    breaking: "列出所有重大变更 (可选):\n",
    footer: "此次变更关闭的 issue (可选):",
    confirmCommit: "您确定要继续上述提交吗？(y/n)"
  },
  // 主题(subject)首字母自动转大写
  upperCaseSubject: true,
  // 允许自定义范围/作用域
  allowCustomScopes: true,
  // 允许不选择或不填写范围。
  allowEmptyScopes: true,
  // 换行字符，用于 body 和 footer 中的多行输入
  breaklineChar: "|",
  // 页脚自定义前缀，默认是 "ISSUES CLOSED:"
  footerPrefix: "ISSUES CLOSED:",
  // 在其余问题之前先询问是否存在破坏性变更，当设置为 true 时，它​​要求将重大更改作为第一个问题
  // 破坏性变更指的是在软件更新中引入的对现有功能、接口或行为产生显著影响的修改。这些变更可能导致之前的版本与新版本不兼容
  askForBreakingChangeFirst: false,
  // 允许的破坏性变更类型
  allowBreakingChanges: ["feat", "fix", "refactor", "chore"]
  // 是否跳过某些问题
  // skipQuestions: ["body", "footer"]
}
