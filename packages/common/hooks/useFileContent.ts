import { useEffect, useState } from 'react'
import { useFileSystem } from './useFileSystem'
import type { TodoDataType } from '@P/editor-todo'
import type { FileInfo } from '../types/File'

/**
 * 通过 fileInfo 来获取文件内容
 * @param fileInfo
 * @returns 文件内容
 */
export const useFileContent = (fileInfo:FileInfo) => {
  const fileOperate = useFileSystem()
  const [fileContent, setFileContent] = useState<TodoDataType | null>(null)
  useEffect(() => {
    let isDestroy = true
    fileOperate.getFileContent(fileInfo).then(res => {
      if (isDestroy) return
      setFileContent(res.data as TodoDataType)
    }).catch(err => {
      console.warn(err)
    })
    return () => {
      isDestroy = false
    }
  }, [fileOperate, fileInfo])
  return [fileContent, setFileContent]
}
