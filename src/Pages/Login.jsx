

import React, { useState, useEffect } from 'react';
import "../Styles/Login.css";
import HeroSection from "../Assets/HeroSection.png";
import Button from '../Components/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/auth/authActions';

function Login() {
  const [role, setRole] = useState("admin");
  const [placeholderText, setPlaceholderText] = useState("Email");
  const [username, setUsername] = useState("");  
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setPlaceholderText(role === "admin" ? "Email" : "Mobile Number");
  }, [role]);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!username) {
      newErrors.username = "This field is required";
    }
    if (!password) {
      newErrors.password = "Field is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage(""); 

    if (!validateForm()) return;

    const credentials = {
      usernameOrPhoneNumber: username,
      password,
    };

    try {
      const data = await dispatch(loginUser(credentials)).unwrap();
      localStorage.setItem("token", data["jwtToken"]);
      navigate("/dashboard");
    } catch (error) {
      if (error.Message === 'Bad credentials') {
        setErrorMessage("Password and Username do not match");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
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
              className={`login-input ${errors.username && 'input-error'}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <span className="error-msg">{errors.username}</span>}

            <input 
              type="password" 
              placeholder="Password" 
              className={`login-input ${errors.password && 'input-error'}`} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}

            <div><Button type="submit" className='login'>Login</Button></div>

      
            {errorMessage && <span className="error-msg">{errorMessage}</span>}
          </form>
        </div>
        <div className='login-img'>
          <img src={HeroSection} alt='img' />
        </div>
      </div>
    </div>
  );
}

export default Login;
