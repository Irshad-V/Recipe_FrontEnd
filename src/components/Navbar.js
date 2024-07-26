import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useCookies } from 'react-cookie';
import handleUserID from '../components/User';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cookie, , removeCookie] = useCookies(['jwtToken']);
  const navigate = useNavigate()
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const username = window.localStorage.getItem("username")
  const useremail = window.localStorage.getItem("useremail")
  const userId = handleUserID();
  const adminNameAPi = process.env.REACT_APP_ADMIN_NAME;
  const adminKey = process.env.REACT_APP_ADMIN_KEY;
  const AdminId = process.env.REACT_APP_ADMIN_ID
  const Logout = () => {
    removeCookie('jwtToken'); 
    window.localStorage.clear()
    navigate("/auth")

  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Recipe</Link>
        {username ? <h3> {username} </h3> : ""}
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
      </div>
      <ul className={isOpen ? 'navbar-links active' : 'navbar-links'}>
        <li>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        </li>
        {username === adminNameAPi && useremail === adminKey && AdminId === userId && (
          <li>
            <Link to="/Admin" onClick={() => setIsOpen(false)}>Admin</Link>
          </li>
        )} 
        <li>
          <Link to="/createrecipe" onClick={() => setIsOpen(false)}>Create Recipe</Link>
        </li>
        <li>
          <Link to="/savedrecipes" onClick={() => setIsOpen(false)}>Saved Recipes</Link>
        </li>
        <li>
          {cookie.jwtToken && <Link to="/RecipeTable" onClick={() => setIsOpen(false)}>RecipeTable</Link>}
        </li>
        <li>
          {
            !cookie.jwtToken ?
              <Link to="/auth" onClick={() => setIsOpen(false)}>Login</Link>
              :
              <button className="logout-button" onClick={Logout}>Logout</button>

          }

        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
