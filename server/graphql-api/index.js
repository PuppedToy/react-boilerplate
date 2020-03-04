const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`type Query {
  empty: String
}`);

const root = {};

const graphqlMiddleware = graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
});

module.exports = graphqlMiddleware;
