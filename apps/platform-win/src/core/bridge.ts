// 该文件用作 tauri 和 js 进行通信，调用 rust 的方法
// tauri 提供的 fs API 无法访问文件系统的任意路径
import { invoke } from '@tauri-apps/api/core'

export const helloTauri = () => {
  invoke('greet', {
    name: '老东西'
  })
}
