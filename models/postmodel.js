import mongoose from "mongoose";

const postschema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: { // New category field
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Post = mongoose.model("POST", postschema);

export default Post;
