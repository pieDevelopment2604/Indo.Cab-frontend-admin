import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './store'
import { queryClient } from './lib/queryClient'
import './index.css'
import 'leaflet/dist/leaflet.css'
import App from './App.tsx'
import RecaptchaProvider from './providers/RecaptchaProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RecaptchaProvider>
        <App />
        </RecaptchaProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
