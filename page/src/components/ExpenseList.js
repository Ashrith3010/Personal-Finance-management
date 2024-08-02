import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { GET_TRANSACTIONS_BY_DATE, DELETE_TRANSACTION } from '../graphql';
import { FaHome, FaMoneyBillWave, FaPlusCircle } from 'react-icons/fa'; // Import icons

function ExpenseList() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const { loading, error, data } = useQuery(GET_TRANSACTIONS_BY_DATE, {
    variables: { 
      userId, 
      startDate: new Date(year, month - 1, 1).toISOString().split('T')[0],
      endDate: new Date(year, month, 0).toISOString().split('T')[0]
    },
  });

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [{ query: GET_TRANSACTIONS_BY_DATE, variables: { userId, startDate: new Date(year, month - 1, 1).toISOString().split('T')[0], endDate: new Date(year, month, 0).toISOString().split('T')[0] } }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const expenses = data?.transactionsByDate.filter(t => t.type === 'expense') || [];

  const handleEdit = (transaction) => {
    navigate(`/edit-transaction/${transaction.id}`, { state: { transaction } });
  };

  const onDeleteTransaction = async (id) => {
    const confirmed = window.confirm("Do you want to delete this transaction?");
    if (confirmed) {
      try {
        await deleteTransaction({ variables: { userId, id } });
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toFixed(2);

  return (
    <div className="expense-list-container">
      <nav className="expense-nav">
        <Link to="/dashboard" className="nav-link"><FaHome /> Dashboard</Link>
        <Link to="/income" className="nav-link"><FaMoneyBillWave /> Income</Link>
        <Link to="/expenses" className="nav-link active"><FaMoneyBillWave /> Expenses</Link>
        <Link to="/add-transaction" className="nav-link"><FaPlusCircle /> Add Transaction</Link>
      </nav>
      <h3>Expense List</h3>
      <div className="filters">
        <div className="month-year-filters">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
      <table className="expense-table">
        <thead>
          <tr>
            <th>SL No.</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="6">No expenses available for the selected period.</td>
            </tr>
          ) : (
            expenses.map((expense, index) => (
              <tr key={expense.id}>
                <td>{index + 1}</td>
                <td>{expense.description}</td>
                <td>${expense.amount}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td><button onClick={() => handleEdit(expense)}>Edit</button></td>
                <td><button onClick={() => onDeleteTransaction(expense.id)}>Delete</button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="total-expenses">
        <h4>Total Expenses: ${totalExpenses}</h4>
      </div>
    </div>
  );
}

export default ExpenseList;
