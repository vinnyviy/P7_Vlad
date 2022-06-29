const {Schema} = require("mongoose");
const mongoose = require("mongoose")

const PostSchema = new Schema({
  content: { type: String },
  imageUrl: { type: String},
  likers: { type: [String]},
  date: { type: Date, default: Date.now},
  user: { type: Schema.Types.ObjectId, ref: "User"},
})
const Post = mongoose.model("Post", PostSchema);
module.exports = {Post}