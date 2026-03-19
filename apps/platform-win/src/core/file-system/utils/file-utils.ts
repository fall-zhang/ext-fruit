import type { FileItem } from '../types/file-type'
import {} from '@tauri-apps/api'
import { create, readDir, readFile, exists, rename, BaseDirectory, remove } from '@tauri-apps/plugin-fs'
import type { OperateResult, PromiseOptResult } from '../types'
import type { FileJSON } from '../types/file-content-type'
import { join, sep } from '@tauri-apps/api/path'

export async function touchDir (filePath: string): PromiseOptResult {
  const convertPath = await join(filePath)
  if (await exists(convertPath)) {
    return {
      state: 'success',
      msg: '文件可正常访问',
      data: null,
    }
  }
  return {
    state: 'failure',
    msg: '文件不存在',
  }
}

export async function addTextFile (fileInfo: FileItem, fileContent: string): Promise<OperateResult> {
  const file = await create(fileInfo.path)
  await file.write(new TextEncoder().encode(fileContent))
  await file.close()
  return {
    state: 'success',
    msg: '文件添加成功',
    data: null,
  }
}
export async function addJSONFile (fileInfo: FileItem, fileContent: FileJSON): Promise<OperateResult> {
  const file = await create(fileInfo.path)
  const textContent = JSON.stringify(fileContent)
  await file.write(new TextEncoder().encode(textContent))
  await file.close()
  return {
    state: 'success',
    msg: '文件添加成功',
    data: null,
  }
}

export async function readTextFile (fileInfo: FileItem): Promise<OperateResult> {
  const res = await readFile(fileInfo.path)
  const fileContent = new TextDecoder().decode(res)
  return {
    state: 'success',
    msg: '文件添加成功',
    data: fileContent,
  }
}

export async function readJSONFile (fileInfo: FileItem): Promise<OperateResult> {
  const localPath = await join(fileInfo.path)
  const res = await readFile(localPath)
  try {
    const fileContent = new TextDecoder().decode(res)
    return {
      state: 'success',
      msg: '文件读取成功',
      data: JSON.parse(fileContent),
    }
  } catch (err) {
    console.log('⚡️ line:44 ~ err: ', err)
  }
  return {
    state: 'failure',
    msg: '文件读取失败',
  }
}

export async function updateFileName (oldInfo: FileItem, newInfo: FileItem): Promise<OperateResult> {
  await rename(oldInfo.path, newInfo.path)
  return {
    state: 'success',
    msg: '名称更新成功',
    data: null,
  }
}

export async function removeFileOrDir (fileInfo: FileItem): Promise<OperateResult> {
  await remove(fileInfo.path)
  return {
    state: 'success',
    msg: '文件删除成功',
    data: null,
  }
}

/**
 * 获取该路径下的所有文件
 * C:\foo\dir_name
 * @returns {FileItem[]}
 */
export async function getDirFileList (dir: string): PromiseOptResult<FileItem[]> {
  const fileList = await readDir(dir)
  const result = fileList.map(file => {
    return {
      name: file.name,
      path: dir + sep() + file.name,
    }
  })
  return {
    state: 'success',
    msg: '目录下的文件获取成功',
    data: result,
  }
}
