import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// Ensure CSS is applied before rendering the app
document.addEventListener('DOMContentLoaded', () => {
  // Force preloader to be visible during the initial load
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.display = 'flex';
  }
});

// Render the React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
