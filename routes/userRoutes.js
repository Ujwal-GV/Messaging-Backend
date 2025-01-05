const express = require("express");
const userRouter = express.Router();
const { getUser, registerUser, loginUser, getCurrentUser, getUserName, updateUser, getAllUsers } = require("../controllers/userController");
const authenticate = require("../middlewares/authAuthenticate");
const { storage } = require("../config/cloudinary");
const multer = require("multer");
const path = require("path");

const upload = multer({ storage: storage });

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimetype = fileTypes.test(file.mimeType);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-user/:userId", getUserName)
userRouter.get('/me', authenticate, getCurrentUser);
userRouter.put("/:userId", upload.single("image"), updateUser);

module.exports = userRouter;
