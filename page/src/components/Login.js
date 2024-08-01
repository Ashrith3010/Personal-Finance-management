import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import client from '../apolloClient';
 

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
      username
      userId
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ variables: { email, password } });
      if (data && data.login) {
        localStorage.setItem('token', data.login.accessToken);
        localStorage.setItem('refreshToken', data.login.refreshToken);
        localStorage.setItem('username', data.login.username);
        localStorage.setItem('userId', data.login.userId);
        await client.resetStore();
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err.message);
      alert(`Login failed: ${err.message}`);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            id="email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="form-control"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className="submit-button"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error-message">Error: {error.message}</p>}
      </form>
      <p className="register-link">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login;
