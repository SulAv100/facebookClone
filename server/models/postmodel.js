const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
},
  content: [
    {
      heading: String,
      contentType: { type: String, enum: ["image", "video"] },
      image: String,
      video: String,
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      comments: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          commentContent: {
            type: String,
          },
        },
      ],
      timeStamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const postModel = mongoose.model("Post", postSchema);
module.exports = postModel;
