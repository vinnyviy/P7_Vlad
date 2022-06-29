const { Post } = require("../models/post.model");
const fs = require("fs");

function createPost(req, res) {
  const { content } = req.body;
  const post = new Post({
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    content,
    user: req.userId,
  });
  post.save().then(() => res.send({ post }));
}

function getPosts(req, res) {
  Post.find().sort({"date": "desc"})
    .populate({ path: "user", select: ["userName", "picture"] })
    .then((posts) => {
      const mappedposts = posts.map((post) => {
        imageUrl =
          req.protocol + "://" + req.get("host") + "/images/" + post.imageUrl;
        return post;
      });
      res.status(200).json(mappedposts);
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
}

function deletePost(req, res) {
  Post.findOne({ _id: req.params.id }).populate("user", "isAdmin")
  .then((post) => {
    if (post.user._id.toString() != req.userId && post.user.isAdmin) {
      return res.status(403).send({ message: "utilisateur non autorisé" });
    }
    const filename = post.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      Post.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "post supprimé" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
}

module.exports = {
  createPost,
  deletePost,
  getPosts,
};
