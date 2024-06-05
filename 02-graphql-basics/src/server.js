import { createSchema, createYoga } from "graphql-yoga";
import { GraphQLError } from "graphql";
import { createServer } from "node:http";
import { v4 } from "uuid";
import db from "./db/data.js";

const typeDefs = /* GraphQL */ `
  type Query {
    users(term: String, sort: Boolean): [User!]!
    posts(term: String): [Post!]!
    comments: [Comment!]!
  }
  type Mutation {
    createUser(data: CreateUserInput): User!
    createPost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comment!
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
  input CreateUserInput {
    name: String!
    age: Int!
  }
  input CreatePostInput {
    title: String!
    body: String!
    authorId: ID!
  }
  input CreateCommentInput {
    text: String!
    postId: ID!
    creatorId: ID!
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
  Mutation: {
    createUser: (parent, args, { db }, info) => {
      const { name, age } = args.data;
      let newUser = {
        id: v4(),
        name,
        age,
      };
      db.users.push(newUser);
      return newUser;
    },
    createPost: (parent, args, { db }, info) => {
      const { title, body, authorId } = args.data;
      const position = db.users.findIndex((user) => user.id === authorId);
      if (position === -1) {
        throw new GraphQLError("Unable to find Author for Id - " + authorId);
      }
      let newPost = {
        id: v4(),
        title,
        body,
        published: false,
        author: authorId,
      };
      db.posts.push(newPost);
      return newPost;
    },
    createComment: (parent, { data }, { db }, info) => {
      const { text, postId, creatorId } = data;

      const foundUser = db.users.find((user) => user.id === creatorId);
      if (!foundUser) {
        throw new GraphQLError(
          "Unable to create comment. Creator not found for id - " + creatorId
        );
      }

      const foundPost = db.posts.find((post) => post.id === postId);
      if (!foundPost) {
        throw new GraphQLError("Unable to find the post for id -" + postId);
      }

      const newComment = {
        id: v4(),
        text,
        postId,
        creator: creatorId,
      };

      db.comments.push(newComment);

      return newComment;
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
