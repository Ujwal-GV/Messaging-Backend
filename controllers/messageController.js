const GroupModel = require("../models/GroupProject");

const sendMessage = async (req, res) => {
    const { groupId, sender, content } = req.body;

    if (!groupId || !sender || !content) {
        return res.status(400).json({ message: "groupId, sender, and content are required" });
    }

    try {
        const group = await GroupModel.findOne({ groupId });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const message = { sender, content, timestamp: new Date() };
        group.messages.push(message);
        await group.save();

        res.status(200).json({ message: "Message sent successfully", message });
    } catch (error) {
        res.status(500).json({ message: "Error sending message" });
    }
};

module.exports = { sendMessage };


module.exports = { sendMessage };
