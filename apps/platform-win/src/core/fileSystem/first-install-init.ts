// 首次安装之后，向文件内添加文件
import welcomeFile from '@P/common/virtualFileSystem/initial-file/markdown/welcome'
import shortcutFile from '@P/common/virtualFileSystem/initial-file/markdown/shortcut'
import mdxIntroduceFile from '@P/common/virtualFileSystem/initial-file/markdown/mdx'
import { addTextFile } from '../bridge/file-utils'
import leftMenuConf from '@P/common/virtualFileSystem/initial-file/left-menu'
import workspaceConf from '@P/common/virtualFileSystem/initial-file/workspace-conf'
import { stringifyObject } from '@P/common/utils/json'
import workspaceListConf from '@P/common/virtualFileSystem/initial-file/workspace-list'

/**
 * 添加初始化文件
 */
export const addInitFile = async () => {
  const addFileList = []
  addFileList.push(addTextFile(mdxIntroduceFile, mdxIntroduceFile.content!))
  addFileList.push(addTextFile(shortcutFile, shortcutFile.content!))
  addFileList.push(addTextFile(welcomeFile, welcomeFile.content!))
  return Promise.allSettled(addFileList).then(res => {
    console.log('完成文件的初始化')
  }).catch(err => {
    console.warn('初始化文件出现问题，可能是系统权限不足', err)
  })
}

/**
 * 初始化配置文件以及配置文件夹
 */
export const addInitConf = async () => {
  const addFileList = []
  addFileList.push(addTextFile(leftMenuConf, stringifyObject(leftMenuConf.content)))
  addFileList.push(addTextFile(workspaceConf, stringifyObject(workspaceConf.content)))
  addFileList.push(addTextFile(workspaceListConf, stringifyObject(workspaceListConf.content)))
  return Promise.allSettled(addFileList).then(res => {
    console.log('完成设置的初始化')
  }).catch(err => {
    console.warn('初始化文件出现问题，可能是系统权限不足', err)
  })
}

