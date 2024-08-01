import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TRANSACTION, EDIT_TRANSACTION } from '../graphql';

const AddEditTransactionPage = ({ onAddTransaction, onEditTransaction, initialTransaction = null }) => {
  const [description, setDescription] = useState(initialTransaction?.description || '');
  const [amount, setAmount] = useState(initialTransaction?.amount || '');
  const [type, setType] = useState(initialTransaction?.type || 'income');
  const userId = localStorage.getItem('userId');

  const [addTransaction] = useMutation(ADD_TRANSACTION);
  const [editTransaction] = useMutation(EDIT_TRANSACTION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transactionData = {
      description,
      amount: parseFloat(amount),
      type,
      userId,
    };

    try {
      if (initialTransaction) {
        await onEditTransaction({ ...transactionData, id: initialTransaction.id });
      } else {
        await onAddTransaction(transactionData);
      }
      // Clear form or show success message
      setDescription('');
      setAmount('');
      setType('income');
    } catch (error) {
      console.error('Error saving transaction:', error);
      // Show error message to user
    }
  };
  return (
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
      <button type="submit">{initialTransaction ? 'Update' : 'Add'} Transaction</button>
    </form>
  );
};

export default AddEditTransactionPage;