import React from 'react';
import './navbar.css';


const NavBar = () => {
return (
<header className="pro-navbar">
<div className="pro-logo">
<img src="/logo192.png" alt="logo" className="logo-img" />
<span className="logo-text">InsightFlow</span>
</div>


<nav className="pro-menu">
<a href="#home" className="pro-link">Home</a>
<a href="#reviews" className="pro-link">Reviews</a>
<a href="#submit" className="pro-link">Submit</a>
<a href="#about" className="pro-link">About</a>
</nav>


<div className="pro-actions">
<button className="pro-btn">Login</button>
</div>
</header>
);
};


export default NavBar;