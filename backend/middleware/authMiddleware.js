import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

if (! JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;       

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authorization header missing or malformed"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select("-password");   
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }   
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token" 
        });
    }
};

export default authMiddleware; 