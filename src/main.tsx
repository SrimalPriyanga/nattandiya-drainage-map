import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Leaflet's stylesheet first, so the overrides in index.css win.
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App'
import { ToastProvider } from './components/toast/ToastProvider'
import { I18nProvider } from './i18n/I18nProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </I18nProvider>
  </StrictMode>,
)
