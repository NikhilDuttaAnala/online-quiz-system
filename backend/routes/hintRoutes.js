import express from 'express';
import { generateHint, generateExplanation } from '../controller/hintController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const hintRouter = express.Router();

// ROUTES
hintRouter.post('/generate-hint', authMiddleware, generateHint); //  GET HINT
hintRouter.post('/generate-explanation', authMiddleware, generateExplanation); //  GET EXPLANATION

export default hintRouter;