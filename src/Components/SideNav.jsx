import React from 'react';
import '../Styles/SideNav.css'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/auth/authActions'; 
import dashboardIcon from "../Icons/dashboard.png";
import booksIcon from "../Icons/book.png";
import issuancesIcon from "../Icons/library.png";
import usersIcon from "../Icons/user.png";
import categoryIcon from "../Icons/menu.png";
import Button from './Button';

function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
  localStorage.removeItem("token")
  navigate("/")
  };

  return (
    <nav className="sidenav">
      <ul>
        <li>
          <Link 
            to="/dashboard" 
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            <img src={dashboardIcon} alt="Dashboard" className="icon" />
            Dashboard        
          </Link>
        </li>
        <li>
          <Link 
            to="/categories" 
            className={location.pathname === "/categories" ? "active" : ""}
          >
            <img src={categoryIcon} alt="Categories" className="icon" />
            Categories       
          </Link>
        </li>
        <li>
          <Link 
            to="/books" 
            className={location.pathname === "/books" ? "active" : ""}
          >
            <img src={booksIcon} alt="Books" className="icon" />
            Books
          </Link>
        </li>
        <li>
          <Link 
            to="/issuances" 
            className={location.pathname === "/issuances" ? "active" : ""}
          >
            <img src={issuancesIcon} alt="Issuances" className="icon" />
            Issuances
          </Link>
        </li>
        <li>
          <Link 
            to="/users" 
            className={location.pathname === "/users" ? "active" : ""}
          >
            <img src={usersIcon} alt="Users" className="icon" />
            Users
          </Link>
        </li>
      </ul>
      <Button className='logout' onClick={handleLogout}>Logout</Button>
    </nav>
  );
}

export default SideNav;
