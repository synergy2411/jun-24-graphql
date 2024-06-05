import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";

let users = [
  { id: "u001", name: "Monica Geller", age: 23 },
  { id: "u002", name: "Rachel Green", age: 22 },
  { id: "u003", name: "Chandler Bing", age: 24 },
];

const typeDefs = `
    type Query {
        users(term : String): [User!]!
    }

    type User {
        id : ID!
        name : String!
        age : Int!
    }
`;

const resolvers = {
  Query: {
    users: (parent, args, context, info) => {
      if (args.term) {
        return users.filter((user) =>
          user.name.toLowerCase().includes(args.term.toLowerCase())
        );
      }
      return users;
    },
  },
};

const schema = createSchema({
  typeDefs, // Abstract Layer of Schema, exposed to client
  resolvers, // Behaviour, Functions resolving the schema definition
});

const yoga = createYoga({
  schema,
});

const server = createServer(yoga);

server.listen(4000, () => console.log("GraphQL Server started at PORT : 4000"));
