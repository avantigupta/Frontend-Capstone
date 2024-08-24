
import React from "react";
import "../Styles/Header.css";
import profile from "../Icons/profile.png"
import logo from "../Assets/online-library.png";
function Header({ title }) {
  return (
    <div className="header-wrapper">
      <div className="logo-div">
      <img src={logo} alt="logo" className="logo-img"/>
<span className="logo-name">BookNest</span>
      </div>
      
      <h1 className="header-title">{title}</h1>
      <div className="header-right-section">
        <input type="text" className="header-search-bar" placeholder="Search books, categories..." />
        <div className="header-profile-section">
          <img
            src={profile}
            alt="Profile"
            className="header-profile-img"
          />

          <span className="header-profile-name">Admin</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
