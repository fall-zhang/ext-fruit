import { readJSONFile } from './utils/file-utils'
import { APP_CONFIG_FILE_NAME, APP_PROFILE_FILE_NAME } from './const/file-name'
import type { ConfigFileJSON, ProfileFileJSON } from './types/file-content-type'
import type { OperateResult, PromiseOptResult } from './types'

/**
 * 获取全局配置文件
 */
export async function getAppConfig (): PromiseOptResult<ConfigFileJSON> {
  const conf = await readJSONFile({
    name: '',
    path: '/.config/' + APP_CONFIG_FILE_NAME,
    // type: 'config',
  })
  if (conf.state === 'success') {
    return {
      state: 'success',
      data: conf.data,
      msg: '文件获取成功',
    }
  }
  return conf
}
/**
 * 获取全局配置文件
 */
export async function getAppProfile (): PromiseOptResult<ProfileFileJSON> {
  const conf = await readJSONFile({
    name: '',
    path: '/.config/' + APP_PROFILE_FILE_NAME,
    // type: 'config',
  })
  if (conf.state === 'success') {
    return {
      state: 'success',
      data: conf.data,
      msg: '文件获取成功',
    }
  }
  return conf
}
