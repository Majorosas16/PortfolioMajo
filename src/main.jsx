import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// La página siempre abre en el inicio (la caja cerrada):
// el navegador no restaura el scroll anterior y se ignora un #ancla que haya quedado en la URL.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
