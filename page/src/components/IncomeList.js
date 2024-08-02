import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_TRANSACTIONS_BY_DATE, DELETE_TRANSACTION } from '../graphql';
import Header from './Header';
import './styles/IncomeExpense.css';

function IncomeList() {
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

  const incomes = data?.transactionsByDate.filter(t => t.type === 'income') || [];

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

  const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0).toFixed(2);

  return (
    <div className="income-list">
      <Header title="Income" />
      <div className="filters">
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
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income.id}>
              <td>{income.description}</td>
              <td>${income.amount}</td>
              <td>{new Date(income.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(income)}>Edit</button>
                <button onClick={() => onDeleteTransaction(income.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total">
        <h4>Total Income: ${totalIncome}</h4>
      </div>
    </div>
  );
}

export default IncomeList;