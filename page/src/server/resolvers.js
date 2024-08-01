const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Sample data
const users = [
  // Add a test user for login testing
  {
    id: '1',
    username: 'likitha',
    email: 'likitha@gmail.com',
    password: bcrypt.hashSync('1212', 10) // Hash the password for storage
  }
];
const transactions = [];
let transactionId = 1;

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    totalBalance: () => {
      return transactions.reduce((acc, transaction) => {
        return acc + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
      }, 0);
    },
    totalIncome: () => {
      return transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0);
    },
    totalExpenses: () => {
      return transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0);
    },
    incomes: () => {
      return transactions.filter(transaction => transaction.type === 'income');
    },
    expenses: () => {
      return transactions.filter(transaction => transaction.type === 'expense');
    },
    transaction: (_, { id }) => {
      return transactions.find(transaction => transaction.id === id);
    },
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { id: Date.now().toString(), username, email, password: hashedPassword };
      users.push(newUser);
      return newUser;
    },
    login: async (_, { email, password }) => {
      const user = users.find(user => user.email === email);
      if (!user) {
        throw new Error('User not found');
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }
      const token = jwt.sign({ userId: user.id }, 'SECRET_KEY'); // Replace 'SECRET_KEY' with your secret key
      return { token, username: user.username };
    },
    addTransaction: (_, { description, amount, type }) => {
      const newTransaction = { id: transactionId++, description, amount, type };
      transactions.push(newTransaction);
      return newTransaction;
    },
    editTransaction: (_, { id, description, amount, type }) => {
      const transaction = transactions.find(transaction => transaction.id === id);
      if (!transaction) throw new Error('Transaction not found');
      transaction.description = description;
      transaction.amount = amount;
      transaction.type = type;
      return transaction;
    },
    deleteTransaction: (_, { id }) => {
      const index = transactions.findIndex(transaction => transaction.id === id);
      if (index === -1) throw new Error('Transaction not found');
      transactions.splice(index, 1);
      return true;
    },
  },
};

module.exports = resolvers;
