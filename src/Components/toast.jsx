import React, { useState, useEffect } from 'react';
import "../styles/toast.css"
const Toast = ({ message, onClose, type='success' }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
    }, 5000); 

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`toast ${type}`} style={{ display: show ? 'block' : 'none' }}>

      <p>{message}</p>
    </div>
  );
};

export default Toast;