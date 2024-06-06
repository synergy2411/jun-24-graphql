let Query = {
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
};

export default Query;
