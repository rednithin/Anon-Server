const { Prisma } = require("prisma-binding");

const db = new Prisma({
  typeDefs: "prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false
});

module.exports = db;
