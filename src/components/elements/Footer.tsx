import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="container">
      <div className="row">
        <div className="col col-4">
          <h3>Grow Garden</h3>
          <p>Play garden games online and grow beautiful virtual gardens in your browser.</p>
        </div>
        <div className="col col-4">
          <h3>Products</h3>
          <ul>
            <li><Link href="/">Play</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div className="col col-4">
          <h3>Support</h3>
          <ul>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms-of-use">Terms of Use</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2025 Grow Garden. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
