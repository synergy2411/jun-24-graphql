import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import db from "./db/data.js";

const typeDefs = /* GraphQL */ `
  type Query {
    users(term: String, sort: Boolean): [User!]!
    posts(term: String): [Post!]!
    comments: [Comment!]!
  }
  type User {
    id: ID!
    name: String!
    age: Int!
    posts: [Post!]!
    comments: [Comment!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
  type Comment {
    id: ID!
    text: String!
    post: Post!
    creator: User!
  }
`;

const resolvers = {
  Query: {
    users: (parent, args, { db }, info) => {
      if (args.sort) {
        //   return users.filter((user) => user.age > args.age);
        return db.users.sort((userA, userB) => {
          if (userA.age > userB.age) {
            return 1;
          } else if (userB.age > userA.age) {
            return -1;
          } else return 0;
        });
      }
      if (args.term) {
        return db.users.filter((user) =>
          user.name.toLowerCase().includes(args.term.toLowerCase())
        );
      }
      return db.users;
    },
    posts: (parent, args, { db }, info) => {
      if (args.term) {
        return db.posts.filter(
          (post) =>
            post.title.toLowerCase().includes(args.term.toLowerCase()) ||
            post.body.toLowerCase().includes(args.term.toLowerCase())
        );
      }
      return db.posts;
    },
    comments: (parent, args, { db }, info) => {
      return db.comments;
    },
  },
  Post: {
    author: (parent, args, { db }, info) => {
      return db.users.find((user) => user.id === parent.author);
    },
    comments: (parent, args, { db }, info) => {
      return db.comments.filter((comment) => comment.postId === parent.id);
    },
  },
  User: {
    posts: (parent, args, { db }, info) => {
      return db.posts.filter((post) => post.author === parent.id);
    },
    comments: (parent, args, { db }, info) => {
      return db.comments.filter((comment) => comment.creator === parent.id);
    },
  },
  Comment: {
    post: (parent, args, { db }, info) => {
      return db.posts.find((post) => post.id === parent.postId);
    },
    creator: (parent, args, { db }, info) => {
      return db.users.find((user) => user.id === parent.creator);
    },
  },
};

const schema = createSchema({
  typeDefs, // Abstract Layer of Schema, exposed to client
  resolvers, // Behaviour, Functions resolving the schema definition
});

const yoga = createYoga({
  schema,
  context: {
    db,
  },
});

const server = createServer(yoga);

server.listen(4000, () => console.log("GraphQL Server started at PORT : 4000"));
