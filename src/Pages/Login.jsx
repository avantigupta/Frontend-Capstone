import React, { useState, useEffect } from 'react';
import "../styles/login.css";
import hero_section from "../assets/HeroSection.png";
import Button from '../components/button';
import { useNavigate } from 'react-router-dom';
import { validateForm } from '../utils/formValidation';
import Toast from "../components/toast";
import {fetch_post} from '../api/apiManager'
import Loader from '../components/loader';
import { SIGNUP } from '../utils/constants';

function Login() {
  const [role, setRole] = useState("admin");
  const [placeholderText, setPlaceholderText] = useState("Email");
  const [username, setUsername] = useState("");  
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); 
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    setPlaceholderText(role === "admin" ? "Email" : "Mobile Number");
    setUsername("");
    setPassword("");
    setErrors({});
  }, [role]);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type); 
    setIsToastVisible(true);
  };

  useEffect(() => {
    if (isToastVisible) {
      const timer = setTimeout(() => {
        setIsToastVisible(false);
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isToastVisible]);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
  };

  const validateAndSetErrors = () => {
    const formData = {
      username,
      password,
      role,
    };
  
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage(""); 
  
   if (!validateAndSetErrors()) return;
   setLoading(true);
   const encryptedPassword = btoa(password);
   const credentials = {
      usernameOrPhoneNumber: username,
      password: encryptedPassword,
    };
  
    try {
      const response = await fetch_post(`${SIGNUP}`, credentials);
  
      if (response && response.data) {
        localStorage.setItem("token", response.data.jwtToken);
        localStorage.setItem("role", role); 
        localStorage.setItem('id',response.data.userId)
        localStorage.setItem('username',response.data.name)
        
        if(role==='admin'){
        navigate('/dashboard')
        showToast("Logged in successfully!", 'success');

        }
      else{

      navigate('/userPage')
      showToast("Logged in successfully!", 'success');

      }
      } else {
        showToast("Failed to login, Please try again later!", 'error');
      }
    } catch (error) {
      setErrorMessage("Bad credentials")
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="container">
      <div className="login-container">
      {loading && <Loader />}
        <div className="login-content">
          {isToastVisible && (
            <Toast
              message={toastMessage}
              type={toastType}
              onClose={() => setIsToastVisible(false)}
            />
          )}
          
        
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
              type={role === "admin" ? "text" : "number"} 
              placeholder={placeholderText} 
              className={`login-input ${errors.username ? 'input-error' : ''}`}
              value={username}
              onChange={handleUsernameChange}
            />
            
            {errors.username && <div className="error-msg">{errors.username}</div>}

            <input 
              type="password" 
              placeholder="Password" 
              className={`login-input ${errors.password ? 'input-error' : ''}`} 
              value={password}
              onChange={handlePasswordChange}
            />
            <br />
            {errors.password && <span className="error-msg">{errors.password}</span>}
            
            <div className='login-btn'>
              <Button type="submit" className='login'>Login</Button>
            </div>

            {errorMessage && <div className="error-msg">{errorMessage}</div>}
          </form>
        </div>
        <div className='login-img'>
          <img src={hero_section} alt='img' />
        </div>
      </div>
    </div>
  );
}

export default Login;
