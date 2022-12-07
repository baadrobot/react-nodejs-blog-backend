import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    }, 
    text: {
        type: String,
        required: true,
        unique: true,
    },
    tags: {
        type: Array,
        // if there are no tags -> save empty array
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        // reffer to User model, this is relation between two tables
        ref: 'User',
        required: true,
    },
    imageUrl: String,
}, 
{
    timestamps: true,
});

export default mongoose.model('Post', PostSchema);