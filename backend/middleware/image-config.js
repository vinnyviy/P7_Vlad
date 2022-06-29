const multer = require("multer");
const upload = multer({dest: "uploads/"})
const imageUpload = upload.single("image")






module.exports =  {imageUpload}