import './assets/styles.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { invoke } from '@tauri-apps/api/core'
// import './core/tray-menu'
// fetch('http://dict.youdao.com/suggest?doctype=json&le=en&ver=2.0&q=sugg')
// fetch('http://dict-mobile.iciba.com/interface/index.php?c=word&m=getsuggest&nums=10&client=6&uid=0&is_need_mean=1&word=sugg')
//   .then(res => {
//     console.log('⚡️ line:17 ~ res.status: ', res.status)
//     console.log('⚡️ line:23 ~ res.statusText: ', res.body)
//     console.log('⚡️ line:25 ~ res.body: ', res.bodyUsed)
//     return res.json()
//   }).then(res => {
//     console.log('⚡️ line:23 ~ res: ', res)
//   }).catch(err => {
//     console.log('⚡️ line:55 ~ r: ', err)
//   })
// getConfig
const router = createRouter({ routeTree })
const container = document.getElementById('root')!
const root = createRoot(container)

async function render () {
  root.render(<React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>)
}
render()
