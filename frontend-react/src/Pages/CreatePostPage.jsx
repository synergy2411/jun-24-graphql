import { gql, useMutation } from "@apollo/client";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const CREATE_POST = gql`
  mutation createPost($title: String!, $body: String!, $published: Boolean) {
    createPost(data: { title: $title, body: $body, published: $published }) {
      id
      title
      body
      published
    }
  }
`;

function CreatePostPage() {
  const titleRef = useRef();
  const bodyRef = useRef();

  const navigate = useNavigate();

  const [createPostMutation, { loading, error }] = useMutation(CREATE_POST);

  const createPostHandler = (event) => {
    event.preventDefault();
    createPostMutation({
      variables: {
        title: titleRef.current.value,
        body: bodyRef.current.value,
        published: false,
      },
    })
      .then((response) => {
        console.log(response);
        navigate("/posts");
      })
      .catch((err) => console.log(err));
  };

  if (error) return <h1>Error Occured</h1>;

  return (
    <div className="row">
      <div className="col-6 offset-3">
        <h1>Add New Post here</h1>
        <form>
          {/* title */}
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              name="title"
              id="title"
              placeholder=""
              ref={titleRef}
            />
            <label htmlFor="title">Title:</label>
          </div>

          {/* body */}

          <div className="mb-3">
            <label htmlFor="" className="form-label"></label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Pls enter your message"
              ref={bodyRef}
            ></textarea>
          </div>

          {/* button */}
          <button
            onClick={createPostHandler}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Creating Post..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostPage;
