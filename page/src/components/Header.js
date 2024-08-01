import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Header.css';

function Header() {
  return (
    <header className="main-header">
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
