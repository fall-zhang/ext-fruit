import './assets/styles.css'
import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { DocView } from './view/doc-view'
// getConfig


const container = document.getElementById('root')!
const root = createRoot(container)

async function render () {
  root.render(<React.StrictMode>
    <DocView/>
  </React.StrictMode>)
}
render()


// window.addEventListener('DOMContentLoaded', () => {
//   console.log(55555555555555)
//   setup()
// })
// // Setup function
// async function setup () {
//   // Fake perform some really heavy setup task
//   console.log('Performing really heavy frontend setup task...')
//   await sleep(5)
//   console.log('Frontend setup task complete!')
//   // Set the frontend task as being completed
//   invoke('set_complete', { task: 'frontend' })
// }


// function sleep (seconds: number): Promise<void> {
//   return new Promise(resolve => setTimeout(resolve, seconds * 1000))
// }

// errorReporter()
// errorHandler(new Error('老弟'))
// throw new Error('gigig')
console.info(`   _                       ____                              
  | |    ___  ___ ___     |  _ \\ _ __ ___   ___ ___  ___ ___ 
  | |   / _ \\/ __/ __|    | |_) | '__/ _ \\ / __/ _ \\/ __/ __|
  | |__|  __/\\__ \\__ \\    |  __/| | | (_) | (_|  __/\\__ \\__ \\
  |_____\\___||___/___/    |_|   |_|  \\___/ \\___\\___||___/___/`)
