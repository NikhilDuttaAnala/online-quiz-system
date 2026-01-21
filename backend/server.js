import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import resultsRouter from "./routes/resultsRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//database connection
connectDB();

//routes

app.use("/api/auth", userRouter);
app.use("/api/results", resultsRouter);

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});