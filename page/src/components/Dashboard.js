import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import IncomeList from './IncomeList';
import ExpenseList from './ExpenseList';
import Savings from './Savings';
import TransactionForm from './TransactionForm';
import { GET_DASHBOARD_DATA } from '../graphql';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('home');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_DATA, {
    variables: { userId },
    skip: !userId,
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login', { replace: true });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Savings userId={userId} />;
      case 'transactions':
        return <TransactionForm userId={userId} onComplete={() => setActivePage('home')} />;
      case 'income':
        return <IncomeList userId={userId} />;
      case 'expenses':
        return <ExpenseList userId={userId} />;
      default:
        return <Savings userId={userId} />;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="dashboard-buttons">
        <button onClick={() => setActivePage('home')}>Home</button>
        <button onClick={() => setActivePage('transactions')}>Transaction</button>
        <button onClick={() => setActivePage('income')}>Income</button>
        <button onClick={() => setActivePage('expenses')}>Expenses</button>
      </div>
      <div className="dashboard-content">{renderPage()}</div>
    </div>
  );
};

export default Dashboard;