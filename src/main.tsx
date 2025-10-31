import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppFireDemo from './demo/AppFireDemo.tsx';
import { MistApp } from './components/common/shader/Mist.tsx';
import { SmockeApp } from './components/common/shader/smoke/Smoke.tsx';
import App from './App.tsx';
import { AppDemo } from './demo';
import { CandleApp } from './components/cozy/Candle.tsx';
import QuickTestApp from './QuickTestApp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>

      <App />
  </StrictMode>,
)

