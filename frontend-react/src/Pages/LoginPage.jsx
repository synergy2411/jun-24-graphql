import { useRef } from "react";
import { useMutation, gql } from "@apollo/client";

const USER_LOGIN = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(data: { email: $email, password: $password }) {
      token
    }
  }
`;

function LoginPage() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loginMutation, { data, loading, error }] = useMutation(USER_LOGIN);

  console.log(data, loading, error);

  const submitHandler = async (event) => {
    event.preventDefault();
    console.log("Email : ", emailRef.current.value);
    console.log("Password : ", passwordRef.current.value);
    await loginMutation({
      variables: {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      },
    });
  };

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
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
