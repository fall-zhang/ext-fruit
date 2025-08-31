import { useContext } from 'react'
import { FileOperateContext } from '../context/FileOperator'

export const useFileSystem = () => {
  const fileOperate = useContext(FileOperateContext)
  return fileOperate
}
