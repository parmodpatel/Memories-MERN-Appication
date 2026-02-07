import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  creator: String,
  creatorId: String,
  creatorEmail: String,
  tags: [String],
  selectedFile: String,
  imageUrl: String,
  imagePublicId: String,
  likecount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
});

const PostMessage = mongoose.model('PostMessage',postSchema);

export default PostMessage;
