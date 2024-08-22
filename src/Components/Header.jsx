import React from 'react'
import "../Styles/Header.css"
function Header() {
  return (
<nav className='header'>
<a href='/' className='logo'>Logo</a>
<p>Hello Admin!</p>
<input placeholder='Search books, categories ' className='search-input' />
<img src='/' alt='profile' />
</nav>

  )
}

export default Header
