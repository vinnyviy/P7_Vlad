const { Post } = require("../models/post.model");
const fs = require("fs");

function createPost(req, res) {
  const { content } = req.body;
  if (req.file) {
     post = new Post({
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    content: req.body.content,
    likes: 0,
    user: req.userId,
  });
 }else {
  post = new Post({
    
    
    content: req.body.content,
    likes: 0,
    user: req.userId,
    imageUrl:"",
    
  });
}
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

function modifyPost(req, res, next)  {
  Post.findOne({ _id: req.params.id }).populate("user", "isAdmin")
  .then((post) => {
    if (post.user._id.toString() != req.userId && post.user.isAdmin) {
      return res.status(403).send({ message: "utilisateur non autorisé" });
    }
  
  
  Post.updateOne({ _id: req.params.id }, { content: req.body.content })
    .then(() => res.status(200).json({ message: "Post modifié !" }))
    .catch((error) =>
      res.status(403).json({ error: error, message: "Requête non autorisée" }),
    );
  });
};

function deletePost(req, res) {
  Post.findOne({ _id: req.params.id })

    .then((post) => {
      if (post.imageUrl != "") {
        const filename = post.imageUrl.split("/images/")[1];

        
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Post supprimé !" }))
            .catch((error) => res.status(403).json({ error }));
        });
      } else {
        Post.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Post supprimé !" }))
          .catch((error) => res.status(403).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
}

function likePost  (req, res, next)  {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      
      if (!post.usersLiked.includes(req.userId)) {
        post.usersLiked.push(req.userId); 
        Post.updateOne(
          { _id: req.params.id },
          {
            
            usersLiked: post.usersLiked,
            likes: post.usersLiked.length, 
          }
        )
          .then(() =>
            res
              .status(200)
              .json({ message: "Post liké !", likes: post.likes + 1 })
          )
          .catch((error) => res.status(400).json({ error }));
      }

      
      else {
        let indexUserLiked = post.usersLiked.indexOf(req.userId); 

        post.usersLiked.splice(indexUserLiked, 1);
        Post.updateOne(
          { _id: req.params.id },
          {
            usersLiked: post.usersLiked,
            likes: post.usersLiked.length, 
          }
        )
          .then(() =>
            res
              .status(200)
              .json({ message: "Like supprimé !", likes: post.likes - 1 })
          )
          .catch((error) => res.status(400).json({ error }));
      }
    })

    .catch((error) => res.status(500).json({ error }));
};

function getLikes  (req, res, next) {
  Post.findOne({ _id: req.params.id }).then((post) => {
    res.status(200).json({ likes: post.likes, usersLiked: post.usersLiked });
  });
};

module.exports = {
  createPost,
  deletePost,
  getPosts,
  modifyPost,
  likePost,
  getLikes,
};
