import React from 'react'
import { createRoot } from 'react-dom/client'

async function main () {
  const App = () => (
    <div >
      欢迎回家
    </div>
  )
  const root = createRoot(document.createElement('div'))
  root.render(<App />)
}

export default main
