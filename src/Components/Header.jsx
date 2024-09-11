import React from "react";
import "../styles/header.css";
import profile from "../assets/icons/profile.png";
import logo from "../assets/online-library.png";
import { useEffect, useState } from "react";

function Header({ title }) {
  const [role, setRole] = useState(""); 

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); 
    if (storedRole) {
      setRole(storedRole); 
    }
  }, []);
  return (
    <div className="header-wrapper">
      <div className="logo-div">
        <img src={logo} alt="logo" className="logo-img" />
        <span className="logo-name">BookNest</span>
      </div>

      <h1 className="header-title">{title}</h1>
      <div className="header-right-section">
        <div className="header-profile-section">
          <img src={profile} alt="Profile" className="header-profile-img" />

          <span className="header-profile-name">Hi {role}</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
