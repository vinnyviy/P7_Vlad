const mongoose = require("mongoose");
const { Schema } = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema(
  {
    userName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: { type: String, default: "../assets/avatardefault_92824.png" },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    isAdmin: { type: Boolean, default: false}
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);
module.exports = { User }
