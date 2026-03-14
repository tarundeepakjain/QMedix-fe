import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/">
      <App />
  </BrowserRouter>
);
