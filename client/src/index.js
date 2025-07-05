// client/src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import postsReducer from './features/posts/postsSlice';

import App from "./App";

const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
