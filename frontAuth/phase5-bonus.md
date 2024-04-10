### Simplified Guide: Adding Login and Signup to Dropdown Menu

**Objective:** Integrate login and signup modal triggers into the profile dropdown menu in a React/Redux application.

#### Update Navigation Component
- **Location:** `frontend/src/components/Navigation/Navigation.jsx`.
- **Changes:** Modify the `Navigation` component to always render `ProfileButton`, removing any conditionals based on user session state. Remove the `OpenModalButton` as it will be moved to `ProfileButton`.

```jsx
// Navigation.jsx example
import { NavLink } from 'react-router-dom';
import ProfileButton from './ProfileButton';

function Navigation({ isLoaded }) {
  return (
    <ul>
      <li><NavLink to="/">Home</NavLink></li>
      {isLoaded && <li><ProfileButton /></li>}
    </ul>
  );
}
```

#### Modify ProfileButton Component
- **Location:** `frontend/src/components/Navigation/ProfileButton.jsx`.
- **Task:** Adjust `ProfileButton` to show a logout button for logged-in users and login/signup options for guests.

```jsx
// ProfileButton.jsx example
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const ulRef = useRef();

  const toggleMenu = () => setShowMenu(!showMenu);
  const logout = () => {
    dispatch(sessionActions.logout());
    setShowMenu(false);
  };

  return (
    <>
      <button onClick={toggleMenu}><i className="fas fa-user-circle" /></button>
      <ul className={showMenu ? "profile-dropdown" : "profile-dropdown hidden"} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            {/* User info and logout button */}
          </>
        ) : (
          <>
            <li><OpenModalButton buttonText="Log In" modalComponent={<LoginFormModal />} /></li>
            <li><OpenModalButton buttonText="Sign Up" modalComponent={<SignupFormModal />} /></li>
          </>
        )}
      </ul>
    </>
  );
}
```

#### Testing
- Ensure the dropdown adapts to user state: login/signup options for guests and user details with logout for signed-in users.
- Test modals by interacting with the new menu items.

#### Additional Enhancements
- **Close Dropdown:** Optionally, make the dropdown menu close upon clicking the logout, login, and signup options.
- **Refactor for Menu Items:** Consider creating a new `OpenModalMenuItem` component for a more menu-item-like appearance, replacing `OpenModalButton` in the dropdown.

**Remember:** Consistently commit your changes to track progress and ensure you can revert to previous versions if needed.
