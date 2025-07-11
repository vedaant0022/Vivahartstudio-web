import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FooterWrapper } from './Footer.style';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
  };

  // Add some decorative hearts
  const hearts = Array.from({ length: 6 }).map((_, i) => (
    <div
      key={i}
      className="heart-decoration"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        transform: `scale(${Math.random() * 1.5 + 0.5})`,
      }}
    />
  ));

  return (
    <FooterWrapper>
      {hearts}
      <div className="container">
        <div className="footer-grid">
          {/* About Column */}
          <div className="footer-column">
            <h3>About Handicraft</h3>
            <p>
            At Vivah Arts Studio, we celebrate the beauty of Indian festivals through handcrafted rakhis and curated festive products made with love and tradition. Each piece is thoughtfully designed to reflect culture, emotions, and the joy of giving.
            </p>

            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2a10 10 0 0 0-3.16 19.5c-.07-.7-.15-1.87.03-2.67.16-.7 1.05-4.47 1.05-4.47s-.27-.54-.27-1.33c0-1.25.72-2.18 1.62-2.18.76 0 1.13.57 1.13 1.26 0 .77-.49 1.92-.74 2.98-.21.89.45 1.61 1.32 1.61 1.58 0 2.8-1.67 2.8-4.07 0-2.13-1.53-3.62-3.72-3.62-2.53 0-4.02 1.89-4.02 3.85 0 .76.29 1.58.65 2.02a.26.26 0 0 1 .06.25l-.24.99c-.04.15-.13.18-.3.11-1.11-.52-1.81-2.16-1.81-3.47 0-2.81 2.04-5.39 5.89-5.39 3.09 0 5.49 2.2 5.49 5.14 0 3.06-1.93 5.53-4.61 5.53-.9 0-1.74-.47-2.03-1.02l-.55 2.08c-.2.77-.74 1.73-1.1 2.32A10 10 0 1 0 12 2"></path>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
         

          {/* Categories */}
          <div className="footer-column">
            <h3>Categories</h3>
            <ul>
              <li><Link to="/">Rakhi Collection</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-column">
            <h3>Newsletter</h3>
            <p>Subscribe to get special offers, free giveaways, and updates!</p>
            <form className="newsletter" onSubmit={handleSubscribe}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Subscribe</button>
              </div>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Handicraft. All rights reserved. Made with ♥ in India
          </p>
        </div>
      </div>
    </FooterWrapper>
  );
};

export default Footer; 