import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { GET_TRANSACTIONS_BY_DATE, DELETE_TRANSACTION } from '../graphql';
import DatePicker from './DatePicker'; // Assuming we'll create a DatePicker component

function IncomeList() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const { loading, error, data } = useQuery(GET_TRANSACTIONS_BY_DATE, {
    variables: { 
      userId, 
      startDate: selectedDate.toISOString().split('T')[0],
      endDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString().split('T')[0]
    },
  });

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [{ query: GET_TRANSACTIONS_BY_DATE, variables: { userId, startDate: selectedDate.toISOString().split('T')[0], endDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString().split('T')[0] } }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const incomes = data?.transactionsByDate.filter(t => t.type === 'income') || [];

  const handleEdit = (transaction) => {
    navigate(`/edit-transaction/${transaction.id}`, { state: { transaction } });
  };

  const onDeleteTransaction = async (id) => {
    try {
      await deleteTransaction({ variables: { userId, id } });
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add-transaction">Add Transaction</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/savings">Savings</Link>
      </nav>
      <h3>Income List</h3>
      <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <ul>
        {incomes.length === 0 ? (
          <li>No incomes available for the selected period.</li>
        ) : (
          incomes.map(income => (
            <li key={income.id}>
              {income.description}: ${income.amount} 
              (Date: {new Date(income.date).toLocaleDateString()})
              <button onClick={() => handleEdit(income)}>Edit</button>
              <button onClick={() => onDeleteTransaction(income.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default IncomeList;