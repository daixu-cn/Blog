import SparkMD5 from "spark-md5"
import http from "@/server"

type Methods = "get" | "post" | "put" | "delete" | "patch"
interface Options {
  url: string
  methods: Methods
  // 额外参数
  params: {
    [key: string]: any
  }
  // 拆分的分片大小 默认2MB
  chunkSize?: number
  // 上传进度
  onProgress?: (currentChunk: number, chunks: number) => void
  // 上传合并成功
  onSuccess?: (filePath: string) => void
  // 上传异常
  onError?: (error: any) => void
}

// 计算文件MD5
function calculateFileMd5(file: File, chunkSize: number) {
  return new Promise<string>((resolve, reject) => {
    const chunks = Math.ceil(file.size / chunkSize)
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()

    let currentChunk = 0
    reader.onload = (e) => {
      spark.append(e.target?.result as ArrayBuffer)
      currentChunk++

      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    reader.onerror = () => {
      reject("File read error")
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      reader.readAsArrayBuffer(file.slice(start, end))
    }

    loadNext()
  })
}
// 计算分片文件MD5
function calculateChunkMd5(file: File, start: number, end: number) {
  return new Promise<string>((resolve, reject) => {
    const chunk = file.slice(start, end)
    const reader = new FileReader()
    reader.readAsArrayBuffer(chunk)
    reader.onload = (e) => {
      const spark = new SparkMD5.ArrayBuffer()
      spark.append(e.target?.result as ArrayBuffer)
      resolve(spark.end())
    }
    reader.onerror = () => {
      reject("File Chunk read error")
    }
  })
}

/**
 * @description 文件断点续传
 * @param {File} file 文件
 * @param {Options} options 配置项
 * @return {void}
 */
export default async function resumeUpload(file: File, options: Options) {
  const CHUNK_SIZE = options.chunkSize ?? 1024 * 1024 * 2
  const chunks = Math.ceil(file.size / CHUNK_SIZE)
  const fileHash = await calculateFileMd5(file, CHUNK_SIZE)

  let currentChunk = 0

  async function uploadChunk() {
    if (currentChunk < chunks) {
      const start = currentChunk * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)
      const chunkHash = await calculateChunkMd5(file, start, end)

      try {
        const formData = new FormData()
        formData.append("file", chunk)
        formData.append("name", fileHash)
        formData.append("chunk", String(currentChunk + 1))
        formData.append("chunks", String(chunks))
        formData.append("hash", chunkHash)
        for (const key in options.params) {
          formData.append(key, options.params[key])
        }

        const res = await http[options.methods](options.url, formData)
        if (res.code === 0) {
          options.onProgress?.(++currentChunk, chunks)
          options.onSuccess?.(res.data)
        } else if (res.code === 12009) {
          currentChunk = res.data
          uploadChunk()
        } else if (res.code === 12011) {
          options.onProgress?.(++currentChunk, chunks)
          uploadChunk()
        } else {
          options.onError?.(res)
        }
      } catch (error: any) {
        options.onError?.(error)
      }
    }
  }

  uploadChunk()
}
