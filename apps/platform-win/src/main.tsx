import './assets/styles.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { DocView } from './view/doc-view'
import { DictView } from './view/dict-view/dict-view'
// getConfig

const container = document.getElementById('root')!
const root = createRoot(container)

async function render () {
  root.render(<React.StrictMode>
    <DictView/>
    <DocView/>
  </React.StrictMode>)
}
render()
