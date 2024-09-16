import React from 'react';
import '../styles/sideNav.css'; 
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import dashboardIcon from "../assets/icons/dashboard.png";
import booksIcon from "../assets/icons/book.png";
import issuancesIcon from "../assets/icons/library.png";
import usersIcon from "../assets/icons/user.png";
import categoryIcon from "../assets/icons/menu.png";
import Button from './button';
import Modal from './modal';

function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    setIsModalOpen(true); 
  };
  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
    setIsModalOpen(false);
  };

  const cancelLogout = () => {
    setIsModalOpen(false);
  };
  return (
    <>
    <nav className="sidenav">
      <ul>
        <li>
          <Link 
            to="/dashboard" 
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            <img src={dashboardIcon} alt="Dashboard" className="icon" />
           <span>Dashboard  </span>       
          </Link>
        </li>
        <li>
          <Link 
            to="/categories" 
            className={location.pathname === "/categories" ? "active" : ""}
          >
            <img src={categoryIcon} alt="Categories" className="icon" />
           <span>Category</span>  
          </Link>
        </li>
        <li>
          <Link 
            to="/books" 
            className={location.pathname === "/books" ? "active" : ""}
          >
            <img src={booksIcon} alt="Books" className="icon" />
          <span>Books</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/users" 
            className={location.pathname === "/users" ? "active" : ""}
          >
            <img src={usersIcon} alt="Users" className="icon" />
            <span>Users</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/issuances" 
            className={location.pathname === "/issuances" ? "active" : ""}
          >
            <img src={issuancesIcon} alt="Issuances" className="icon" />
           <span> Issuances</span>
          </Link>
        </li>
       
      </ul>
      <Button className='logout' onClick={handleLogout}>Logout</Button>
    </nav>
    <Modal
    isOpen={isModalOpen}
    onClose={cancelLogout}
    onSubmit={confirmLogout}
    logoutConfirm
    logoutMessage="Are you sure you want to log out?"
  />
  </>
  );
}

export default SideNav;
