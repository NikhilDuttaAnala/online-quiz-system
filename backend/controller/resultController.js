import Result from '../models/resultModel.js';

export const createResult = async (req, res) => {
    try {
        if(!req.user || !req.user._id) {
            return res.status(401).json({
                success: false, 
                message: "Not authorized" 
            });
        }

        const {title, technology, level, totalQuestions, correct, wrong} = req.body;
        if(!technology || !level || totalQuestions === undefined || correct === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        const computedWrong = wrong !== undefined ? Number(wrong) : Math.max(0,Number(totalQuestions) - Number(correct));

        if(!title){
            return res.status(400).json({ 
                success: false,
                message: "Title is required" 
            });
        }

        const payload = {
            user: req.user._id,
            title : String(title).trim(),  
            technology,
            level,
            totalQuestions: Number(totalQuestions),
            correct: Number(correct),
            wrong: computedWrong,
        };

        const createdResult = await Result.create(payload);
        return res.status(201).json({ 
            success: true, 
            message: "Result created successfully", 
            result: createdResult 
        });
    } catch (error) {
        console.error("Error creating result:", error);
        return res.status(500).json({  
            success: false, 
            message: "Server Error" 
        });
    }
};

export const listResults = async (req, res) => {
    try {
        if(!req.user || !req.user._id) {
            return res.status(401).json({ 
                success: false,
                message: "Not authorized" 
            });
        }

        const {technology} = req.query;

        const query= { user: req.user._id };
        if(technology && technology.toLowerCase() !== "all") {
            query.technology = technology;
        }

        const items = await Result.find(query).sort({ createdAt: -1 }).lean();
        return res.status(200).json({ 
            success: true, 
            results : items
        });
    }   catch (error) {         
        console.error("Error listing results:", error);
        return res.status(500).json({  
            success: false, 
            message: "Server Error" 
        });
    }   
};
