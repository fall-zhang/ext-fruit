// 首次安装之后，向文件内添加文件
import { stringifyObject } from '@P/common/utils/json'

/**
 * 添加初始化文件
 */
export const addInitFile = async () => {
  const addFileList = []
  addFileList.push()
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
  return Promise.allSettled(addFileList).then(res => {
    console.log('完成设置的初始化')
  }).catch(err => {
    console.warn('初始化文件出现问题，可能是系统权限不足', err)
  })
}

