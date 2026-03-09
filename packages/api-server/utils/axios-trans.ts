import type { AxiosRequestConfig } from 'axios'

type FetchToAxios = {
  (input: string, init: RequestInit): AxiosRequestConfig
  (input: Request, init: undefined): AxiosRequestConfig
}

/**
 * 将 fetch 请求参数转换为 axios 配置对象
 *  input - URL 字符串或 Request 对象
 *  [init] - 可选的 fetch 配置对象（当 input 为字符串时使用）
 * @returns  axios 请求配置对象
 */
export const fetchToAxios: FetchToAxios = (input, init) => {
  let url
  let options

  // 1. 规范化输入：处理 (url, init) 或 (request, init) 两种形式
  if (typeof input === 'string') {
    url = input
    options = init || {}
  } else if (input instanceof Request) {
    url = input.url
    // 从 Request 对象提取属性，并用 init 覆盖（模拟 fetch 的行为）
    const requestOptions = {
      method: input.method,
      headers: input.headers,
      body: input.body, // 注意：可能已被锁定，建议优先使用 init 中的 body
      mode: input.mode,
      credentials: input.credentials,
      cache: input.cache,
      redirect: input.redirect,
      referrer: input.referrer,
      referrerPolicy: input.referrerPolicy,
      integrity: input.integrity,
    }
    options = Object.assign({}, requestOptions, init)
  } else {
    throw new Error('fetchToAxios: 参数必须是字符串 URL 或 Request 对象')
  }

  // 2. 构建基础的 axios 配置
  const method = (options.method || 'get').toLowerCase()
  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
  }

  // 3. 处理请求头：将 Headers 对象转为普通对象
  if (options.headers) {
    if (typeof options.headers.entries === 'function') {
      // 如果是 Headers 实例，转换为普通对象
      const headersObj: AxiosRequestConfig['headers'] = {}
      for (const [key, value] of options.headers.entries()) {
        headersObj[key] = value
      }
      axiosConfig.headers = headersObj
    } else {
      if (Array.isArray(options.headers)) {
        const headersObj: AxiosRequestConfig['headers'] = {}
        options.headers.forEach(item => {
          headersObj[item[0]] = item[1]
        })
      } else if (options.headers instanceof Headers) {
        const head = options.headers.entries()
        const headersObj: AxiosRequestConfig['headers'] = {}
        for (const item of head) {
          headersObj[item[0]] = item[1]
        }
        axiosConfig.headers = headersObj
      } else {
        axiosConfig.headers = { ...options.headers }
      }
    }
  }

  // 4. 处理请求体：GET/HEAD 请求不能携带 body
  if (options.body) {
    if (method === 'get' || method === 'head') {
      // 忽略 body（fetch 规范也不允许，但某些实现可能允许）
      console.warn('fetchToAxios: GET/HEAD 请求不应包含 body，已忽略')
    } else {
      axiosConfig.data = options.body
    }
  }

  // 5. 处理凭证（credentials -> withCredentials）
  if (options.credentials) {
    if (options.credentials === 'include') {
      axiosConfig.withCredentials = true
    } else if (options.credentials === 'same-origin') {
      // axios 无直接对应，保持默认行为（不发送跨域凭证）
      axiosConfig.withCredentials = false
    } else if (options.credentials === 'omit') {
      axiosConfig.withCredentials = false
    }
  }

  // 6. 处理 AbortSignal（支持 axios 的 signal 字段）
  if (options.signal) {
    axiosConfig.signal = options.signal
  }

  // 7. 其他 fetch 特有配置（如 mode, cache, redirect 等）在 axios 中无直接映射，忽略

  return axiosConfig
}


