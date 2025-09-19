// 该文件用作 tauri 和 js 进行通信
import type { FileSystem, OperateResult } from '@P/common/types/FileSystem'
import type { FileItem, FileJSON, SystemFileItem } from '@P/common/types/File'
// import { addTextFile, addJSONFile, convertPathToLocal, readTextFile, touchDir, updateMenuConf, readJSONFile, updateFileName, removeFileOrDir } from './utils'
import { addTextFile, addJSONFile, readTextFile, touchDir, updateMenuConf, readJSONFile, updateFileName, removeFileOrDir } from '../bridge/file-utils'
import { convertPathToLocal } from '../bridge/path-utils'
import { sep } from '@tauri-apps/api/path'
import { getWorkspaceFileList } from './get-workspace-conf'

// tauri 内容应该始终为相对路径
class TauriFileSystem implements FileSystem {
  fileList: FileItem[] = []
  rootPath:string = 'workspace'
  // constructor (spaceFiles:FileItem[], basePath:string) {
  //   this.fileList = spaceFiles
  //   this.rootPath = basePath
  // }
  initTauriFS (spaceFiles:FileItem[], basePath:string) {
    this.fileList = spaceFiles
    this.rootPath = basePath
  }

  getFile (filePath: string): FileItem {
    let analyzePath = filePath
    if (filePath.startsWith('/')) {
      analyzePath = analyzePath.slice(1)
    }
    const paths = analyzePath.split('/')
    let currentList:SystemFileItem[] = this.fileList
    let result:SystemFileItem = {
      fileName: 'empty',
      fileType: 'folder',
      filePath: '/',
      fileSuffix: ''
    }
    paths.forEach((pathItem:string) => {
      let getFileState = false
      const isFinalPath = pathItem.includes('.') && !pathItem.startsWith('.')
      currentList.forEach((item, index) => {
        let fullFileName:string = ''
        if (isFinalPath) {
          fullFileName = item.fileName + '.' + item.fileSuffix
        } else {
          fullFileName = item.fileName
        }
        if (fullFileName === pathItem) {
          result = item
          getFileState = true
          if (item.children) currentList = item.children
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
    let currentList:SystemFileItem[] = this.fileList
    paths.forEach((pathItem:string) => {
      let getFileState = false
      const isFinalPath = pathItem.includes('.')
      currentList.forEach((item, index) => {
        let fullFileName:string = ''
        if (isFinalPath) {
          fullFileName = item.fileName + '.' + item.fileSuffix
        } else {
          fullFileName = item.fileName
        }
        if (fullFileName === pathItem) {
          getFileState = true

          if (item.children) {
            currentList = item.children
          } else if (item.fileType === 'folder') {
            currentList = []
          } else {
            console.error('文件夹下没有文件，或并非文件夹', item)
          }
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
    let convertPath = fileInfo.filePath
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

  async getFileContent (fileInfo: FileItem): Promise<OperateResult<string | FileJSON>> {
    // console.log('🚀 ~ TauriFileSystem ~ getFileContent ~ fileInfo:', fileInfo)
    const result:OperateResult<string | FileJSON> = {
      state: 'failure',
      msg: '获取文件内容失败',
      data: ''
    }
    if (fileInfo.fileSuffix === 'json') {
      const jsonRes = await readJSONFile(fileInfo)
      result.data = jsonRes.data as FileJSON
    } else if (fileInfo.fileType === 'markdown') {
      const fileText = await readTextFile(fileInfo)
      result.data = fileText.data
    } else {
      console.warn('未知文件类型，无法获取文件详情', fileInfo)
    }
    result.msg = '获取文件内容成功'
    result.state = 'success'
    return result
  }

  async updateFileInfo (oldInfo: FileItem, newInfo: FileItem): Promise<OperateResult> {
    const result:OperateResult<string> = {
      state: 'failure',
      msg: '更新文件名称失败'
    }
    // let localDirItemList = oldInfo.filePath.split('/')
    // if (localDirItemList[0] === '') {
    //   localDirItemList = localDirItemList.slice(1)
    // }
    let fileInfoChanged = false
    const storeFileInfo = this.getFile(oldInfo.filePath)

    // 文件路径更改后
    if (oldInfo.filePath !== newInfo.filePath) {
      updateFileName(oldInfo, newInfo)
    }

    // 查看其他属性更改
    Object.keys({ ...oldInfo, ...newInfo }).forEach((key) => {
      const infoKey = key as 'fileName'
      // const isNewInfoEmpty = Boolean(newInfo[infoKey])
      if (newInfo[infoKey] === oldInfo[infoKey]) {
        return
      }
      fileInfoChanged = true
      // 为空则忽略
      storeFileInfo[infoKey] = newInfo[infoKey] ?? oldInfo[infoKey]
    })
    if (oldInfo.fileScheme !== newInfo.fileScheme) {
      this.getFile(oldInfo.filePath).fileScheme = newInfo.fileScheme
    }
    // console.log('🚀 ~ TauriFileSystem ~ updateFileInfo ~ fileInfoChanged:', fileInfoChanged)

    if (fileInfoChanged) {
      await updateMenuConf(this.fileList).then(res => {
        console.log('保存菜单配置成功', res)
      }).catch(err => {
        console.log('保存菜单配置失败', err)
      })
    }
    result.state = 'success'
    result.msg = '更新文件名称成功'
    return result
  }

  async updateFileContent (fileInfo: FileItem, content: string | FileJSON): Promise<OperateResult> {
    const result:OperateResult<string> = {
      state: 'failure',
      msg: '更新文件失败'
    }
    const touchResult = await touchDir(fileInfo.filePath)
    if (touchResult.state === 'failure') {
      console.warn('当前文件路径有问题', fileInfo.filePath)
      return result
    }
    try {
      if (fileInfo.fileType === 'markdown' && typeof content === 'string') {
        await addTextFile(fileInfo, content)
        result.state = 'success'
        result.msg = '更新文件成功'
        return result
      } else if (fileInfo.fileSuffix === 'json' && typeof content === 'object') {
        await addJSONFile(fileInfo, content)
      } else {
        console.warn('文件类型与文件内容不对应：', fileInfo, content)
      }
    } catch (err) {
      console.warn('更新文件失败', err)
    }
    return result
  }

  async addFile (fileInfo: FileItem, content: string | FileJSON): Promise<OperateResult> {
    const result:OperateResult = {
      state: 'failure',
      msg: '文件添加失败'
    }
    // await writeTextFile('app.conf', 'file contents', { dir: BaseDirectory.AppConfig })
    try {
      if (fileInfo.fileType === 'folder') {
        // const fileName = await convertPathToLocal(fileInfo.filePath)
        await touchDir(fileInfo.filePath)
      } else if (typeof content === 'string') {
        await addTextFile(fileInfo, content)
      } else if (fileInfo.fileSuffix === 'json') {
        await addJSONFile(fileInfo, content as FileJSON)
      } else {
        console.warn('未知的文件格式', fileInfo)
      }
      // const filePathList = this.getFilePath(fileInfo)
      // this.fileList.push(fileInfo)
      await this.reload()
      await updateMenuConf(this.fileList).then(res => {
        console.log('保存菜单配置成功')
      }).catch(err => {
        console.log('保存菜单配置失败', err)
      })
      result.state = 'success'
      result.msg = '添加文件成功'
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

  searchFile (fileName: string): Promise<FileItem[]> {
    throw new Error('Method not implemented.')
  }

  duplicateFile (fileInfo: FileItem): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  onBeforeClose (func: any): void {
    throw new Error('Method not implemented.')
  }

  async reload (): Promise<OperateResult<unknown>> {
    const result:OperateResult = {
      state: 'failure',
      msg: '重载文件系统失败'
    }
    this.fileList = await getWorkspaceFileList(this.rootPath)
    result.state = 'success'
    result.msg = '重载文件系统成功'
    // throw new Error('Method not implemented.')
    return result
  }

  getFileBlob (filePath: string): Promise<OperateResult<unknown>> {
    throw new Error('Method not implemented.')
  }

  // 外部文件系统中，文件发生变化的时候执行
  onFileChange () {

  }

  // 工作区的文件夹变动的时候执行
  onChangeRootPath (newPath:string) {
    this.rootPath = newPath
  }

  updateFileListItem (oldInfo: FileItem, newInfo:FileItem): void {
  }
}

export const tauriFileSystem = new TauriFileSystem()
