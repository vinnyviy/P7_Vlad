const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

function signup(req, res) {
  const NUMBER_OF_ROUNDS = 10;
  bcrypt.hash(req.body.password, NUMBER_OF_ROUNDS).then((hash) => {
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((user) => {
        return res.status(201).json({ user: user._id });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json(err);
      });
  });
}

async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json("Utilisateur non trouvé !");
    }
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(400).json("Mot de passe incorrect !");
    }
    const jwtPassword = process.env.SECRET_TOKEN;
    res.status(200).json({
      userId: user._id,
      token: jwt.sign({ userId: user._id }, jwtPassword, {
        expiresIn: "24h",
      }),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}

function getUser(req, res) {
  User.findById(req.userId)
    .populate("posts")
    .then((user) => {
      if (!user) {
        return res.status(404).send(new Error("user not found!"));
      }
      res.status(200).json({
        userId: user._id,
        picture: user.picture,
        userName: user.userName,
        isAdmin: user.isAdmin,
      });
    })
    .catch((err) => res.status(500).send({ err }));
}

function deleteUser(req, res) {
  User.findOne({ _id: req.userId }).then((user) => {
    if (user._id.toString() != req.userId && !user.isAdmin) {
      res
        .status(403)
        .json({ message: "utilisateur ne possède pas cette ressource" });
      return;
    }
    User.deleteOne({ _id: req.userId })
      .then(() => res.status(200).json({ message: "Utilisteur supprimé !" }))
      .catch((error) => res.status(400).json({ error }));
  });
}

module.exports = { signup, login, getUser, deleteUser };
