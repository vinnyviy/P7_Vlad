const express = require("express");
const router = express.Router();

const {
  createPost,
  deletePost,
  getPosts,
} = require("../controllers/post.controller");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, createPost);
router.delete("/:id", auth, multer,deletePost);
router.get("/",auth, multer, getPosts);

module.exports = router;