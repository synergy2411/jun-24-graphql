import { createSchema, createYoga } from "graphql-yoga";
import { GraphQLError } from "graphql";
import { createServer } from "node:http";
import { v4 } from "uuid";
import { loadFile } from "graphql-import-files";

import db from "./db/data.js";

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
    deleteUser: (parent, { userId }, { db }, info) => {
      const position = db.users.findIndex((user) => user.id === userId);
      if (position === -1) {
        throw new GraphQLError("Unable to delete user for id - " + userId);
      }
      db.comments = db.comments.filter((comment) => comment.creator !== userId);

      db.posts = db.posts.filter((post) => {
        const isMatched = post.author === userId;
        if (isMatched) {
          db.comments = db.comments.filter(
            (comment) => comment.postId !== post.id
          );
        }
        return !isMatched;
      });

      const [deletedUser] = db.users.splice(position, 1);
      return deletedUser;
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
    deletePost: (parent, { postId }, { db }, info) => {
      const position = db.posts.findIndex((post) => post.id === postId);
      if (position === -1) {
        throw new GraphQLError("Unable to delete post for Id -" + postId);
      }

      db.comments = db.comments.filter((comment) => comment.postId !== postId);
      const [deletedPost] = db.posts.splice(position, 1);
      return deletedPost;
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
    deleteComment: (parent, { commentId }, { db }, info) => {
      const position = db.comments.findIndex(
        (comment) => comment.id === commentId
      );
      if (position === -1) {
        throw new GraphQLError(
          "Unable to delete the comment for Id -" + commentId
        );
      }

      const [deletedComment] = db.comments.splice(position, 1);

      return deletedComment;
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
  typeDefs: loadFile("./src/schema.graphql"), // Abstract Layer of Schema, exposed to client
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
