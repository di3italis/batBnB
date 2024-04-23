import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store/store.js';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import { Modal, ModalProvider } from './context/Modal.jsx'

async function renderApp() {
  const store = await configureStore();

  if (process.env.NODE_ENV !== 'production') {
    window.store = store;
  }

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ModalProvider>
        <Provider store={store}>
        <App />
        <Modal />
      </Provider>
      </ModalProvider>
    </React.StrictMode>
  );
}

renderApp();


//from aA instructions:
// const store = configureStore();
// if (process.env.NODE_ENV !== 'production') {
//   window.store = store;
// }
//
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>
// );
