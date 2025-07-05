// client/src/features/posts/postsSlice.js

import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: [],
  reducers: {
    fetchAll: (state, action) => action.payload,
    createPost: (state, action) => {
      state.push(action.payload);
    },
    updatePost: (state, action) => {
      return state.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    deletePost: (state, action) => {
      return state.filter((post) => post._id !== action.payload);
    },
  },
});

export const { fetchAll, createPost, updatePost, deletePost } = postsSlice.actions;
export default postsSlice.reducer;
