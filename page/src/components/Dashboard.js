import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import IncomeList from './IncomeList';
import ExpenseList from './ExpenseList';
import Home from './Home';
import AddEditTransactionPage from './AddEditTransactionPage';
import { GET_DASHBOARD_DATA, ADD_TRANSACTION, EDIT_TRANSACTION, DELETE_TRANSACTION } from '../graphql';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('home');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_DATA, {
    variables: { userId },
    skip: !userId,
  });

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [{ query: GET_DASHBOARD_DATA, variables: { userId } }],
  });
  const [editTransaction] = useMutation(EDIT_TRANSACTION, {
    refetchQueries: [{ query: GET_DASHBOARD_DATA, variables: { userId } }],
  });
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [{ query: GET_DASHBOARD_DATA, variables: { userId } }],
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login', { replace: true });
  };

  const handleAddTransaction = async (transaction) => {
    try {
      await addTransaction({
        variables: { ...transaction, userId },
      });
    } catch (e) {
      console.error('Error adding transaction:', e);
    }
  };

  const handleEditTransaction = async (transaction) => {
    try {
      await editTransaction({
        variables: { ...transaction, userId },
      });
    } catch (e) {
      console.error('Error editing transaction:', e);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction({
        variables: { id, userId },
      });
    } catch (e) {
      console.error('Error deleting transaction:', e);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home data={data} />;
      case 'transactions':
        return (
          <AddEditTransactionPage
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'income':
        return <IncomeList incomes={data?.incomes || []} onEditTransaction={handleEditTransaction} onDeleteTransaction={handleDeleteTransaction} />;
      case 'expenses':
        return <ExpenseList expenses={data?.expenses || []} onEditTransaction={handleEditTransaction} onDeleteTransaction={handleDeleteTransaction} />;
      default:
        return <Home data={data} />;
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