const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const userRouter = require("./routes/userRoutes");
const groupRouter = require("./routes/groupRoutes");
const messageRouter = require("./routes/messageRoutes");
const GroupModel = require("./models/GroupProject");
const UserModel = require("./models/UserModel");

require('dotenv').config();
// console.log("Environment Variables Loaded:", process.env);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("Error connecting DB:", error));

app.use("/user", userRouter);
app.use("/group", groupRouter);
// app.use("/message", messageRouter);

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    socket.on("join-group", async (groupId) => {
        try {
            const group = await GroupModel.findOne({ groupId });
            if (!group) {
                return socket.emit("error", "Group not found");
            }
    
            if (!group.members.includes(userId)) {
                group.members.push(userId);
                await group.save();
                return socket.emit("error", "You are not a member of this group");
            }
    
            socket.join(groupId);
            socket.emit("joined-group", groupId);
        } catch (error) {
            socket.emit("error", "Error joining the group");
        }
    });
    

    socket.on("send-message", async (message) => {
        try {    
            if (!message.sender) {
                return socket.emit("error", "Sender ID is required to send a message");
            }
            if (!message.groupId) {
                return socket.emit("error", "Group ID is required to send a message");
            }
    
            const group = await GroupModel.findOne({ groupId: message.groupId });
            if (!group) {
                return socket.emit("error", "Group not found");
            }
    
            if (!group.members.includes(message.sender)) {
                return socket.emit("error", "You are not a member of this group");
            }

            const user = await UserModel.findOne({ userId: message.sender });

            const newMessage = {
                sender: {
                    userId: message.sender,
                    name: user.name,
                },
                content: message.content,
                timestamp: new Date(),
            };
        
            group.messages.push(newMessage);
            await group.save();
        
            const savedMessage = group.messages[group.messages.length - 1];

            io.to(message.groupId).emit("receive-message", {
                _id: savedMessage._id,
                ...newMessage,
            });        
        } catch (error) {
            socket.emit("error", "Error processing the message");
        }
    });

    socket.on("user-typing", async ({ groupId, userId, isTyping }) => {
        if (groupId && userId) {
            const user = await UserModel.findOne({ userId: userId });
            io.to(groupId).emit("user-typing", { name: user.name, userId, isTyping });
        }
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
