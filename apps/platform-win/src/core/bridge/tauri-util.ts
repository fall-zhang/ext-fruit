import { open as openDialog } from '@tauri-apps/plugin-dialog'
import { documentDir } from '@tauri-apps/api/path'

/**
 * 选择文件夹
 * @returns 文件夹
 */
export const chooseDir = async () => {
  return openDialog({
    directory: true,
    defaultPath: await documentDir()
  })
}
