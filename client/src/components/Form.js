// client/src/components/Form.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost, updatePost } from "../actions/posts";

const Form = ({ currentId, setCurrentId, user }) => {
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  const post = useSelector((state) => currentId ? state.posts.find((p) => p._id === currentId): null);
  const dispatch = useDispatch();

  useEffect(() => {
    if(post) setPostData(post);
  },[post])

  const normalizeTags = (tagsValue) => {
    if (Array.isArray(tagsValue)) {
      return tagsValue;
    }
    return tagsValue
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...postData,
      tags: normalizeTags(postData.tags),
    };
    if (currentId) {
      dispatch(updatePost(currentId, payload));
    } else {
      dispatch(createNewPost(payload));
    }
    setCurrentId(null);
    setPostData({
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    // console.log("Success.",postData)
    reader.onloadend = () => {
      setPostData({ ...postData, selectedFile: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg p-6 mx-auto mb-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {currentId ? "Editing" : "Creating"} a Memory
      </h2>
      <p className="text-xs text-gray-500 text-center mb-3">
        Posting as {user?.name || user?.email || "you"}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Title"
          className="border rounded px-3 py-2"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <textarea
          placeholder="Message"
          className="border rounded px-3 py-2"
          value={postData.message}
          onChange={(e) => setPostData({ ...postData, message: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="border rounded px-3 py-2"
          value={postData.tags}
          onChange={(e) => setPostData({ ...postData, tags: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};


export default Form;
