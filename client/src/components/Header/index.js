import React from "react";
import LoginPage from "../../pages/loginpage/login";

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo */}
        <a href="/" className="logo">
          <span className="logo-icon">✚</span>
          <span>ArogyaAI</span>
        </a>

        {/* Navigation */}
        <nav className="nav">
          <a href="#Home">Home</a>
          <a href="#About">About</a>
          <a href="#ContectUs">Contact Us</a>
        </nav>

        {/* Actions */}
        <div className="header-actions">

          <a href="./pages/loginpage/login.js" className="cta-btn">
            SignUp
          </a>
          <a href="./pages/loginpage/login.js" className="cta-btn">
            Login
          </a>
        </div>

        {/* Mobile menu button */}
        <button className="menu-btn" aria-label="Open menu">
          ☰
        </button>
      </div>
    </header>
  );
}
export default Header;