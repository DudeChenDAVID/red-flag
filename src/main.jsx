import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'
import './styles/global.css'
const routerBase = import.meta.env.DEV ? '/' : import.meta.env.BASE_URL

createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter basename={routerBase}><App /></BrowserRouter></React.StrictMode>)
