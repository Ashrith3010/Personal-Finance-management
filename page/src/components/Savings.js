import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS_BY_DATE } from '../graphql';
import { Link } from 'react-router-dom';
import DatePicker from './DatePicker'; // Assuming we'll create a DatePicker component

const Savings = ({ userId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { loading, error, data } = useQuery(GET_TRANSACTIONS_BY_DATE, {
    variables: {
      userId,
      startDate: selectedDate.toISOString().split('T')[0],
      endDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString().split('T')[0]
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const transactions = data?.transactionsByDate || [];
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const savings = totalIncome - totalExpenses;

  return (
    <div>
      <h2>Savings</h2>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add-transaction">Add Transaction</Link>
        <Link to="/income">Income</Link>
        <Link to="/expenses">Expenses</Link>
      </nav>
      <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <p>Total Income: ${totalIncome.toFixed(2)}</p>
      <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
      <p>Savings: ${savings.toFixed(2)}</p>
    </div>
  );
};

export default Savings;