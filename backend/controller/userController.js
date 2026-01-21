import mongoose from "mongoose";
import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const TOKEN_EXPIRY_HOURS = '1h';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

//Register User
export const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }


        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }

        const newId = new mongoose.Types.ObjectId();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            _id: newId,
            name: validator.trim(name),
            email: validator.normalizeEmail(email),
            password: hashedPassword,
        });

        await newUser.save();

        if (!JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT Secret is not defined"
            });
        }

        const token = jwt.sign({ id: newUser._id.toString() }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY_HOURS });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

//Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;       
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }   

        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(400).json({           
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);  
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT Secret is not defined"
            });
        }

        const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY_HOURS });

        return res.status(200).json({       
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({           
            success: false,
            message: "Server error"
        });
    }
};