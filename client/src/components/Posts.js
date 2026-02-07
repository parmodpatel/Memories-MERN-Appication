import { useSelector } from "react-redux";
import Post from "./Post";

const Posts = ({ setCurrentId, user }) => {
  const posts = useSelector((state) => state.posts);

  return (
    <div className="flex flex-col items-center space-y-2">
      <h1 className="text-2xl font-bold text-gray-800">POSTS</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {posts.map(post => (
          <Post key={post._id} post={post} setCurrentId={setCurrentId} user={user} />
        ))} 
      </div>


      {/* <div className="text-center mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Load More
        </button>
      </div> */}
    </div>
  );
};

export default Posts;
