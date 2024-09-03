import React, { useState } from 'react';
import '../Styles/dropdown.css';
import Button from './Button';

const Dropdown = ({ options, onSelect, buttonLabel  }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <Button onClick={handleToggle} className="dropdown-button">
        {buttonLabel}
      </Button>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleSelect(option)}
              className="dropdown-item"
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
