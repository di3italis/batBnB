import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store/store.js';
import { restoreCSRF, csrfFetch } from './store/csrf';

async function renderApp() {
  const store = await configureStore();

  if (process.env.NODE_ENV !== 'production') {
    window.store = store;
  }

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
}

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}

renderApp();

