import { gql } from '@apollo/client';

// Query to get dashboard data
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($userId: ID!) {
    totalBalance(userId: $userId)
    totalIncome(userId: $userId)
    totalExpenses(userId: $userId)
    incomes(userId: $userId) {
      id
      description
      amount
    }
    expenses(userId: $userId) {
      id
      description
      amount
    }
  }
`;

export const ADD_TRANSACTION = gql`
  mutation AddTransaction($userId: ID!, $description: String!, $amount: Float!, $type: String!) {
    addTransaction(userId: $userId, description: $description, amount: $amount, type: $type) {
      id
      description
      amount
      type
    }
  }
`;

export const EDIT_TRANSACTION = gql`
  mutation EditTransaction($userId: ID!, $id: ID!, $description: String!, $amount: Float!, $type: String!) {
    editTransaction(userId: $userId, id: $id, description: $description, amount: $amount, type: $type) {
      id
      description
      amount
      type
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
