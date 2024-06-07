import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4040/graphql",
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

window.onload = async function () {
  const postContainer = document.querySelector("#post-container");

  try {
    const response = await client.query({
      query: FETCH_POSTS,
    });

    response.data.posts.forEach((post) => {
      const liElement = document.createElement("li");

      liElement.innerHTML = post.title.toUpperCase();

      postContainer.appendChild(liElement);
    });
  } catch (err) {
    console.error(err);
  }
};
