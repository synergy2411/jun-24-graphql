const {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
} = require("@apollo/client");
const fetch = require("cross-fetch");

describe("GraphQL API Testing Suite", () => {
  test("should fetch all the posts from GraphQL Server", async () => {
    let client = new ApolloClient({
      link: new HttpLink({
        uri: "http://localhost:4040/graphql",
        fetch,
      }),
      cache: new InMemoryCache(),
    });

    const FETCH_POSTS = gql`
      query {
        posts {
          id
          title
          body
          published
        }
      }
    `;

    const { data } = await client.query({
      query: FETCH_POSTS,
    });

    // expect(data).not.toBeUndefined();
    expect(data.posts.length).not.toEqual(0);
  });
});
