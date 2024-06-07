import { gql, useMutation } from "@apollo/client";
import { useRef } from "react";

const USER_LOGIN = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(data: { email: $email, password: $password }) {
      token
    }
  }
`;

const CREATE_POST = gql`
  mutation createPost {
    createPost(
      data: {
        title: "New Post"
        body: "Post Created by React App"
        published: false
      }
    ) {
      id
      title
      body
      published
    }
  }
`;

function LoginPage() {
  const emailRef = useRef();
  const passwordRef = useRef();
  //   const navigate = useNavigate();
  const [loginMutation, { loading, error }] = useMutation(USER_LOGIN);

  const [createPostMutation, { loading: postLoading, error: postError }] =
    useMutation(CREATE_POST);

  const submitHandler = (event) => {
    event.preventDefault();
    loginMutation({
      variables: {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      },
    }).then((response) => {
      console.log("RESPONSE : ", response);
      localStorage.setItem("token", response.data.signIn.token);
      //   navigate("/posts");
    });
  };

  const createPostHandler = (event) => {
    event.preventDefault();
    createPostMutation()
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  console.log(postError);
  if (error || postError) return <h1>Error Occured</h1>;

  return (
    <>
      <div className="row">
        <div className="col-6 offset-3">
          <h1 className="text-center">Login Form</h1>
          <form onSubmit={submitHandler}>
            {/* email */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name="email"
                id="email"
                placeholder=""
                ref={emailRef}
              />
              <label htmlFor="email">Email:</label>
            </div>

            {/* password */}

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder=""
                ref={passwordRef}
              />
              <label htmlFor="password">Password</label>
            </div>

            {/* buttons */}
            <div className="row">
              <div className="col-6">
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Login"}
                  </button>
                </div>
              </div>
              <div className="col-6">
                <div className="d-grid">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={createPostHandler}
                  >
                    {postLoading ? "Creating Post..." : "Create Post"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
