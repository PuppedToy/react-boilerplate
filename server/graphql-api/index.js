const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { readFileSync } = require('fs');

const grpahqlSchemaFile = `${String(
  readFileSync(`${__dirname}/schema.graphql`),
)}`;
const schema = buildSchema(grpahqlSchemaFile);

const root = {
  ping: () => 'ping',
};

const graphqlMiddleware = graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
});

module.exports = graphqlMiddleware;
