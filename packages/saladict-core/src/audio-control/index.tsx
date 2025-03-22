import React from 'react'
import ReactDOM from 'react-dom'
import Waveform from '@/components/Waveform/Waveform'

import './audio-control.scss'
import { createRoot } from 'react-dom/client'

const searchParams = new URL(document.URL).searchParams

const darkMode = Boolean(searchParams.get('darkmode'))

const root = createRoot(document.getElementById('root')!)
root.render(<Waveform darkMode={darkMode} />)
