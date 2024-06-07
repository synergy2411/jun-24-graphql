const {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
} = require("@apollo/client");
const fetch = require("cross-fetch");

describe("GraphQL API Testing Suite", () => {
  let client = null;

  beforeEach(() => {
    client = new ApolloClient({
      link: new HttpLink({
        uri: "http://localhost:4040/graphql",
        fetch,
      }),
      cache: new InMemoryCache(),
    });
  });

  test("should fetch all the posts from GraphQL Server", async () => {
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

  test("should generate token when correct credentials given", async () => {
    const USER_LOGIN = gql`
      mutation signIn($email: String!, $password: String!) {
        signIn(data: { email: $email, password: $password }) {
          token
        }
      }
    `;

    const { data } = await client.mutate({
      mutation: USER_LOGIN,
      variables: {
        email: "monica@test",
        password: "monica123",
      },
    });

    expect(data.signIn.token).not.toBeUndefined();
  });
});
