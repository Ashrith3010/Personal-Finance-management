import React from 'react';

function IncomeList({ incomes = [], onEditTransaction, onDeleteTransaction }) {
  return (
    <div>
      <h3>Income List</h3>
      <ul>
        {incomes.length === 0 ? (
          <li>No incomes available.</li>
        ) : (
          incomes.map(income => (
            <li key={income.id}>
              {income.description}: ${income.amount}
              <button onClick={() => onEditTransaction(income)}>Edit</button>
              <button onClick={() => onDeleteTransaction(income.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default IncomeList;