import mongoose from "mongoose";

import { MAX_JOB_DESCRIPTION_LENGTH, MAX_RESUME_SIZE } from "../utils.js";

const analysisSchema = new mongoose.Schema(
  {
    resumeFileName: {
      type: String,
      required: true,
      maxlength: 255,
    },
    resumeFileSize: {
      type: Number,
      required: true,
      min: 1,
      max: MAX_RESUME_SIZE,
    },
    resumePdf: {
      type: Buffer,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
      maxlength: MAX_JOB_DESCRIPTION_LENGTH,
    },
    status: {
      type: String,
      enum: ["queued", "scored", "scoring_error"],
      default: "queued",
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    matchedSkills: {
      type: [String],
    },
    missingSkills: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
