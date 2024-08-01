const { gql } = require('apollo-server-express');
const typeDefs = gql`
  type Query {
    hello: String
    totalBalance: Float
    totalIncome: Float
    totalExpenses: Float
    incomes: [Income]
    expenses: [Expense]
    transaction(id: ID!): Transaction
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): AuthPayload
    addTransaction(description: String!, amount: Float!, type: String!): Transaction
    editTransaction(id: ID!, description: String!, amount: Float!, type: String!): Transaction
    deleteTransaction(id: ID!): Boolean
  }

  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    token: String!
    username: String!
  }

  type Income {
    id: ID!
    description: String!
    amount: Float!
  }

  type Expense {
    id: ID!
    description: String!
    amount: Float!
  }

  type Transaction {
    id: ID!
    description: String!
    amount: Float!
    type: String!
  }
`;
