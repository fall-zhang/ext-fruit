import './assets/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

const router = createRouter({ routeTree })
const container = document.getElementById('root')!
const root = createRoot(container)

// async function render () {
root.render(<StrictMode>
  <RouterProvider router={router} />
</StrictMode>)
// }
// render()

document.addEventListener('DOMContentLoaded', async () => {
  // 也可以在 Vue 的 onMounted 或 React 的 useEffect 中调用
  const searchWindow = await WebviewWindow.getByLabel('search-view')
  setTimeout(() => {
    searchWindow?.show()
    searchWindow?.setCursorVisible(true)
  }, 160) // 稍微延迟一点点可以确保渲染已完成
})
