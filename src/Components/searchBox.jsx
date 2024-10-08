import React, { useState } from 'react';
import SearchIcon from "../assets/icons/search.png"
import '../styles/searchBar.css'; 

const SearchBar = ({ placeholder, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={placeholder}
        />
        <img src={SearchIcon} alt='search' className='search-icon' width="70%"/>
        
      </div>
  );
};

export default SearchBar;
