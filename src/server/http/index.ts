import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

import { ElMessage } from "element-plus"
import ErrorStatus from "@/server/http/ErrorStatus"

class HTTP {
  instance: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    // 创建axios实例
    this.instance = axios.create(config)
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        if (config.headers) {
          const token = sessionStorage.getItem("token")
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        if (response.data.code !== 0) {
          ElMessage.error(response.data.msg)
        }
        return response.data
      },
      (error) => {
        return Promise.reject(ErrorStatus(error))
      }
    )
  }

  request<T>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          ElMessage.error(err.message)
          reject(err)
        })
    })
  }

  get<T = any>(
    url: string,
    params: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>({ url, params, ...config, method: "GET" })
  }

  post<T = any>(
    url: string,
    data: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>({ url, data, ...config, method: "POST" })
  }

  delete<T = any>(
    url: string,
    params: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>({ url, params, ...config, method: "DELETE" })
  }

  patch<T = any>(
    url: string,
    data: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>({ url, data, ...config, method: "PATCH" })
  }

  put<T = any>(
    url: string,
    data: any = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.request<T>({ url, data, ...config, method: "PATCH" })
  }
}
export default HTTP
