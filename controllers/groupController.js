const { v4: uuidv4 } = require("uuid");
const GroupModel = require("../models/GroupProject");
const { default: mongoose } = require("mongoose");

const getGroups = async (req, res) => {
    try {
        const groups = await GroupModel.find();
        res.status(200).json({ groups });
    } catch (error) {
        res.status(500).json({ message: "Error fetching groups" });
    }
};

const createGroup = async (req, res) => {
    try {
        const { name } = req.body;

        const groupId = new mongoose.Types.ObjectId();
        
        const newGroup = new GroupModel({
            groupId: groupId,
            name: name,
            members: [],
        });

        await newGroup.save();

        return res.status(201).json({ group: newGroup });
    } catch (error) {
        return res.status(500).json({ message: "Error creating group" });
    }
};

const joinGroup = async (req, res) => {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
        return res.status(400).json({ message: "Both groupId and userId are required" });
    }

    try {
        const group = await GroupModel.findOne({ groupId });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (!group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
        }

        console.log(`User ${userId} joined group: ${group.name}`);
        res.status(200).json({ message: "User joined group successfully", group });
    } catch (error) {
        res.status(500).json({ message: "Error joining group" });
    }
};

const getGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await GroupModel.findOne({ groupId });        
        res.json(group.messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

const updateGroup = async (req, res) => {
    const { groupId } = req.params;
    
    try {
        const image = req.file ? req.file.path : '';

        const updatedData = {
            image
        };

        const updatedGroup = await GroupModel.findOneAndUpdate(
            { groupId: groupId },
            updatedData,
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json({ message: "Group details updated", user: updatedGroup });
    } catch (error) {
        res.status(500).json({ message: "Error updating group", error: error });
    }
};

const deleteGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await GroupModel.findOneAndDelete({ groupId });    
        res.json({ message: "Group deteled successfully" });
    } catch (error) {
        res.json({ message: "Failed to delete group" });
    }
};

const clearChat = async (req, res) => {
    const { groupId } = req.params;
    try {
        const group = await GroupModel.updateOne(
            { groupId },
            { $set: {
                messages: []
            }}
        );

        if (group.nModified === 0) {
            return res.json({ message: "Group not found or no messages to clear" });
        }

        res.json({ message: "Messages cleared successfully" });
    } catch (error) {
        res.json({ message: "Failed to clear messages" });
    }
}

const getAllUsers = async (req, res) => {
    const { groupId } = req.params;

    const query = [];
    const matchStage = {};
    matchStage.groupId = groupId;

    query.push({$match : matchStage});

    query.push({
        $lookup: {
            from: "users",
            localField: "members",
            foreignField: "userId",
            as: "Group_data",
        },
    });

    const findGroup = await GroupModel.aggregate(query);
    if(!findGroup)
    {
        res.json("Group Not found");
    }
    res.json({groupData : findGroup[0]});
};

module.exports = { getGroups, createGroup, joinGroup, getGroup, updateGroup, deleteGroup, clearChat, getAllUsers };
