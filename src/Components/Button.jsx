import React from 'react'
import "../Styles/Button.css"
const Button=({children, type='button', onClick, className= ''}) => {

  return (
    <button
    type={type}
    onClick={onClick}
    className={`custom-button ${className}`}
    
  >
    {children}
    </button>
  );
};

export default Button
