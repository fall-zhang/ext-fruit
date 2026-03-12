import type { AxiosRequestConfig } from 'axios'

/**
 * Axios 到 Fetch 参数转换器
 * 使用函数式编程范式实现
 */

// ==================== 类型定义 ====================

export type AxiosToFetchOptions = {
  url: string
  init?: RequestInit
}

// ==================== 工具函数 ====================

/**
 * 纯函数：转换请求方法
 * axios 的 method 可能是大写或小写，fetch 需要大写
 */
const transformMethod = (method: string = 'get'): string => {
  return method.toUpperCase()
}

/**
 * 纯函数：转换请求头
 * axios 的 headers 可以是对象、数组或 Headers 实例
 */
const transformHeaders = (headers: AxiosRequestConfig['headers']): HeadersInit | undefined => {
  if (!headers) return undefined

  // 如果是 Headers 实例，直接返回
  if (headers instanceof Headers) {
    return headers
  }

  // 如果是数组格式 [['key', 'value'], ...]
  if (Array.isArray(headers)) {
    const newHeaders = new Headers()
    headers.forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        newHeaders.append(key, String(value))
      }
    })
    return newHeaders
  }

  // 如果是普通对象
  if (typeof headers === 'object') {
    const newHeaders = new Headers()
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        newHeaders.append(key, String(value))
      }
    })
    return newHeaders
  }

  return undefined
}

/**
 * 纯函数：转换请求体
 * axios 使用 data 字段，fetch 使用 body 字段
 */
const transformBody = (data: any, method: string): BodyInit | null | undefined => {
  if (!data) return undefined

  const methodLower = method.toLowerCase()

  // GET 和 HEAD 请求不应该有 body
  if (methodLower === 'get' || methodLower === 'head') {
    console.warn(`axiosToFetch: ${method.toUpperCase()} 请求不应包含 body，已忽略`)
    return undefined
  }

  // 如果是 FormData、URLSearchParams、Blob、ArrayBuffer 等类型，直接使用
  if (
    data instanceof FormData ||
    data instanceof URLSearchParams ||
    data instanceof Blob ||
    data instanceof ArrayBuffer
  ) {
    return data as BodyInit
  }

  // 处理 ArrayBufferView（如 Uint8Array, Int32Array 等）
  if (ArrayBuffer.isView(data)) {
    // TypeScript 类型断言，因为 ArrayBufferView 是 BodyInit 的有效类型
    return data as BodyInit
  }

  // 如果是普通对象或数组，转换为 JSON 字符串
  if (typeof data === 'object') {
    return JSON.stringify(data)
  }

  // 其他类型转换为字符串
  return String(data)
}

/**
 * 纯函数：转换凭证配置
 * axios 使用 withCredentials，fetch 使用 credentials
 */
const transformCredentials = (withCredentials: boolean | undefined): RequestCredentials | undefined => {
  if (withCredentials === undefined) return undefined
  return withCredentials ? 'include' : 'omit'
}

/**
 * 纯函数：转换超时配置
 * axios 使用 timeout，fetch 没有直接对应，可以通过 AbortController 实现
 */
const createAbortController = (timeout: number | undefined): AbortController | undefined => {
  if (!timeout || timeout <= 0) return undefined

  const controller = new AbortController()
  setTimeout(() => controller.abort(), timeout)
  return controller
}

/**
 * 纯函数：转换响应类型
 * axios 使用 responseType，fetch 没有直接对应
 */
const transformResponseType = (responseType: AxiosRequestConfig['responseType']): RequestInit['redirect'] | undefined => {
  // 这里只是示例，实际 fetch 的 responseType 通过 response 的方法处理
  return undefined
}

/**
 * 纯函数：转换基础 URL
 * axios 使用 baseURL + url，fetch 需要拼接
 */
const buildFullUrl = (baseURL: string | undefined, url: string | undefined): string => {
  if (!url) throw new Error('axiosToFetch: url 是必需的')

  if (!baseURL) return url

  // 确保 baseURL 以 / 结尾，url 不以 / 开头（或正确处理）
  const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
  const path = url.startsWith('/') ? url : `/${url}`

  return `${base}${path}`
}

// ==================== 组合函数 ====================

/**
 * 函数组合：将多个转换函数组合成一个完整的转换器
 */
const composeTransforms = (config: AxiosRequestConfig): AxiosToFetchOptions => {
  const {
    baseURL,
    url,
    method = 'get',
    headers,
    data,
    params,
    timeout,
    withCredentials,
    signal,
  } = config

  // 1. 构建完整的 URL（处理 baseURL 和 params）
  let fullUrl = buildFullUrl(baseURL, url)

  // 处理查询参数（axios 的 params）
  if (params && typeof params === 'object') {
    const urlObj = new URL(fullUrl, window.location.origin)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value))
      }
    })
    fullUrl = urlObj.toString()
  }

  // 2. 构建 fetch 的 init 对象
  const init: RequestInit = {}

  // 3. 应用各个转换函数
  init.method = transformMethod(method)

  const transformedHeaders = transformHeaders(headers)
  if (transformedHeaders) {
    init.headers = transformedHeaders
  }

  const transformedBody = transformBody(data, method)
  if (transformedBody !== undefined) {
    init.body = transformedBody
  }

  const transformedCredentials = transformCredentials(withCredentials)
  if (transformedCredentials) {
    init.credentials = transformedCredentials
  }

  // 4. 处理超时（通过 AbortController）
  const abortController = createAbortController(timeout)
  if (abortController) {
    init.signal = abortController.signal
  }

  // 5. 处理已有的 signal（axios 的 cancel token 或 AbortSignal）
  if (signal) {
    // axios 的 signal 类型可能与标准的 AbortSignal 不完全兼容
    // 使用类型断言，因为在实际运行时它们是兼容的
    init.signal = signal as AbortSignal
  }

  // 6. 处理其他配置（如 mode、cache、redirect 等）
  // axios 的 adapter、transformRequest 等 fetch 不支持，忽略

  return {
    url: fullUrl,
    init,
  }
}

// ==================== 主导出函数 ====================

/**
 * 将 axios 请求配置转换为 fetch 所需的参数
 * 这是一个纯函数，相同的输入总是产生相同的输出
 *
 * @param config - axios 请求配置
 * @returns fetch 所需的 url 和 init 对象
 */
export const axiosToFetch = (config: AxiosRequestConfig): AxiosToFetchOptions => {
  // 验证输入
  if (!config) {
    throw new Error('axiosToFetch: config 参数是必需的')
  }

  // 使用函数组合进行转换
  return composeTransforms(config)
}

/**
 * 柯里化版本的转换函数，便于函数组合
 *
 * @param config - axios 请求配置
 * @returns 返回一个函数，该函数接收 fetch 并执行请求
 */
// export const axiosToFetchCurried = (config: AxiosRequestConfig) => {
//   const { url, init } = axiosToFetch(config)
//   return (fetchFn: typeof fetch = fetch) => fetchFn(url, init)
// }

/**
 * 高阶函数：创建带有默认配置的转换器
 *
 * @param defaultConfig - 默认的 axios 配置
 * @returns 一个函数，该函数接收部分配置并返回转换后的 fetch 参数
 */
// export const createAxiosToFetchConverter = (defaultConfig: Partial<AxiosRequestConfig> = {}) => {
//   return (config: AxiosRequestConfig): AxiosToFetchOptions => {
//     const mergedConfig = { ...defaultConfig, ...config }
//     return axiosToFetch(mergedConfig)
//   }
// }

// ==================== 辅助函数 ====================

/**
 * 使用 axios 的参数类型调用 fetch
 *
 * @param config - axios 请求配置
 * @param fetchFn - 可选的 fetch 实现（默认为全局 fetch）
 * @returns Promise<Response>
 */
export const executeFetchWithAxiosParam = async (
  config: AxiosRequestConfig,
  fetchFn: typeof fetch = fetch
): Promise<Response> => {
  const { url, init } = axiosToFetch(config)
  return fetchFn(url, init)
}
