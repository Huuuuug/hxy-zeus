import axios from 'axios'

import { handleChangeRequestHeader, handleGeneralError, handleNetworkError } from './tools'

import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export interface FcResponse<T> {
  error: string
  errMessage: string
  data: T
}

export interface IAnyObj {
  [index: string]: unknown
}

export type Fn = (data: FcResponse<any>) => unknown

// 创建 axios 实例
export const server = axios.create({
  // API 请求的默认前缀
  baseURL: '/api',
  timeout: 60 * 1000, // 请求超时时间
})

// request interceptor
server.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig<any>,
  ): InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>> => {
    config = handleChangeRequestHeader(config)
    return config
  },
)

// response interceptor
server.interceptors.response.use(
  (response: AxiosResponse<any, any>): any => {
    if (response.status !== 200) return Promise.reject(response.data)
    if (!handleGeneralError(response.data.code, response.data.label, response.data.message)) return false
    return response
  },
  (err) => {
    handleNetworkError(err.response.status)
    return Promise.reject(err.response)
  },
)

/**
 * request with get
 * @param url
 * @param params
 * @param clearFn
 * @constructor
 */
export const Get = <T>(url: string, params: IAnyObj = {}, clearFn?: Fn): Promise<[any, FcResponse<T> | undefined]> =>
  new Promise((resolve) => {
    server
      .get(url, { params })
      .then((result) => {
        let res: FcResponse<T>
        if (clearFn !== undefined) {
          res = clearFn(result.data) as unknown as FcResponse<T>
        } else {
          res = result.data as FcResponse<T>
        }
        resolve([null, res as FcResponse<T>])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })

/**
 * request with post
 * @param url
 * @param data
 * @param params
 * @constructor
 */
export const Post = <T>(
  url: string,
  data: IAnyObj = {},
  params: IAnyObj = {},
): Promise<[any, FcResponse<T> | undefined]> => {
  return new Promise((resolve) => {
    server
      .post(url, data, { params })
      .then((result) => {
        resolve([null, result.data as FcResponse<T>])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })
}

/**
 * request with put
 * @param url
 * @param data
 * @param params
 * @constructor
 */
export const Put = <T>(
  url: string,
  data: IAnyObj = {},
  params: IAnyObj = {},
): Promise<[any, FcResponse<T> | undefined]> => {
  return new Promise((resolve) => {
    server
      .put(url, data, { params })
      .then((result) => {
        resolve([null, result.data as FcResponse<T>])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })
}

export const Delete = <T>(url: string, params: IAnyObj = {}): Promise<[any, FcResponse<T> | undefined]> => {
  return new Promise((resolve) => {
    server
      .delete(url, { params })
      .then((result) => {
        resolve([null, result.data as FcResponse<T>])
      })
      .catch((err) => {
        resolve([err, undefined])
      })
  })
}
