require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { readFileSync } = require('fs');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const api = require('./api');
const { socketHandler } = require('./utils/socket');
const { authMiddleware } = require('./utils/middlewares');

const router = express.Router();

router.use(
  morgan(':method :url :status :res[content-length] - :response-time ms'),
);
router.use(authMiddleware);

const graphqlSchemaPath = process.env.GRAPHQL_SCHEMA_PATH || 'schema.graphql';
const schema = String(readFileSync(`${__dirname}/${graphqlSchemaPath}`));
const MyGraphQLSchema = buildSchema(schema);

router.use('/public', express.static(`${__dirname}/../public`));
router.use(
  '/pixi',
  express.static(`${__dirname}/../../node_modules/pixi.js/dist/browser`),
);
router.use(
  '/socket.io',
  express.static(`${__dirname}/../../node_modules/socket.io-client/dist`),
);

router.use(
  '/graphql',
  graphqlHTTP({
    schema: MyGraphQLSchema,
    rootValue: api,
    graphiql: true,
  }),
);

router.get('/alive', (req, res) => {
  res.send('true');
});

module.exports = { api: router, socket: socketHandler };
