import type { AppConfig } from '@/config/app-config'
import { writeFile, BaseDirectory } from '@tauri-apps/plugin-fs'
function touchFile (path: string) {
  return writeFile(path, {
    // baseDir: BaseDirectory.AppConfig,
    
  })
}
export function updateConfig (newConfig: AppConfig): AppConfig {
  return newConfig
}
