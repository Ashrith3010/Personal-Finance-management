import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS_BY_DATE } from '../graphql';

const Savings = ({ userId }) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear()); // Default to current year
  const [selectedYearOnly, setSelectedYearOnly] = useState(currentDate.getFullYear()); // Default to current year for year-only filter

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  const handleYearOnlyChange = (e) => {
    setSelectedYearOnly(parseInt(e.target.value, 10));
  };

  // Filters by month and year
  const startDateMonthYear = new Date(selectedYear, selectedMonth - 1, 1).toISOString().split('T')[0];
  const endDateMonthYear = new Date(selectedYear, selectedMonth, 0).toISOString().split('T')[0];

  // Filters only by year
  const yearOnlyStartDate = new Date(selectedYearOnly, 0, 1).toISOString().split('T')[0];
  const yearOnlyEndDate = new Date(selectedYearOnly, 12, 0).toISOString().split('T')[0];

  const { loading, error, data } = useQuery(GET_TRANSACTIONS_BY_DATE, {
    variables: {
      userId,
      startDate: startDateMonthYear || yearOnlyStartDate,
      endDate: endDateMonthYear || yearOnlyEndDate,
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const transactions = data?.transactionsByDate || [];

  // Calculate monthly savings
  const totalIncomeMonthYear = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() + 1 === selectedMonth && new Date(t.date).getFullYear() === selectedYear)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpensesMonthYear = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() + 1 === selectedMonth && new Date(t.date).getFullYear() === selectedYear)
    .reduce((sum, t) => sum + t.amount, 0);
  const savingsMonthYear = totalIncomeMonthYear - totalExpensesMonthYear;

  // Calculate yearly savings
  const totalIncomeYearOnly = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getFullYear() === selectedYearOnly)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpensesYearOnly = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getFullYear() === selectedYearOnly)
    .reduce((sum, t) => sum + t.amount, 0);
  const savingsYearOnly = totalIncomeYearOnly - totalExpensesYearOnly;

  return (
    <div>
      <h2>Savings</h2>

      {/* Container for side-by-side sections */}
      <div className="savings-container">
        {/* Monthly Savings Section */}
        <div className="savings-section">
          <h3>Monthly Savings</h3>
          <label>
            Month:
            <select value={selectedMonth} onChange={handleMonthChange}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </label>
          <label>
            Year:
            <input
              type="number"
              value={selectedYear}
              onChange={handleYearChange}
              min="1900"
              max={currentDate.getFullYear()}
            />
          </label>
          <p>Total Income for {selectedMonth}/{selectedYear}: ${totalIncomeMonthYear.toFixed(2)}</p>
          <p>Total Expenses for {selectedMonth}/{selectedYear}: ${totalExpensesMonthYear.toFixed(2)}</p>
          <p>Savings for {selectedMonth}/{selectedYear}: ${savingsMonthYear.toFixed(2)}</p>
        </div>

        {/* Yearly Savings Section */}
        <div className="savings-section">
          <h3>Yearly Savings</h3>
          <label>
            Year:
            <select value={selectedYearOnly} onChange={handleYearOnlyChange}>
              {Array.from({ length: 20 }, (_, i) => currentDate.getFullYear() - i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <p>Total Income for {selectedYearOnly}: ${totalIncomeYearOnly.toFixed(2)}</p>
          <p>Total Expenses for {selectedYearOnly}: ${totalExpensesYearOnly.toFixed(2)}</p>
          <p>Savings for {selectedYearOnly}: ${savingsYearOnly.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Savings;
