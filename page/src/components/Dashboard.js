import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql';
import Savings from './Savings'; // Ensure Savings component is imported
import { FaHome, FaMoneyBillWave, FaPlusCircle } from 'react-icons/fa';
import './styles/Dashboard.css';

const Dashboard = () => {
  const userId = localStorage.getItem('userId');
  const location = useLocation();
  const currentPath = location.pathname;

  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA, {
    variables: { userId },
    skip: !userId,
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login'; // redirect to login
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const username = data?.user?.username || 'User';

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {username}</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <nav className="dashboard-nav">
        <Link to="/dashboard" className={currentPath === '/dashboard' ? 'nav-link active' : 'nav-link'}>
          <FaHome className="nav-icon" /> Dashboard
        </Link>
        <Link to="/income" className={currentPath === '/income' ? 'nav-link active' : 'nav-link'}>
          <FaMoneyBillWave className="nav-icon" /> Income
        </Link>
        <Link to="/expenses" className={currentPath === '/expenses' ? 'nav-link active' : 'nav-link'}>
          <FaMoneyBillWave className="nav-icon" /> Expenses
        </Link>
        <Link to="/add-transaction" className={currentPath === '/add-transaction' ? 'nav-link active' : 'nav-link'}>
          <FaPlusCircle className="nav-icon" /> Add Transaction
        </Link>
      </nav>
      <div className="dashboard-content">
        <Savings userId={userId} /> {/* Render Savings component here */}
      </div>
    </div>
  );
};

export default Dashboard;
