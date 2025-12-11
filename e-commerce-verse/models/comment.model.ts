import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
    {
        card: {
            type: Schema.Types.ObjectId,
            ref: "Card",  // Assuming cards are stored in the Video collection
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
         
        },
        content: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;
