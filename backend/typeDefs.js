const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!  # Consider excluding this field from the schema for security reasons
  }

  type Transaction {
    id: ID!
    description: String!
    amount: Float!
    type: String!
    userId: ID!
  }

  type Query {
    hello: String
    totalBalance(userId: ID!): Float
    totalIncome(userId: ID!): Float
    totalExpenses(userId: ID!): Float
    incomes(userId: ID!): [Transaction]
    expenses(userId: ID!): [Transaction]
    transaction(id: ID!): Transaction
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): AuthPayload
    refreshToken(refreshToken: String!): AuthPayload
    addTransaction(userId: ID!, description: String!, amount: Float!, type: String!): Transaction
    editTransaction(userId: ID!, id: ID!, description: String!, amount: Float!, type: String!): Transaction
    deleteTransaction(userId: ID!, id: ID!): Boolean
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    username: String!
    userId: ID!
  }
`;

module.exports = typeDefs;
