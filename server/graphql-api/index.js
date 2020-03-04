const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { readFileSync } = require('fs');

const controller = require('./controller');

const grpahqlSchemaFile = String(readFileSync(`${__dirname}/schema.graphql`));
const schema = buildSchema(grpahqlSchemaFile);

const graphqlMiddleware = graphqlHTTP({
  schema,
  rootValue: controller,
  graphiql: true,
});

module.exports = graphqlMiddleware;
