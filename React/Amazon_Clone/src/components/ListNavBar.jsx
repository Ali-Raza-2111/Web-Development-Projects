import React from 'react'
import './ListNavBar.css'
function ListNavBar() {
  return (
    <div className="nav-list-bar">
        <ul className='nav-list'>
            <li><i class="fa-solid fa-bars"></i>All</li>
            <li>Today's Deal</li>
            <li>Prime Video</li>
            <li>Register</li>
            <li>Customer Service</li>
            <li>Gift Cards</li>
            <li>Sell</li>
        </ul>
    </div>
    
  )
}

export default ListNavBar