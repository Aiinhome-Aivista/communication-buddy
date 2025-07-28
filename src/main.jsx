import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './provider/AuthProvider.jsx'
import { TopicProvider } from './provider/TopicProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TopicProvider>
        <App />
      </TopicProvider>
    </AuthProvider>
  </StrictMode>,
)
