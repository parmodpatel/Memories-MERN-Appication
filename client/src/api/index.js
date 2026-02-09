import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const fetchPosts = () => API.get("/posts");

export const createPost = (newPost) => API.post("/posts", newPost);

export const updatePost = (id, updatedPost) =>
  API.patch(`/posts/${id}`, updatedPost);

export const deletePost = (id) => API.delete(`/posts/${id}`);

export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

export const signUp = (payload) => API.post("/auth/signup", payload);

export const signIn = (payload) => API.post("/auth/login", payload);

export const fetchMe = () => API.get("/auth/me");

export const logout = () => API.post("/auth/logout");

export const getCloudinarySignature = () => API.get("/cloudinary/sign");
