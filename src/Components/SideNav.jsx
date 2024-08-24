import React from 'react';
import '../Styles/SideNav.css'; 
import { Link, useLocation } from 'react-router-dom';
import dashboardIcon from "../Icons/dashboard.png";
import BooksIcon from "../Icons/book.png";
import issuancesIcon from "../Icons/library.png";
import usersIcon from "../Icons/user.png"
import categoryIcon from "../Icons/menu.png"
function SideNav() {
  const location = useLocation();

  return (
    <nav className="sidenav">
      <ul>
        <li>
          <Link 
            to="/dashboard" 
            className={location.pathname === "/dashboard" ? "active" : ""}
          ><img src={dashboardIcon} alt="Home" className="icon" />
            Dashboard        
          </Link>
        </li>
        <li>
          <Link 
            to="/categories" 
            className={location.pathname === "/categories" ? "active" : ""}
          ><img src={categoryIcon} alt="Home" className="icon" />
           Categories       
          </Link>
        </li>
        <li>
          <Link 
            to="/books" 
            className={location.pathname === "/books" ? "active" : ""}
          ><img src={BooksIcon} alt='books' className='icon' />
            Books
          </Link>
        </li>
        <li>
          <Link 
            to="/issuances" 
            className={location.pathname === "/issuances" ? "active" : ""}
          >
            <img src={issuancesIcon} alt='issuances' className='icon' />
            Issuances
          </Link>
        </li>
        <li>
          <Link 
            to="/users" 
            className={location.pathname === "/users" ? "active" : ""}
          >
            <img src={usersIcon} alt='users' className='icon' />
            Users
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default SideNav;
