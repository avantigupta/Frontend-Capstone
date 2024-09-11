import React from 'react';
import '../styles/SideNav.css'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import dashboardIcon from "../Assets/Icons/dashboard.png";
import booksIcon from "../Assets/Icons/book.png";
import issuancesIcon from "../Assets/Icons/library.png";
import usersIcon from "../Assets/Icons/user.png";
import categoryIcon from "../Assets/Icons/menu.png";
import Button from './Button';


function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
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
            Category       
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
