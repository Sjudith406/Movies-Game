import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './AppRouter.tsx'
import './styles/index.css'


ReactDOM.createRoot(document.getElementById('chokbar')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)