// models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  image: String,
  description: String,
  category: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ratings: [
    {
      rating: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
});

const Post = mongoose.model('Post', postSchema);

export default Post;
    