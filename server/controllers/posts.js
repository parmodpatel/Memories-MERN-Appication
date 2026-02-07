import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import cloudinary from "../services/cloudinary.js";

export const getPosts = async (req, res) => {
  try {
    const postMessage = await PostMessage.find();
    res.status(200).json(postMessage);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage({
    ...post,
    creatorId: req.userId,
    creatorEmail: req.userEmail,
    creator: req.userEmail || post.creator,
  });

  try {
    await newPost.save();
    res.status(201).json(newPost); // created
  } catch (error) {
    res.status(409).json({ message: error.message }); // conflict
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) 
    return res.status(404).send("No post with this id");

  const existingPost = await PostMessage.findById(_id);
  if (!existingPost) {
    return res.status(404).send("No post with this id");
  }

  if (existingPost.creatorId && existingPost.creatorId !== req.userId) {
    return res.status(403).json({ message: "Not allowed to edit this post." });
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    { new: true }
  );
  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) 
    return res.status(404).send("No post with this id");

  const existingPost = await PostMessage.findById(id);
  if (!existingPost) {
    return res.status(404).send("No post with this id");
  }

  if (existingPost.creatorId && existingPost.creatorId !== req.userId) {
    return res.status(403).json({ message: "Not allowed to delete this post." });
  }

  if (existingPost.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(existingPost.imagePublicId);
    } catch (error) {
      console.error("Cloudinary delete failed:", error.message);
    }
  }

  await PostMessage.findByIdAndDelete(id);
  res.json( {message: "Post deleted successfully"});
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) 
    return res.status(404).send("No post with this id");

  const post = await PostMessage.findById(_id);
  if (!post) {
    return res.status(404).send("No post with this id");
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id, 
    { likecount: post.likecount + 1 }, 
    { new: true }
  );

  res.json(updatedPost);
};
