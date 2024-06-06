import { createSchema, createYoga, createPubSub } from "graphql-yoga";
import { createServer } from "node:http";
import { loadFile } from "graphql-import-files";
import db from "./db/data.js";
import resolvers from "./resolvers/index.js";

const pubsub = createPubSub();

const schema = createSchema({
  typeDefs: loadFile("./src/schema.graphql"), // Abstract Layer of Schema, exposed to client
  resolvers, // Behaviour, Functions resolving the schema definition
});

const yoga = createYoga({
  schema,
  context: {
    db,
    pubsub,
  },
});

const server = createServer(yoga);

server.listen(4000, () => console.log("GraphQL Server started at PORT : 4000"));
