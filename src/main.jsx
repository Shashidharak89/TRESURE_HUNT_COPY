import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthState } from './contexts/AuthState.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthState>
    <App />
    </AuthState>
  </StrictMode>,
)
