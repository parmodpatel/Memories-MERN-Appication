// client/src/components/Form.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost, updatePost } from "../actions/posts";

const Form = ({currentId,setCurrentId}) => {
  const [postData, setPostData] = useState({
    creator: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Submitting:", postData);
    if (currentId) {
      dispatch(updatePost(currentId, postData));
    } else {
      // console.log("Dispatched createNewPost");
      dispatch(createNewPost(postData));
    }
    setCurrentId(null);
    setPostData({
        creator: "",
        title: "",
        message: "",
        tags: "",
        selectedFile: "",
      });
    // if (postData.title.trim() && postData.message.trim()) {
      
      
    // }
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
      <h2 className="text-xl font-semibold mb-4 text-center">{currentId ? 'Editing' : 'Creating'} a Memory</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Creator"
          className="border rounded px-3 py-2"
          value={postData.creator}
          onChange={(e) => setPostData({ ...postData, creator: e.target.value })}
        />
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
