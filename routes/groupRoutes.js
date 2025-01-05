const express = require("express");
const groupRouter = express.Router();
const { getGroups, createGroup, joinGroup, getGroup, deleteGroup, clearChat, updateGroup, getAllUsers } = require("../controllers/groupController");
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

groupRouter.get("/groups", getGroups);
groupRouter.post("/create-group", createGroup);
groupRouter.post("/join-group", joinGroup);
groupRouter.get('/:groupId/messages', getGroup);
groupRouter.delete("/:groupId", deleteGroup);
groupRouter.put("/:groupId", upload.single("image"), updateGroup);
groupRouter.post("/clear-chat/:groupId", clearChat);
groupRouter.get("/get-all-users/:groupId", getAllUsers);

module.exports = groupRouter;
