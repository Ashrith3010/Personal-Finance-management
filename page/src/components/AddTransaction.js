import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TRANSACTION, GET_TRANSACTIONS_BY_DATE } from '../graphql';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaMoneyBillWave, FaPlusCircle } from 'react-icons/fa'; // Import icons
import DatePicker from './DatePicker';
import './styles/AddTransaction.css'; // Import CSS

const AddTransaction = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    update(cache, { data: { addTransaction } }) {
      const { transactionsByDate } = cache.readQuery({
        query: GET_TRANSACTIONS_BY_DATE,
        variables: {
          userId,
          startDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString().split('T')[0],
          endDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString().split('T')[0]
        }
      });
      cache.writeQuery({
        query: GET_TRANSACTIONS_BY_DATE,
        variables: {
          userId,
          startDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString().split('T')[0],
          endDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString().split('T')[0]
        },
        data: {
          transactionsByDate: [...transactionsByDate, addTransaction]
        }
      });
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userConfirmed = window.confirm('Are you sure you want to add this transaction?');

    if (userConfirmed) {
      const transactionData = {
        description,
        amount: parseFloat(amount),
        type,
        date: selectedDate.toISOString().split('T')[0],
        userId,
      };

      try {
        await addTransaction({ variables: transactionData });
        setMessage('Transaction added successfully.');
        setTimeout(() => {
          navigate(type === 'income' ? '/income' : '/expenses');
        }, 2000); 
      } catch (error) {
        console.error('Error saving transaction:', error);
        setMessage('Error saving transaction.');
      }
    } else {
      setMessage('Transaction canceled.');
    }
  };

  return (
    <div className="add-transaction-container">
      <nav className="add-transaction-nav">
        <Link to="/dashboard" className="nav-link"><FaHome /> Dashboard</Link>
        <Link to="/income" className="nav-link"><FaMoneyBillWave /> Income</Link>
        <Link to="/expenses" className="nav-link"><FaMoneyBillWave /> Expenses</Link>
        <Link to="/add-transaction" className="nav-link active"><FaPlusCircle /> Add Transaction</Link>
      </nav>
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit} className="add-transaction-form">
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
      {message && (
        <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AddTransaction;
