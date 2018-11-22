const { GraphQLServer } = require("graphql-yoga");
const Mutation = require("./Mutation");
const Query = require("./Query");
const db = require("./db");
console.log(Mutation, Query);
function createServer() {
  return new GraphQLServer({
    typeDefs: "src/schema.graphql",
    resolvers: {
      Mutation,
      Query
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => ({ ...req, db })
  });
}

module.exports = createServer;
