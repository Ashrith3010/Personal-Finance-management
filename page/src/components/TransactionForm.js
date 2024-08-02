import React from 'react';

function TransactionForm({ onSubmit, transactionData, setTransactionData }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...transactionData,
      amount: parseFloat(transactionData.amount),
      date: transactionData.date || new Date().toISOString().split('T')[0]
    });
  };

  const handleChange = (e) => {
    setTransactionData({
      ...transactionData,
      [e.target.name]: e.target.value
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>
          Description:
          <input type="text" name="description" value={transactionData.description} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Amount:
          <input type="number" name="amount" value={transactionData.amount} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Type:
          <select name="type" value={transactionData.type} onChange={handleChange} required>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Date:
          <input type="date" name="date" value={transactionData.date} onChange={handleChange} required />
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default TransactionForm;