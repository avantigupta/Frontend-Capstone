import React from 'react'
import "../styles/button.css"
const Button=({children, type='button', onClick, className, disabled}) => {

  return (
    <button
    type={type}
    onClick={onClick}
    className={`custom-button ${className}`}
    disabled={disabled}
  >
    {children}
    </button>
  );
};

export default Button
