const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    groupId: {
        type: String,
        unique: true,
        required: true,
        maxlength: 100,
    },
    name: {
        type: String,
        required: true,
        maxlength: 50,
    },
    image: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/daf6cmyaq/image/upload/v1735640098/messaging/zlli90v8euizfqzqmxcs.png"
    },
    members: {
        type: [String],
        default: [],
    },
    messages: [{
        sender: {
            userId : {
                type: String,
            },
            name: {
                type: String,
            },
        },               
        content: { 
            type: String, 
            required: true 
        },
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read'],
            default: 'sent',
        },
        timestamp: { type: Date, default: Date.now },
    }],
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const GroupModel = mongoose.model("groups", GroupSchema);

module.exports = GroupModel;
