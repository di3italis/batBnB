Phase 2 Redux

**Language > Specialist**: JavaScript, React, Redux > Frontend Web Development Specialist
**Includes**: React, Redux, JavaScript, AJAX, CSS
**Requirements**: Simple explanation with step-by-step instructions and code examples for a junior developer to easily understand and execute.
## Plan
1. Break down the original text into clear, actionable steps.
2. Provide simplified instructions with code examples for each step.
3. Cover both the Redux logic for signup and the React component for the signup form.

---

### ✅ Step 1: Create Signup Thunk Action
- **Purpose**: To communicate with the backend for user signup.
- **Location**: `frontend/src/store/session.js`
- **Task**: Add a thunk action that sends a `POST` request to `/api/users` with user details and updates the Redux state with the user data received from the backend.

#### Code Example:
```js
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};
```

### ✅ Step 2: Test Signup Action
- **Goal**: Ensure the signup action works correctly.
- **Method**: Use the browser's DevTools console.
- **Process**:
  1. Navigate to your application (usually `http://localhost:5173`).
  2. Clear any existing `token` cookies and refresh the page.
  3. Dispatch the signup action with test credentials.

#### Testing Code:
```js
store.dispatch(
  sessionActions.signup({
    username: "NewUser",
    firstName: "New",
    lastName: "User",
    email: "new@user.io",
    password: "password",
  })
);
```

### ✅ Step 3: Build `SignupFormPage` Component
- **Purpose**: To create a user interface for the signup process.
- **Location**: `frontend/src/components/SignupFormPage/SignupFormPage.jsx`
- **Task**: Implement a form with controlled inputs for user details, including validation for the `confirmPassword` field.

#### Component Structure:
```jsx
function SignupFormPage() {
  // useState hooks for form fields and errors
  // Form submission logic
  // Form JSX with controlled components
}

export default SignupFormPage;
```

### ✅ Step 4: Route and Test `SignupFormPage`
- **Goal**: Integrate the `SignupFormPage` into your app and ensure it functions correctly.
- **Method**: Use React Router for routing.
- **Process**:
  1. Add the `SignupFormPage` to your `App.jsx` with the `/signup` route.
  2. Test the form by navigating to `/signup` and attempting to sign up with various inputs.

#### Example Route Setup:
```jsx
{
  path: "/signup",
  element: <SignupFormPage />
}
```

### Step 5: Style Your Form
- **Purpose**: Improve the visual presentation of your signup form.
- **Location**: `frontend/src/components/SignupFormPage/SignupForm.css`
- **Task**: Create CSS rules for your form and import them into your component.

#### CSS Import:
```js
import './SignupForm.css';
```

### Commit Your Code!
- After completing each step, ensure your code is working as expected, then commit your changes to your version control system.

---

**History**: Outlined the process for creating a signup feature, including Redux actions, React components, and basic styling.

**Source Tree**:
- (💾=saved: link to file) `frontend/src/store/session.js`
  - ✅ `signup` thunk action
- (💾=saved: link to file) `frontend/src/components/SignupFormPage/SignupFormPage.jsx`
  - ✅ `SignupFormPage` component
- (💾=saved: link to file) `frontend/src/components/SignupFormPage/SignupForm.css`
  - ✅ CSS for `SignupFormPage`

**Next Task**: FINISHED - Consider implementing additional features like form validation, error handling improvements, and enhancing the user interface design for better user experience.
