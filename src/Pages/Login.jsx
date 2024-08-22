import React, { useState, useEffect } from 'react';
import "../Styles/Login.css";
import HeroSection from "../Assets/HeroSection.png";
import Button from '../Components/Button';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [role, setRole] = useState("admin");
  const [placeholderText, setPlaceholderText] = useState("Email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Update placeholder based on role
    if (role === "admin") {
      setPlaceholderText("Email");
    } else if (role === "user") {
      setPlaceholderText("Mobile Number");
    }
  }, [role]);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    // Hardcoded credentials for admin
    const adminEmail = "admin@example.com";
    const adminPassword = "admin123";

    if (role === "admin" && email === adminEmail && password === adminPassword) {
      // Navigate to dashboard on successful login
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="login-content">
          <form onSubmit={handleLogin}>
            <div className='radio-group'>
              <label>
                <input 
                  type="radio" 
                  name="userType" 
                  value="admin" 
                  className="radio-input" 
                  checked={role === "admin"}
                  onChange={handleRoleChange}
                />
                Admin
              </label>
              <label>
                <input 
                  type="radio" 
                  name="userType" 
                  value="user" 
                  className="radio-input" 
                  checked={role === "user"}
                  onChange={handleRoleChange}
                />
                User
              </label>
            </div>
            <input 
              type="text" 
              placeholder={placeholderText} 
              className='login-input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className='login-input' 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div><Button type="submit" className='login'>Login</Button></div>
          </form>
        </div>
        <div className='login-img'>
          <img src={HeroSection} alt='img' />
        </div>
      </div>
    </div>
  )
}

export default Login;
