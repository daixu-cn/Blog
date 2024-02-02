import { AnimationConfigWithPath, AnimationConfigWithData } from "lottie-web"

export interface IProps {
  width?: string
  height?: string
  fileName?: string
  path?: string
  options?:
    | Partial<AnimationConfigWithPath<"svg">>
    | Partial<AnimationConfigWithData<"svg">>
}
