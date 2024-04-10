**Language > Specialist**: JavaScript > Redux & React Specialist
**Includes**: Redux for state management, React for UI components, async/await for asynchronous API calls
**Requirements**: Aimed at junior developers, the instructions will be detailed with code examples in a step-by-step outline. Emphasis on clarity, simplicity, and directness.

## Plan
1. Outline steps to create the Redux store with session actions and reducer.
2. Provide code snippets for each step.
3. Detail how to test the session actions and reducer.
4. Guide through creating the `LoginFormPage` component with example code.
5. Explain how to test the component.
6. Describe steps to restore session user on refresh and test it.

---

### Phase 1: Login Form Page

#### 1. Setup Redux Actions and Reducer for Session Management

+ ✅ **Create File**: In your project's `frontend/src/store` folder, create a file named `session.js`. This will hold session-specific actions and the session reducer.
+ ✅ **Session Reducer**: Implement a `session` reducer function to handle updating and removing the session user's information. Initialize the state with `user: null` to indicate no user is logged in by default.
+ ✅**Action Creators**: Define two Plain Old JavaScript Object (POJO) action creators, `setUser` and `removeUser`, to manage user session state. Also, define constants for action types to avoid typos.
+ ✅ **Thunk Action for Login**: Write a thunk action named `login` that makes a `POST` request to `/api/session` to log in a user. Utilize `csrfFetch` for CSRF protection. Dispatch `setUser` with the user data on successful login.
+ ✅ **Export**: Export the `login` thunk action and the session reducer as the default export from the file.

#### 2. Update Root Reducer

- ✅ **Import Session Reducer**: In `frontend/src/store/store.js`, import the session reducer you just created.
- ✅**Combine Reducers**: Add the session reducer to the `combineReducers` call under the key `session`.

#### 3. Testing Session Actions and Reducer

- ✅ **Frontend Entry File**: In `frontend/src/main.jsx`, import and attach your session actions to the `window` object as `sessionActions`. This allows for easy testing via the browser's DevTools console.
- ✅ **Login Test**: Using the DevTools console, dispatch the `login` action with test credentials. Verify the state updates correctly to reflect the logged-in user.

  ``` js
  // dispatch login action
  window.store.dispatch(window.sessionActions.login({ credential: 'testuser', password: 'password' }))

  // verify state update
  console.log(window.store.getState());
  ```

#### 4. Creating `LoginFormPage` Component

- ✅ **Component Folder**: In `frontend/src/components`, create a `LoginFormPage` folder and add a `LoginFormPage.jsx` file.
- ✅ **React Component**: Define a `LoginFormPage` functional component. Render a form with controlled inputs for username/email and password. Dispatch the `login` thunk on form submission.
- ✅ **Error Handling**: Display any login errors returned by the thunk action.
- ✅**Route Integration**: Render `LoginFormPage` at the `/login` route in `App.js`. Use React Router for routing.
- ✅ **Redirection**: Redirect to the home page if a user is already logged in.

#### 5. Styling `LoginFormPage`

- ✅ **CSS File**: Add a `LoginForm.css` file in the `LoginFormPage` folder for styling. Import this CSS file in `LoginFormPage.jsx`.
- 🚨 **Styling**: Apply CSS to improve the appearance of your login form.

#### 6. Restore Session User on Refresh

- ✅ **Thunk Action**: Add a `restoreUser` thunk action in `session.js` that fetches the current user session from `GET /api/session` and updates the Redux store.
- ✅**Application Initialization**: Use the `restoreUser` action in `App.jsx` to check for an existing session when the app loads.
- **Testing**: After logging in, refresh the page and verify the user session persists.

### Example Code

- ✅**Redux Session Actions and Reducer**:
  ```javascript
  // frontend/src/store/session.js
  import { csrfFetch } from './csrf';

  const SET_USER = "session/setUser";
  const REMOVE_USER = "session/removeUser";

  export const setUser = (user) => ({
    type: SET_USER,
    payload: user
  });

  export const removeUser = () => ({
    type: REMOVE_USER
  });

  // Thunk action example
  export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({ credential, password })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
  };

  const initialState = { user: null };

  const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_USER:
        return { ...state, user: action.payload };
      case REMOVE_USER:
        return { ...state, user: null };
      default:
        return state;
    }
  };

  export default sessionReducer;
  ```

- ✅ **`LoginFormPage` Component**:
  ```jsx
  // frontend/src/components/LoginFormPage/LoginFormPage.jsx
  import { useState } from 'react';
  import * as sessionActions from '../../store/session';
  import { useDispatch, useSelector } from 'react-redux';
  import { Navigate } from 'react-router-dom';

  function LoginFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
  
    if (sessionUser) return <Navigate to="/" />;
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors({});
      dispatch(sessionActions.login({ credential, password }))
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) setErrors(data.errors);
        });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        {/* Form fields and submit button */}
      </form>
    );
  }

  export default LoginFormPage;
  ```

Follow these steps, adapting the code examples to fit your project's specific setup and naming conventions.
