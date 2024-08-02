import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS_BY_DATE } from '../graphql';
import './styles/Savings.css';

const Savings = ({ userId }) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedYearOnly, setSelectedYearOnly] = useState(currentDate.getFullYear());

  const handleMonthChange = (e) => setSelectedMonth(parseInt(e.target.value, 10));
  const handleYearChange = (e) => setSelectedYear(parseInt(e.target.value, 10));
  const handleYearOnlyChange = (e) => setSelectedYearOnly(parseInt(e.target.value, 10));

  const yearOnlyStartDate = new Date(selectedYearOnly, 0, 1).toISOString().split('T')[0];
  const yearOnlyEndDate = new Date(selectedYearOnly, 11, 31).toISOString().split('T')[0];

  const { loading, error, data } = useQuery(GET_TRANSACTIONS_BY_DATE, {
    variables: {
      userId,
      startDate: yearOnlyStartDate,
      endDate: yearOnlyEndDate,
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const transactions = data?.transactionsByDate || [];

  const calculateTotals = (transactions, filter) => {
    const income = transactions
      .filter(t => t.type === 'income' && filter(t))
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense' && filter(t))
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, savings: income - expenses };
  };

  const monthYearTotals = calculateTotals(transactions, 
    t => new Date(t.date).getMonth() + 1 === selectedMonth && new Date(t.date).getFullYear() === selectedYear
  );

  const yearOnlyTotals = calculateTotals(transactions, 
    t => new Date(t.date).getFullYear() === selectedYearOnly
  );

  return (
    <div className="savings">
      <h2>Savings</h2>
      <div className="savings-container">
        <div className="savings-section">
          <h3>Monthly Savings</h3>
          <div className="savings-controls">
            <select value={selectedMonth} onChange={handleMonthChange}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <input
              type="number"
              value={selectedYear}
              onChange={handleYearChange}
              min="1900"
              max={currentDate.getFullYear()}
            />
          </div>
          <p>Income: ${monthYearTotals.income.toFixed(2)}</p>
          <p>Expenses: ${monthYearTotals.expenses.toFixed(2)}</p>
          <p>Savings: ${monthYearTotals.savings.toFixed(2)}</p>
        </div>
        <div className="savings-section">
          <h3>Yearly Savings</h3>
          <div className="savings-controls">
            <select value={selectedYearOnly} onChange={handleYearOnlyChange}>
              {Array.from({ length: 20 }, (_, i) => currentDate.getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <p>Income: ${yearOnlyTotals.income.toFixed(2)}</p>
          <p>Expenses: ${yearOnlyTotals.expenses.toFixed(2)}</p>
          <p>Savings: ${yearOnlyTotals.savings.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Savings;