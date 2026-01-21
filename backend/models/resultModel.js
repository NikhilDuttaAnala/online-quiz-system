import mongoose from "mongoose";

const performanceEnum=["excellent","good","average","needs work"];

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: "User",
    required: true, // like foreign key
  },
  title: {
    type: String,
    required: true,
    trim: true,
    },
    technology: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "html",
        "css",
        "js",
        "react",
        "node",
        "mongodb",
        "java",
        "python",
        "cpp",
        "bootstrap"
      ]
    },
    level: { type: String, required: true, enum: ["basic", "intermediate", "advanced"] },
    totalQuestions: { type: Number, required: true, min: 0 },
    correct: { type: Number, required: true, min: 0, default: 0 },
    wrong: { type: Number, required: true, min: 0, default: 0 },
    score: { type: Number, min: 0, max: 100, default: 0 },
    performance: { type: String, enum: performanceEnum, default: "needs work" },
  },
  { timestamps: true }
);
    
//compute score and performance before saving

resultSchema.pre("save", function () {
    const totalQuestions = Number(this.totalQuestions) || 0;
    const correct = Number(this.correct) || 0;

    this.score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

    if (this.score >= 85) {
        this.performance = "excellent";
    } else if (this.score >= 70) {
        this.performance = "good";
    } else if (this.score >= 50) {
        this.performance = "average";
    }               
    else {
        this.performance = "needs work";
    }

    if(this.wrong === null || this.wrong === undefined){
        this.wrong = Math.max(totalQuestions - correct, 0); 
    }

    // next();
});

export default mongoose.model("Result", resultSchema);