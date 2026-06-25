import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  technology: {
    type: String,
    required: true,
    enum: ["html", "css", "js", "react", "node", "mongodb", "java", "python", "cpp", "bootstrap"]
  },
  level: {
    type: String,
    required: true,
    enum: ["basic", "intermediate", "advanced"]
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  hint: {
    type: String,
    default: null,
    trim: true
  },
  explanation: {
    type: String,
    default: null,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);