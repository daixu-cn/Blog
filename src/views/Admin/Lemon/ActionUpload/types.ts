import type { UploadFile } from "element-plus"

export interface IUpload extends UploadFile {
  path?: string
  error?: any
}

export interface IResult {
  show: boolean
  list: UploadFile[]
}
