import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Navigation from '../Navigation';
import './Header.css';

export default function Header() {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <header className="header">
      <div className="logo">
        <img src="/datum300.png" alt="datum" id="logo" />
        <NavLink to="/">Home yo</NavLink>
      </div>
      <Navigation  />
    </header>
  );
}

