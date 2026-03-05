import React from 'react'
import '../styles/Footer.css'
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa' // Icons install kar lena

const Footer = () => {
  return (
    <footer className="footer-modern">
      <div className="footer-upper">
        <div className="footer-brand-section">
          <h2 className="footer-logo">SHOP<span>EZ</span></h2>
          <p>Curating the best products for your modern lifestyle. Experience quality at your doorstep.</p>
          <div className="social-links-pill">
             <FaFacebook /> <FaInstagram /> <FaTwitter /> <FaLinkedin />
          </div>
        </div>

        <div className="footer-grid-links">
          <div className="link-col">
            <h4>Explore</h4>
            <ul>
              <li>Home</li>
              <li>Categories</li>
              <li>New Arrivals</li>
            </ul>
          </div>

          <div className="link-col">
            <h4>Customer Care</h4>
            <ul>
              <li>My Account</li>
              <li>Track Order</li>
              <li>Support Center</li>
            </ul>
          </div>

          <div className="link-col newsletter-col">
            <h4>Join the Club</h4>
            <p>Get early access to sales and new drops.</p>
            <div className="footer-input-group">
              <input type="email" placeholder="Email Address" />
              <button>JOIN</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-low">
        <p>© 2026 ShopEZ. Designed for Excellence.</p>
      </div>
    </footer>
  )
}

export default Footer