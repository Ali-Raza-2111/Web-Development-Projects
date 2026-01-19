import logo from "../assets/Amazon Navbar Logo.png";
import "./NavBar.css";
import flag from '../assets/American Flag icon.png';
function NavBar() {
  return (
    <div className="Nav-Bar">
      <div className="nav-bar-logo">
        <img src={logo} alt="Amazon logo" />
      </div>
      <div className="nav-location">
        <div className="location-icon">
          <i className="fa-solid fa-location-dot"></i>
          <div className="location-text">
            <p>Deliver to </p>
            <span>Pakistan</span>
          </div>
        </div>
      </div>

      <div className="nav-search-bar">
        <select name="search" id="">
          <option>All</option>
          <option>Arts and Crafts</option>
          <option>Automotive</option>
          <option>Books</option>
          <option>Computers</option>
          <option>Electronics</option>
          <option>Health and Household</option>
          <option>Home and Kitchen</option>
          <option>Industrial and Scientific</option>
          <option>Kindle Store</option>
          <option>Mobile Phones</option>
        </select>
        <input type="text" className="nav-search" placeholder="Search Amazon"/>
        <button className="nav-search-btn">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      <div className="nav-language">
        <img src={flag} alt="flag" />
        <p>EN</p></div>

      <div className="nav-sign-in border-line">
        <p>Hello,Sign in </p>
        <p style={{ fontWeight: "bold" }}>Accounts & Lists</p>
      </div>
      <div className="nav-return-orders border-line">Returns & Orders</div>
      <div className="nav-cart border-line">
        <i class="fa-solid fa-cart-shopping "></i>
        <p>Cart</p>
      </div>
    </div>
  );
}

export default NavBar;
