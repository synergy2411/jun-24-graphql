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

const USER_LOGIN = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(data: { email: $email, password: $password }) {
      token
    }
  }
`;

window.onload = async function () {
  const postContainer = document.querySelector("#post-container");

  const btnLogin = document.querySelector("#btn-login");
  const emailEl = document.querySelector("#email");
  const passwordEl = document.querySelector("#password");

  btnLogin.addEventListener("click", async function (event) {
    event.preventDefault();

    try {
      const response = await client.mutate({
        mutation: USER_LOGIN,
        variables: {
          email: emailEl.value,
          password: passwordEl.value,
        },
      });
      console.log("RESPONSE : ", response);
    } catch (err) {
      console.error(err);
    }
  });

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
