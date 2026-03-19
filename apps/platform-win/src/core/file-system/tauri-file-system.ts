// 该文件用作 tauri 和 js 进行通信
import { addTextFile, addJSONFile, readTextFile, readJSONFile, touchDir, updateFileName, removeFileOrDir } from './utils/file-utils'
import { convertPathToLocal } from './utils/path-utils'
import { sep } from '@tauri-apps/api/path'
import type { OperateResult, PromiseOptResult } from './types'
import type { FileItem } from './types/file-type'
import type { WordSaveJSON } from './types/file-content-type'
// updateMenuConf, updateFileName, removeFileOrDir

// tauri 内容应该始终为相对路径
// 用于读取所有 年、月组成的单词列表
class TauriFileSystem {
  fileList: FileItem[] = []
  rootPath: string = 'workspace'
  // constructor (spaceFiles:FileItem[], basePath:string) {
  //   this.fileList = spaceFiles
  //   this.rootPath = basePath
  // }
  initTauriFS (spaceFiles: FileItem[], basePath: string) {
    this.fileList = spaceFiles
    this.rootPath = basePath
  }

  getFile (filePath: string): FileItem {
    let analyzePath = filePath
    if (filePath.startsWith('/')) {
      analyzePath = analyzePath.slice(1)
    }
    const paths = analyzePath.split('/')
    const currentList: FileItem[] = this.fileList
    let result: FileItem = {
      name: 'empty',
      path: '/',
    }
    paths.forEach((pathItem: string) => {
      let getFileState = false
      const isFinalPath = pathItem.includes('.') && !pathItem.startsWith('.')
      currentList.forEach((item, index) => {
        const fullFileName: string = item.name

        if (fullFileName === pathItem) {
          result = item
          getFileState = true
          // if (item.children) currentList = item.children
        }
      })
      if (!getFileState) {
        console.error('getFile 找不到对应的文件 filePath：', filePath)
        return ''
      }
    })
    return result
  }

  getDirFiles (filePath: string): FileItem[] {
    let handleFile = filePath
    if (filePath.startsWith('/')) {
      handleFile = filePath.slice(1)
    }
    const paths = handleFile.split('/')
    if (paths.at(-1)?.includes('.')) {
      const fileFinalPath = paths.at(-1)?.split('.')[0]
      paths[paths.length - 1] = fileFinalPath || ''
    }
    if (paths.length === 0 || paths[0] === '') {
      return this.fileList
    }
    const currentList: FileItem[] = this.fileList
    paths.forEach((pathItem: string) => {
      let getFileState = false
      currentList.forEach((item, index) => {
        const fullFileName: string = item.name
        if (fullFileName === pathItem) {
          getFileState = true
        }
      })
      if (!getFileState) {
        console.error(`#getDirFileList 找不到对应的文件 filePath:${filePath}`)
        return ''
      }
    })
    return currentList
    // throw new Error('Method not implemented.')
  }

  async getFilePath (fileInfo: FileItem): Promise<string> {
    let convertPath = fileInfo.path
    if (convertPath.startsWith('/')) {
      convertPath = convertPath.slice(1)
    }
    const path = await convertPathToLocal(convertPath)
    const sepSign = sep()
    if (!this.rootPath.endsWith(sepSign) && !path.startsWith(sepSign)) {
      const fullFilePath = this.rootPath + sep() + path
      return fullFilePath
    }
    const fullFilePath = this.rootPath + path
    return fullFilePath
  }

  getRootFileList (): FileItem[] {
    return this.fileList
  }

  async getFileContent (fileInfo: FileItem): Promise<OperateResult<string | WordSaveJSON>> {
    // console.log('🚀 ~ TauriFileSystem ~ getFileContent ~ fileInfo:', fileInfo)
    const jsonRes = await readJSONFile(fileInfo)
    if (jsonRes.state === 'success') {
      return {
        state: 'success',
        msg: '获取文件内容成功',
        data: jsonRes.data,
      }
    }
    return jsonRes
  }

  async updateFileInfo (oldInfo: FileItem, newInfo: FileItem): PromiseOptResult {
    const result: OperateResult<string> = {
      state: 'failure',
      msg: '更新文件名称失败',
    }
    // let localDirItemList = oldInfo.filePath.split('/')
    // if (localDirItemList[0] === '') {
    //   localDirItemList = localDirItemList.slice(1)
    // }

    // 文件路径更改后
    if (oldInfo.path !== newInfo.path) {
      updateFileName(oldInfo, newInfo)
    }
    return {
      state: 'success',
      msg: '更新文件名称成功',
      data: null,
    }
  }

  async updateFileContent (fileInfo: FileItem, content: string | WordSaveJSON): Promise<OperateResult> {
    const result: OperateResult<string> = {
      state: 'failure',
      msg: '更新文件失败',
    }
    const touchResult = await touchDir(fileInfo.path)
    if (touchResult.state === 'failure') {
      console.warn('当前文件路径有问题', fileInfo.path)
      return result
    }
    try {
      if (typeof content === 'string') {
        await addTextFile(fileInfo, content)
        return result
      } else if (typeof content === 'object') {
        await addJSONFile(fileInfo, content)
      } else {
        console.warn('文件类型与文件内容不对应：', fileInfo, content)
      }
    } catch (err) {
      console.warn('更新文件失败', err)
    }
    return result
  }

  async addFile (fileInfo: FileItem, content: string | WordSaveJSON): Promise<OperateResult> {
    const result: OperateResult = {
      state: 'failure',
      msg: '文件添加失败',
    }
    // await writeTextFile('app.conf', 'file contents', { dir: BaseDirectory.AppConfig })
    try {
      if (typeof content === 'string') {
        await addTextFile(fileInfo, content)
      } else if (typeof content === 'object') {
        await addJSONFile(fileInfo, content as WordSaveJSON)
      } else {
        console.warn('未知的文件格式', fileInfo)
      }
      // const filePathList = this.getFilePath(fileInfo)
      // this.fileList.push(fileInfo)
      await this.reload()
      return {
        state: 'success',
        msg: '添加文件成功',
        data: null,
      }
    } catch (error) {
      console.log('添加本地文件时出错:', error)
    }
    return result
  }

  async deleteFile (fileInfo: FileItem): Promise<OperateResult> {
    const result = await removeFileOrDir(fileInfo)
    return result
  }

  async deleteFileAndFolder (fileInfo: FileItem): Promise<OperateResult> {
    const result = await removeFileOrDir(fileInfo)
    return result
  }

  searchFile (name: string): Promise<FileItem[]> {
    throw new Error('Method not implemented.')
  }

  duplicateFile (fileInfo: FileItem): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  onBeforeClose (func: any): void {
    throw new Error('Method not implemented.')
  }

  async reload (): Promise<OperateResult<unknown>> {
    return {
      state: 'success',
      msg: '重载文件系统成功',
      data: null,
    }
  }

  getFileBlob (filePath: string): Promise<OperateResult<unknown>> {
    throw new Error('Method not implemented.')
  }

  // 外部文件系统中，文件发生变化的时候执行
  onFileChange () {

  }

  // 工作区的文件夹变动的时候执行
  onChangeRootPath (newPath: string) {
    this.rootPath = newPath
  }

  updateFileListItem (oldInfo: FileItem, newInfo: FileItem): void {
  }
}

export const tauriFileSystem = new TauriFileSystem()
