import express from 'express';
import  authMiddleware from '../middleware/authMiddleware.js';
import { createResult, listResults } from '../controller/resultController.js';

const resultsRouter = express.Router();

resultsRouter.post('/', authMiddleware, createResult);
resultsRouter.get('/', authMiddleware, listResults);

export default resultsRouter;