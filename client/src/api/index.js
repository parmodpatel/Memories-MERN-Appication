// client/src/api/index.js

import axios from "axios";

const url = "http://localhost:8000/posts";

export const fetchPosts = () => axios.get(url);

export const createPost = (newPost) => {
  // console.log("Sending post data:", newPost);
  return axios.post(url, newPost);
};

export const updatePost = (id, updatedPost) => axios.patch(`${url}/${id}`, updatedPost); 

export const deletePost = (id) => axios.delete(`${url}/${id}`);

export const likePost = (id) => axios.patch(`${url}/${id}/likePost`);
