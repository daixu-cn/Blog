/**
 * @Description: markdown-it target="_blank" extension
 * @Author: daixu
 * @Date: 2023-11-30 10:06:08
 */

import markdownit from "markdown-it/lib"

const TargetBlankExtension = (md: markdownit) => {
  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const aIndex = token.attrIndex("target")

    if (aIndex < 0) {
      token.attrPush(["target", "_blank"])
    } else if (token.attrs) {
      token.attrs[aIndex][1] = "_blank"
    }

    return defaultRender(tokens, idx, options, env, self)
  }
}

export default TargetBlankExtension
