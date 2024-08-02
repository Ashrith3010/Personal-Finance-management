import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import IncomeList from './components/IncomeList';
import ExpenseList from './components/ExpenseList';
import AddTransaction from './components/AddTransaction';
import EditTransaction from './components/EditTransaction';
import Savings from './components/Savings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate replace to="/dashboard" />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/income" element={<PrivateRoute><IncomeList /></PrivateRoute>} />
      <Route path="/expenses" element={<PrivateRoute><ExpenseList /></PrivateRoute>} />
      <Route path="/add-transaction" element={<PrivateRoute><AddTransaction /></PrivateRoute>} />
      <Route path="/edit-transaction/:id" element={<PrivateRoute><EditTransaction /></PrivateRoute>} />
      <Route path="/savings" element={<PrivateRoute><Savings /></PrivateRoute>} />
    </Routes>
  );
}

export default App;