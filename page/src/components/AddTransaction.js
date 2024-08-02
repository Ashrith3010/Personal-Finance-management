import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TRANSACTION, GET_TRANSACTIONS_BY_DATE } from '../graphql';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from './DatePicker'; // Assuming we've created this component

const AddTransaction = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [
      {
        query: GET_TRANSACTIONS_BY_DATE,
        variables: {
          userId,
          startDate: selectedDate.toISOString().split('T')[0],
          endDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString().split('T')[0]
        }
      }
    ]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transactionData = {
      description,
      amount: parseFloat(amount),
      type,
      date: selectedDate.toISOString().split('T')[0],
      userId,
    };

    try {
      await addTransaction({ variables: transactionData });
      navigate(type === 'income' ? '/income' : '/expenses');
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  return (
    <div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/income">Income</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/savings">Savings</Link>
      </nav>
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
};

export default AddTransaction;