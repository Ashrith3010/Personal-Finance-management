import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EDIT_TRANSACTION, GET_TRANSACTIONS_BY_DATE } from '../graphql';
import DatePicker from './DatePicker'; // Assuming we've created this component

function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: '',
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState('');

  const [editTransaction] = useMutation(EDIT_TRANSACTION, {
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

  const { loading, error, data } = useQuery(GET_TRANSACTIONS_BY_DATE, {
    variables: {
      userId,
      startDate: new Date(0).toISOString().split('T')[0], // Start from the earliest possible date
      endDate: new Date().toISOString().split('T')[0] // Up to today
    }
  });

  useEffect(() => {
    if (data && data.transactionsByDate) {
      const transaction = data.transactionsByDate.find(t => t.id === id);
      if (transaction) {
        setFormData({
          description: transaction.description,
          amount: transaction.amount.toString(),
          type: transaction.type,
        });
        setSelectedDate(new Date(transaction.date));
      }
    }
  }, [data, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editTransaction({
        variables: {
          userId,
          id,
          ...formData,
          amount: parseFloat(formData.amount),
          date: selectedDate.toISOString().split('T')[0],
        },
      });
      setMessage('Transaction updated successfully.');
      setTimeout(() => {
        navigate(formData.type === 'income' ? '/income' : '/expenses');
      }, 2000); // Navigate after 2 seconds to allow user to see the message
    } catch (error) {
      console.error('Error editing transaction:', error);
      setMessage('Error updating transaction.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/income">Income</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/savings">Savings</Link>
      </nav>
      <h2>Edit Transaction</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
        />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <button type="submit">Update Transaction</button>
      </form>
      {message && (
        <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default EditTransaction;