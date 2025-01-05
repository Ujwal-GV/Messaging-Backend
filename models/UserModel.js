const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/daf6cmyaq/image/upload/v1735640098/messaging/zlli90v8euizfqzqmxcs.png"
    },
    description: {
        type: String,
        default: "",
    },
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
