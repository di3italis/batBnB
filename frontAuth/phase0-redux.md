# Phase 0 Redux

**Language > Specialist**: Markdown > Documentation Specialist
**Includes**: Step-by-step instructions, code examples
**Requirements**: VERBOSITY=3, clear and easy-to-follow steps, code examples for junior developers
## Plan
- Convert the provided instructions into a simplified, step-by-step format with code examples
- Ensure each step is clearly explained for ease of execution by a junior developer

---

### README - Frontend Setup Guide

#### **Phase 0: Choose Your Path**

- **Option 1**: Set up Redux from scratch (Method 1)
- **Option 2**: Use a Redux template for easier setup (Method 2)

To follow Method 2, search for "Method 2" within this document.

---

### **Method 1: Set Up Redux From Scratch**

1. **Initialize Project with React Vite Template**
   - Run this command inside your frontend folder to clone App Academy's React18 Vite template:
     ```bash
     npx tiged appacademy/aa-react18-vite-template .
     ```
   - Update `package.json` with your app's name:
     ```json
     "name": "authenticate-me"
     ```
   - Change the `<title>` in `index.html` to "Authenticate Me".

2. **Install Dependencies**
   - Run the following command to install necessary packages:
     ```bash
     npm install js-cookie react-redux react-router-dom redux redux-thunk
     npm install -D redux-logger
     ```

3. **Setting Up the Redux Store**
   - Create a `store` folder in `frontend/src` and add a `store.js` file.
   - Add the following imports to your `store.js`:
     ```javascript
     import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
     import thunk from 'redux-thunk';
     ```
   - Create a `rootReducer`:
     ```javascript
     const rootReducer = combineReducers({});
     ```
   - Set up store enhancers for different environments:
     ```javascript
     let enhancer;
     if (import.meta.env.MODE === 'production') {
       enhancer = applyMiddleware(thunk);
     } else {
       const logger = (await import("redux-logger")).default;
       const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
       enhancer = composeEnhancers(applyMiddleware(thunk, logger));
     }
     ```
   - Define and export a `configureStore` function:
     ```javascript
     const configureStore = (preloadedState) => {
       return createStore(rootReducer, preloadedState, enhancer);
     };
     export default configureStore;
     ```

4. **Redux Provider Setup in `main.jsx`**
   - Import `Provider` and your `configureStore` function in `main.jsx`:
     ```javascript
     import { Provider } from 'react-redux';
     import configureStore from './store/store';
     ```
   - Create a store instance and conditionally expose it for development:
     ```javascript
     const store = configureStore();
     if (process.env.NODE_ENV !== 'production') {
       window.store = store;
     }
     ```
   - Wrap your `<App />` component with `Provider`, passing the store:
     ```javascript
     ReactDOM.createRoot(document.getElementById('root')).render(
       <React.StrictMode>
         <Provider store={store}>
           <App />
         </Provider>
       </React.StrictMode>
     );
     ```

Congratulations, you have completed Method 1!

---

### **Method 2: Use the Redux Template**

1. **Clone the React 18 Redux Vite Template**
   - Use this command to clone the template:
     ```bash
     npx tiged appacademy/aa-react18-redux-vite-template .
     ```
   - Update `package.json` and `index.html` as described in Method 1.
   - Install `js-cookie`:
     ```bash
     npm install js-cookie
     ```

---

### **Testing the Redux Store Setup**
- Start your frontend server with `npm run dev` and navigate to `http://localhost:5173`.
- Use Redux DevTools to confirm the store is connected and dispatch a test action:
  ```javascript
  store.dispatch({ type: 'hello' });
  ```

---

### **Wrapping Fetch Requests with CSRF Protection**
- Update `frontend/vite.config.js` with a proxy for `/api` routes.
- Use the custom `csrfFetch` function for requests requiring CSRF tokens.
- Restore CSRF tokens in development with a call to `/api/csrf/restore` on app load.

---

This guide should help you through the setup process. If you encounter any issues, review the instructions, and make sure each step has been followed accurately. Happy coding!

---

**History**: Provided a simplified, step-by-step guide for setting up Redux in a React application, including environment-specific configurations and CSRF protection.

**Next Task**: Start developing React components and connecting them to the Redux store.
