import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../actions/posts";

const Post = ({ post, setCurrentId, user }) => {
  const dispatch = useDispatch();
  const isOwner =
    user?.id === post.creatorId ||
    (user?.email && (post.creatorEmail || post.creator) === user.email);
  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg overflow-hidden mx-auto mb-6">
      {(post.imageUrl || post.selectedFile) && (
        <img
          src={post.imageUrl || post.selectedFile}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <p className="text-blue-500 text-sm mb-2">
          {post.tags?.map((tag) => `#${tag}`).join(" ")}
        </p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-4">{post.message}</p>

        <div className="flex justify-between">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => dispatch(likePost(post._id))}
          >
            Like {post.likecount}
          </button>
          {isOwner && (
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => dispatch(deletePost(post._id))}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
