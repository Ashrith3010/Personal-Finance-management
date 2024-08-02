import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import { GET_TRANSACTIONS_BY_DATE, DELETE_TRANSACTION } from '../graphql';
import DatePicker from './DatePicker'; // Assuming we'll create a DatePicker component

function ExpenseList() {
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

  const expenses = data?.transactionsByDate.filter(t => t.type === 'expense') || [];

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
        <Link to="/income">Income</Link>
        <Link to="/savings">Savings</Link>
      </nav>
      <h3>Expense List</h3>
      <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <ul>
        {expenses.length === 0 ? (
          <li>No expenses available for the selected period.</li>
        ) : (
          expenses.map(expense => (
            <li key={expense.id}>
              {expense.description}: ${expense.amount} 
              (Date: {new Date(expense.date).toLocaleDateString()})
              <button onClick={() => handleEdit(expense)}>Edit</button>
              <button onClick={() => onDeleteTransaction(expense.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ExpenseList;