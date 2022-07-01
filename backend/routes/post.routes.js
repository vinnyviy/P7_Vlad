const express = require("express");
const router = express.Router();

const {
  createPost,
  deletePost,
  getPosts,
  modifyPost,
  likePost,
  getLikes,
} = require("../controllers/post.controller");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, createPost);
router.delete("/:id", auth, multer,deletePost);
router.get("/",auth, multer, getPosts);
router.put("/:id", auth, multer,modifyPost);
router.post("/like/:id", auth, likePost);
router.get("/like/:id", auth, getLikes);

module.exports = router;