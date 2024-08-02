import { gql } from '@apollo/client';

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($userId: ID!) {
    totalBalance(userId: $userId)
    totalIncome(userId: $userId)
    totalExpenses(userId: $userId)
    incomes(userId: $userId) {
      id
      description
      amount
      date
    }
    expenses(userId: $userId) {
      id
      description
      amount
      date
    }
  }
`;
export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      id
      amount
      date
      description
      category
    }
  }
`;
export const GET_TRANSACTIONS_BY_DATE = gql`
  query GetTransactionsByDate($userId: ID!, $startDate: String!, $endDate: String!) {
    transactionsByDate(userId: $userId, startDate: $startDate, endDate: $endDate) {
      id
      description
      amount
      type
      date
    }
  }
`;

export const ADD_TRANSACTION = gql`
  mutation AddTransaction($userId: ID!, $description: String!, $amount: Float!, $type: String!, $date: String) {
    addTransaction(userId: $userId, description: $description, amount: $amount, type: $type, date: $date) {
      id
      description
      amount
      type
      date
    }
  }
`;

export const EDIT_TRANSACTION = gql`
  mutation EditTransaction($userId: ID!, $id: ID!, $description: String!, $amount: Float!, $type: String!, $date: String) {
    editTransaction(userId: $userId, id: $id, description: $description, amount: $amount, type: $type, date: $date) {
      id
      description
      amount
      type
      date
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($userId: ID!, $id: ID!) {
    deleteTransaction(userId: $userId, id: $id)
  }
`;

// Mutation to refresh the token
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      username
      userId
    }
  }
`;
