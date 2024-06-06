let Subscription = {
  post: {
    subscribe: (parent, args, { db, pubsub }, info) => {
      return pubsub.subscribe("the-post-channel");
    },
    resolve: (payload) => payload,
  },
};

export default Subscription;
