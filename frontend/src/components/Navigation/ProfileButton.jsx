import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import './Navigation.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef(); // create a Ref for the dropdown

  const toggleMenu = (e) => {
    e.stopPropagation(); // stop bubble up hide dropdown
     if (!showMenu) setShowMenu(true);
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout =(e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

    
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
  <>
    <button onClick={toggleMenu}>
      <i className="fa-regular fa-user" />
    </button>
    <ul className={ulClassName} ref={ulRef}>
      <li>{user.username}</li>
      <li>{user.firstName} {user.lastName}</li>
      <li>{user.email}</li>
      <li>
        <button onClick={logout}>Logout</button>
      </li>
    </ul>
  </>
  );
}

export default ProfileButton;
