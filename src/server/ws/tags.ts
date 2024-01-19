/**
 * @Description: WebSocket 协议标识符
 * @Date: 2024-01-18 13:21:34
 */

enum TAGS {
  // 标识符
  IDENTIFIER = "0000",
  // 心跳包
  PING = "0001",
  // 心跳包回应
  PONG = "0002",
  // 站点更新推送
  CHECKER = "0100"
}

export default TAGS
