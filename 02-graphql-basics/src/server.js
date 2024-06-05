import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";

let users = [
  { id: "u001", name: "Monica Geller", age: 23 },
  { id: "u002", name: "Rachel Green", age: 22 },
  { id: "u003", name: "Chandler Bing", age: 24 },
];

let posts = [
  {
    id: "p001",
    title: "GraphQL 101",
    body: "Awesome book",
    published: false,
    author: "u003",
  },
  {
    id: "p002",
    title: "Beginning React",
    body: "Great Library",
    published: true,
    author: "u002",
  },
  {
    id: "p003",
    title: "Advanced Angular",
    body: "Super-heroic framework",
    published: false,
    author: "u001",
  },
  {
    id: "p004",
    title: "Mastering NodeJS",
    body: "For advanced users",
    published: true,
    author: "u002",
  },
];

let comments = [
  { id: "c001", text: "I like it", postId: "p004" },
  { id: "c002", text: "Luv it", postId: "p003" },
  { id: "c003", text: "Nice books", postId: "p002" },
  { id: "c004", text: "How i read it", postId: "p003" },
];
const typeDefs = /* GraphQL */ `
  type Query {
    users(term: String): [User!]!
    posts(term: String): [Post!]!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    age: Int!
    posts: [Post!]!
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
    posts: (parent, args, context, info) => {
      if (args.term) {
        return posts.filter(
          (post) =>
            post.title.toLowerCase().includes(args.term.toLowerCase()) ||
            post.body.toLowerCase().includes(args.term.toLowerCase())
        );
      }
      return posts;
    },
    comments: () => {
      return comments;
    },
  },
  Post: {
    author: (parent, args, context, info) => {
      return users.find((user) => user.id === parent.author);
    },
    comments: (parent, args, context, info) => {
      return comments.filter((comment) => comment.postId === parent.id);
    },
  },
  User: {
    posts: (parent, args, context, info) => {
      return posts.filter((post) => post.author === parent.id);
    },
  },
  Comment: {
    post: (parent, args, context, info) => {
      return posts.find((post) => post.id === parent.postId);
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
