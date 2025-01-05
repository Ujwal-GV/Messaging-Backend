const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const user = new UserModel({ userId, name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.userId, email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUserName = async(req, res) => {
    const { userId } = req.params;

    const user = await UserModel.findOne({ userId: userId });
    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const { name } = user;
    res.status(200).json({ message: 'User info retrieved', user: user });
}

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.userId; // The user ID from the decoded token
        const user = await UserModel.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the user information (excluding password)
        const { name, email, userId: id } = user;
        res.status(200).json({ message: 'User info retrieved', user: { name, email, userId: id } });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    const { userId } = req.params;
    
    const { name, description } = req.body;    

    try {
        const image = req.file ? req.file.path : '';

        const updatedData = {
            name, image, description,
        };

        const updatedUser = await UserModel.findOneAndUpdate(
            { userId: userId },
            updatedData,
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User details updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error });
    }
};

module.exports = { registerUser, loginUser, getCurrentUser, getUserName, updateUser };
