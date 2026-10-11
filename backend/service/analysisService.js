import Analysis from "../models/Analysis.js";
import { connectDatabase } from "../config/database.js";
import { AppError, isPdfBuffer, MAX_JOB_DESCRIPTION_LENGTH } from "../utils.js";
import { scoreResumeAgainstJob } from "./labdService.js";
import { extractResumeText } from "./pdfService.js";

export async function saveAnalysis({ file, jobDescription }) {
  if (!file) {
    throw new AppError(400, "A resume PDF is required.");
  }
  if (!isPdfBuffer(file.buffer)) {
    throw new AppError(400, "The uploaded file is not a valid PDF.");
  }
  if (file.originalname.length > 255) {
    throw new AppError(400, "Resume filename must be 255 characters or fewer.");
  }

  const normalizedJobDescription =
    typeof jobDescription === "string" ? jobDescription.trim() : "";
  if (!normalizedJobDescription) {
    throw new AppError(400, "A job description is required.");
  }
  if (normalizedJobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
    throw new AppError(
      400,
      `Job description must be ${MAX_JOB_DESCRIPTION_LENGTH} characters or fewer.`
    );
  }

  const resumeText = await extractResumeText(file.buffer);
  await connectDatabase();

  const analysis = await Analysis.create({
    resumeFileName: file.originalname,
    resumeFileSize: file.size,
    resumePdf: file.buffer,
    jobDescription: normalizedJobDescription,
  });

  try {
    const result = await scoreResumeAgainstJob({
      resumeText,
      jobDescription: normalizedJobDescription,
    });

    analysis.score = result.score;
    analysis.matchedSkills = result.matchedSkills;
    analysis.missingSkills = result.missingSkills;
    analysis.status = "scored";
    return await analysis.save();
  } catch (error) {
    analysis.status = "scoring_error";
    try {
      await analysis.save();
    } catch (persistenceError) {
      console.error("Could not save the failed scoring status:", persistenceError);
    }
    throw error;
  }
}
