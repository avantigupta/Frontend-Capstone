// // import React, { useState, useEffect } from 'react';
// // import "../Styles/Login.css";
// // import HeroSection from "../Assets/HeroSection.png";
// // import Button from '../Components/Button';
// // import { useNavigate } from 'react-router-dom';
// // import { useDispatch } from 'react-redux';
// // import { loginUser } from '../redux/auth/authActions';

// // function Login() {
// //   const [role, setRole] = useState("admin");
// //   const [placeholderText, setPlaceholderText] = useState("Email");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();

// //   useEffect(() => {
// //     if (role === "admin") {
// //       setPlaceholderText("Email");
// //     } else if (role === "user") {
// //       setPlaceholderText("Mobile Number");
// //     }
// //   }, [role]);

// //   const handleRoleChange = (event) => {
// //     setRole(event.target.value);
// //   };

// //   const handleLogin = (event) => {
// //     event.preventDefault();

// //     dispatch(loginUser(email, password, role)).then(() => {
// //       navigate("/dashboard");
// //     }).catch((error) => {
// //       console.error("Login failed:", error);
// //     });
// //   };

// //   return (
// //     <div className="container">
// //       <div className="login-container">
// //         <div className="login-content">
// //           <form onSubmit={handleLogin}>
// //             <div className='radio-group'>
// //               <label>
// //                 <input 
// //                   type="radio" 
// //                   name="userType" 
// //                   value="admin" 
// //                   className="radio-input" 
// //                   checked={role === "admin"}
// //                   onChange={handleRoleChange}
// //                 />
// //                 Admin
// //               </label>
// //               <label>
// //                 <input 
// //                   type="radio" 
// //                   name="userType" 
// //                   value="user" 
// //                   className="radio-input" 
// //                   checked={role === "user"}
// //                   onChange={handleRoleChange}
// //                 />
// //                 User
// //               </label>
// //             </div>
// //             <input 
// //               type="text" 
// //               placeholder={placeholderText} 
// //               className='login-input'
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //             />
// //             <input 
// //               type="password" 
// //               placeholder="Password" 
// //               className='login-input' 
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //             />
// //             <div><Button type="submit" className='login'>Login</Button></div>
// //           </form>
// //         </div>
// //         <div className='login-img'>
// //           <img src={HeroSection} alt='img' />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Login;

// import React, { useState, useEffect } from 'react';
// import "../Styles/Login.css";
// import HeroSection from "../Assets/HeroSection.png";
// import Button from '../Components/Button';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginUser } from '../redux/auth/authActions';

// function Login() {
//   const [role, setRole] = useState("admin");
//   const [placeholderText, setPlaceholderText] = useState("Email");
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     setPlaceholderText(role === "admin" ? "Email" : "Mobile Number");
//   }, [role]);

//   const handleRoleChange = (event) => {
//     setRole(event.target.value);
//   };

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     try {
//       await dispatch(loginUser(username,email, password, role));
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Login failed:", error);
//       // Additional error handling can be added here if needed
//     }
//   };

//   return (
//     <div className="container">
//       <div className="login-container">
//         <div className="login-content">
//           <form onSubmit={handleLogin}>
//             <div className='radio-group'>
//               <label>
//                 <input 
//                   type="radio" 
//                   name="userType" 
//                   value="admin" 
//                   className="radio-input" 
//                   checked={role === "admin"}
//                   onChange={handleRoleChange}
//                 />
//                 Admin
//               </label>
//               <label>
//                 <input 
//                   type="radio" 
//                   name="userType" 
//                   value="user" 
//                   className="radio-input" 
//                   checked={role === "user"}
//                   onChange={handleRoleChange}
//                 />
//                 User
//               </label>
//             </div>
//             <input 
//               type="text" 
//               placeholder={placeholderText} 
//               className='login-input'
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <input 
//               type="password" 
//               placeholder="Password" 
//               className='login-input' 
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <div><Button type="submit" className='login'>Login</Button></div>
//           </form>
//         </div>
//         <div className='login-img'>
//           <img src={HeroSection} alt='img' />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

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
  const [username, setUsername] = useState("");  // This will store either email or mobile number
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setPlaceholderText(role === "admin" ? "Email" : "Mobile Number");
  }, [role]);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };
  const credentials = {
    username: username,
    password,
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await dispatch(loginUser(credentials)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      // Additional error handling can be added here if needed
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
  );
}

export default Login;
