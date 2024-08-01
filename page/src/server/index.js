const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      if (token) {
        try {
          const user = jwt.verify(token.replace('Bearer ', ''), 'your-secret-key');
          return { user };
        } catch (error) {
          console.log('Invalid token');
        }
      }
      return {};
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
