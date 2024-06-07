import { useQuery, gql } from "@apollo/client";
import PostItem from "./PostItem";

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

function PostListPage() {
  const { data, loading, error } = useQuery(FETCH_POSTS);

  if (loading) return <h1>Loading....</h1>;

  if (error) return <h1>Error Occured</h1>;

  return (
    <>
      <h1 className="text-center">All Available Posts</h1>
      <div className="row">
        {data &&
          data.posts &&
          data.posts.map((post) => <PostItem post={post} key={post.id} />)}
      </div>
    </>
  );
}

export default PostListPage;
