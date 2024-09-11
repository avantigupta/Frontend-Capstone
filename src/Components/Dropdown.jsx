import React, { useState, useEffect, useRef } from 'react';
import '../styles/dropdown.css';

const Dropdown = ({ options, onSelect, buttonLabel, placeholder, imageSrc, useInput, triggerOnHover }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    if (!option.disabled) {
      onSelect(option);
      setIsOpen(false);
    }
  };
  const handleMouseEnter = () => {
    if (triggerOnHover) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (triggerOnHover) {
      setIsOpen(false);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setIsOpen(true); 
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {useInput ? (
        <input
          type="text"
          value={inputValue}
          onClick={handleToggle}
          onChange={handleInputChange}
          placeholder={placeholder || 'Select an option'}
          className="dropdown-input"
        />
      ) : (
        <img
          src={imageSrc}
          onClick={handleToggle}
          className="dropdown-image"
          style={{ cursor: 'pointer' }}
        /> 
       
      )}

      {isOpen && (
        <div className="dropdown-menu">
          {options
            .filter(option => option.label.toLowerCase().includes(inputValue.toLowerCase()))
            .map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`dropdown-item ${option.disabled ? 'disabled' : ''}`}
              >
                {option.label}
              </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;