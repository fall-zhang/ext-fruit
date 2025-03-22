import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './views/index.css'
import App from './views/App.tsx'
import '@P/saladict-core/src/content/index.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
