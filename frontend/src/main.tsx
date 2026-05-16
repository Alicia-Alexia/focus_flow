import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx' 
import './index.css' 

const savedTheme = localStorage.getItem('@focusflow:theme') || 'indigo';
document.documentElement.setAttribute('data-theme', savedTheme)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)