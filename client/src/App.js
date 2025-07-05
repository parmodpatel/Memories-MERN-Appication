// client/src/App.js

import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { getPosts } from './actions/posts';

import Posts from "./components/Posts";
import Form from "./components/Form";
import memories from "./images/memories.png";
import "./index.css";

const App = () => {
  const [currentId, setCurrentId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [currentId, dispatch]);
  
  return (
    <div className="max-w-7xl mx-auto p-4 ">
      <div className="bg-white rounded-xl flex flex-row justify-center items-center my-8 shadow-lg p-4">
        <h2 className="text-4xl text-blue-500 font-bold text-center">Memories</h2>
        <img className="ml-4 h-14" src={memories} alt="memories" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Posts setCurrentId={setCurrentId}/>
        </div>
        <div>
          <Form currentId={currentId} setCurrentId={setCurrentId}/>
        </div>
      </div>
    </div>
  );
};

export default App;
