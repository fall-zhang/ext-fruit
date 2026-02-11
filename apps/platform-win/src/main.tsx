import './assets/styles.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { DictView } from './view/dict-view/dict-view'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
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
