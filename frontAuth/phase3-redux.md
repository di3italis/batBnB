# Phase 3 Redux

**Language > Specialist**: JavaScript > React/Redux Specialist
**Includes**: React, Redux, JavaScript ES6+, React Router, AJAX (using `fetch` or similar)
**Requirements**: VERBOSITY=2, aiming for simplicity with step-by-step instructions and code examples to guide junior developers through the process of implementing logout functionality, navigation, and a profile dropdown in a React/Redux application.

## Plan
1. Outline steps for creating a logout thunk action in the session store.
2. Provide a step-by-step guide for testing the logout thunk action.
3. Detail the process of setting up the `Navigation` component.
4. Explain how to use Font Awesome icons within the React application.
5. Describe the creation and functionality of the `ProfileButton` component.
6. Offer instructions for implementing CSS for the `Navigation` component and handling the dropdown menu's visibility.

---

### ✅ Logout Action Creation

1.  **File Location**: In your project's frontend directory, navigate to `src/store/session.js`.
2. **Adding the Logout Thunk**: Add a new thunk action named `logout`. This action will make an AJAX call to your backend logout endpoint (`DELETE /api/session`), and upon success, it will dispatch an action to remove the user from the session state.

   ```javascript
   // frontend/src/store/session.js
   
   export const logout = () => async (dispatch) => {
     const response = await fetch('/api/session', {
       method: 'DELETE',
     });
     if (response.ok) {
       dispatch(removeUser());
     }
   };
   ```

3. **Exporting the Action**: Make sure to export the `logout` thunk action.

### ✅ Testing the Logout Action

1. **Opening DevTools**: Open the browser's DevTools console.
2. **Dispatching the Logout Action**: In the console, dispatch the logout action using the store. Example:

   ```javascript
   store.dispatch(sessionActions.logout());
   ```

3. **Observing State Changes**: Check the console for the `previous state` and `next state` to ensure the user is removed from the session state.

### Setting Up the Navigation Component

1. **Creating Navigation Folder**: Inside `frontend/src/components`, create a folder named `Navigation`.
2. **Adding Component Files**: In the `Navigation` folder, create `Navigation.jsx` and optionally `index.js` for easier imports.
3. **Implementing the Component**: In `Navigation.jsx`, implement the `Navigation` function component. It should render navigation links (using `<NavLink>` from React Router) and conditionally show login/signup or logout/profile options based on the session state.

   ```jsx
   // frontend/src/components/Navigation/Navigation.jsx
   
   import React from 'react';
   import { NavLink } from 'react-router-dom';
   import ProfileButton from './ProfileButton'; // Import ProfileButton once created
   
   function Navigation() {
     // Logic to determine if a user is logged in
     // Render different links based on user session state
   
     return (
       <nav>
         <ul>
           <li><NavLink to="/">Home</NavLink></li>
           {/* Conditional rendering based on session state */}
         </ul>
       </nav>
     );
   }
   
   export default Navigation;
   ```

### Using Font Awesome

1. **Option 1**: Sign up for Font Awesome and create a new kit. Add the kit's script to your project's `index.html` head section.
2. **Option 2**: Without signing up, use a public version of Font Awesome by adding the following link to your `index.html`:

   ```html
   <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css">
   ```

### Creating the ProfileButton Component

1. **File Setup**: In the `Navigation` folder, create `ProfileButton.jsx`.
2. **Implementing the Component**: Write a `ProfileButton` functional component that renders the profile icon and a logout button. Use state to manage the visibility of a dropdown menu that appears upon clicking the profile icon.

   ```jsx
   // frontend/src/components/Navigation/ProfileButton.jsx
   
   import React, { useState } from 'react';
   import { useDispatch } from 'react-redux';
   import { logout } from '../../store/session'; // Adjust path as needed
   
   const ProfileButton = () => {
     const dispatch = useDispatch();
     const [showMenu, setShowMenu] = useState(false);
   
     const handleLogout = () => {
       dispatch(logout());
     };
   
     return (
       <div>
         <button onClick={() => setShowMenu(!showMenu)}>
           <i className="fas fa-user-circle"></i> {/* Profile Icon */}
         </button>
         {showMenu && (
           <ul>
             {/* Dropdown menu items */}
             <li><button onClick={handleLogout}>Logout</button></li>
           </ul>
         )}
       </div>
     );
   };
   
   export default ProfileButton;
   ```

### Navigation CSS and Dropdown Menu

1. **CSS File**: In the `Navigation` folder, create `Navigation.css`.
2. **Importing CSS**: Import this CSS file in `Navigation.jsx` to apply styles.

   ```javascript
   // At the top of your Navigation.jsx file
   import './Navigation.css';
   ```

3. **Dropdown Logic**: Use state in `ProfileButton` to manage the dropdown's visibility. Utilize event listeners for clicks outside the dropdown to close it.

4. **Implementing the Dropdown Menu**: Enhance the `ProfileButton` component to include a dropdown menu that toggles visibility based on user interaction. Use `ref` to detect clicks outside the component for closing the menu.

---

**History**: Instructions for implementing logout functionality, navigation, and profile dropdown in a React/Redux application have been provided, with step-by-step guidance and code examples suitable for junior developers.

**Source Tree**:
- (💾=saved) `frontend/src/store/session.js`
  - ✅ `logout` (thunk action)
- (💾=saved) `frontend/src/components/Navigation/Navigation.jsx`
  - ✅ `Navigation` (component)
- (💾=saved) `frontend/src/components/Navigation/ProfileButton.jsx`
  - ✅ `ProfileButton` (component)
- (💾=saved) `frontend/src/components/Navigation/Navigation.css`
  - 🔴 CSS styling for `Navigation`

**Next Task**: FINISHED - Enhance the application by refining the UI/UX of the navigation bar, improving accessibility, and considering performance optimizations for state management and component rendering.
