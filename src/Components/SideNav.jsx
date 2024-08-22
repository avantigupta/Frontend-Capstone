import React from 'react';
import '../Styles/SideNav.css'; 
import { Link } from 'react-router-dom';

function SideNav() {
  return (
    <nav className="side-nav">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/books">Books</Link></li>
        <li><Link to="/issuances">Issuances</Link></li>
        <li><Link to="/users">Users</Link></li>
      </ul>
    </nav>
  );
}

export default SideNav;
