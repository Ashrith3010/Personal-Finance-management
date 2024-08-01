import React from 'react';
import { useQuery, gql } from '@apollo/client';
import './styles/Transactions.css';

const GET_TRANSACTIONS = gql`
  query GetTransactions {
    incomes {
      id
      description
      amount
    }
    expenses {
      id
      description
      amount
    }
  }
`;

function Transactions() {
  const { loading, error, data } = useQuery(GET_TRANSACTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="transactions-container">
      <h2>Transactions</h2>
      <ul className="transaction-list">
        {data.incomes.map((transaction) => (
          <li key={transaction.id} className="transaction-item income">
            <span className="transaction-description">{transaction.description}</span>
            <span className="transaction-amount">${transaction.amount}</span>
          </li>
        ))}
        {data.expenses.map((transaction) => (
          <li key={transaction.id} className="transaction-item expense">
            <span className="transaction-description">{transaction.description}</span>
            <span className="transaction-amount">${transaction.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;
