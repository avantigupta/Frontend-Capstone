// import React, { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const token = useSelector((state) => state.auth.token);
//   useEffect(() => {
//     console.log("Token in ProtectedRoute:", token); // Log the token for debugging
//   }, [token]);

//   if (!token) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
