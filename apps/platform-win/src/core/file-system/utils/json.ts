
/**
 * 解析 JSON 数据
 */
// jsonc-parser 解析 jsonc 数据，并且直接在字符串中对 json 进行操作
// 详情可看：https://github.com/microsoft/node-jsonc-parser/blob/main/src/test/edit.test.ts
// import { createScanner, parse } from 'jsonc-parser'
import type { FileJSON } from '@/core/file-system/types/file-content-type'

export const parseJSON = (str: string): FileJSON => {
  let result
  try {
    result = JSON.parse(str)
  } catch (err) {
    console.warn('使用 json 解析失败')
  }
  return result
}

export const stringifyObject = (data: Record<string, any>): string => {
  return JSON.stringify(data)
}
