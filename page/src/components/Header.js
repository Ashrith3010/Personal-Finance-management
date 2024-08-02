import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaMoneyBillWave, FaPlusCircle, FaSignOutAlt } from 'react-icons/fa';
import './styles/Header.css';

const Header = ({ title}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <header className="header">
      <nav>
        <Link to="/dashboard"><FaHome /> Dashboard</Link>
        <Link to="/income"><FaMoneyBillWave /> Income</Link>
        <Link to="/expenses"><FaMoneyBillWave /> Expenses</Link>
        <Link to="/add-transaction"><FaPlusCircle /> Add Transaction</Link>
        <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
      </nav>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;