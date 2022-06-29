const express = require("express");
const router = express.Router()
const auth = require("../middleware/auth");

const userController = require("../controllers/user.controller")

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/", auth, userController.getUser);
router.delete("/",auth, userController.deleteUser);

module.exports = router;