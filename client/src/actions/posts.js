import * as api from '../api';
import { 
  fetchAll, 
  createPost, 
  updatePost as updatePostInSlice, 
  deletePost as removePost 
} from '../features/posts/postsSlice';

// Get all posts
export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts();
    dispatch(fetchAll(data));
  } catch (error) {
    console.error("Error fetching posts:", error.message);
  }
};

// Create new post
export const createNewPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);
    dispatch(createPost(data));
  } catch (error) {
    console.error("Error creating post:", error.message);
  }
};

// Update a post
export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);
    dispatch(updatePostInSlice(data));
  } catch (error) {
    console.error("Error updating post:", error.message);
  }
};

// Delete a post
export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch(removePost(id));
  } catch (error) {
    console.error("Error deleting post:", error.message);
  }
};

// Like a post
export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    dispatch(updatePostInSlice(data));
  } catch (error) {
    console.error("Error liking post:", error.message);
  }
};
