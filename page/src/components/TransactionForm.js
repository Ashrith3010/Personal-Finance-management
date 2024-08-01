import React from 'react';

function TransactionForm({ onSubmit, transactionData, setTransactionData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionData(prevState => ({
      ...prevState,
      [name]: value
    }));
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
      <button type="submit">Submit</button>
    </form>
  );
}

export default TransactionForm;
