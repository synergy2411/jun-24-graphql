import { GraphQLError } from "graphql";
import { v4 } from "uuid";

let Mutation = {
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
  updateUser: (parent, { userId, data }, { db }, info) => {
    const foundUser = db.users.find((user) => user.id === userId);
    if (!foundUser) {
      throw new GraphQLError("Unable to find user for id - " + userId);
    }

    const { name, age } = data;
    if (name) {
      foundUser.name = name;
    }
    if (age) {
      foundUser.age = age;
    }

    return foundUser;
  },
  createPost: (parent, args, { db, pubsub }, info) => {
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
    pubsub.publish("the-post-channel", {
      data: newPost,
      mutationType: "CREATED",
    });
    return newPost;
  },
  deletePost: (parent, { postId }, { db, pubsub }, info) => {
    const position = db.posts.findIndex((post) => post.id === postId);
    if (position === -1) {
      throw new GraphQLError("Unable to delete post for Id -" + postId);
    }

    db.comments = db.comments.filter((comment) => comment.postId !== postId);
    const [deletedPost] = db.posts.splice(position, 1);
    pubsub.publish("the-post-channel", {
      data: deletedPost,
      mutationType: "DELETED",
    });
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
};

export default Mutation;
