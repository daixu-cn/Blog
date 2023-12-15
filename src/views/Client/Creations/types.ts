export interface Creation {
  // 标题
  title: string
  // 简介文字
  synopsis: string
  // 描述文字 最多三行
  descriptions: [string] | [string, string] | [string, string, string]
  // 预览图
  img: string
  // 链接地址
  link: string
  // 文本对齐方式 默认居左
  align?: "left" | "center" | "right"
}
