import React from 'react';
import Link from 'next/link';

const NavBar: React.FC = () => (
  <>
    <input type="checkbox" id="mobile-menu-toggle" className="mobile-menu-checkbox" />
    
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">
          <img src="/logo512.png" alt="Grow Garden Logo" />
          <span className="logo-text">Grow Garden</span>
        </Link>
        
        <nav>
          <ul className="nav">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/farming-life">Farming Life</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>

        <label htmlFor="mobile-menu-toggle" className="mobile-menu-toggle" aria-label="Toggle mobile menu">
          <span></span>
          <span></span>
          <span></span>
        </label>

      </div>
    </header>

    {/* Mobile Navigation Overlay */}
    <label htmlFor="mobile-menu-toggle" className="mobile-nav-overlay"></label>

    {/* Mobile Navigation Menu */}
    <nav className="mobile-nav">
      <div className="mobile-nav-header">
        <Link href="/" className="logo">
          <img src="/logo512.png" alt="Grow Garden Logo" width="32" height="32" />
          <span className="logo-text">Grow Garden</span>
        </Link>
        <label htmlFor="mobile-menu-toggle" className="mobile-nav-close" aria-label="Close mobile menu">
          ×
        </label>
      </div>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/farming-life">Farming Life</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
    </nav>
  </>
);

export default NavBar;
