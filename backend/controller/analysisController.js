import { asyncHandler } from "../utils.js";
import { saveAnalysis } from "../service/analysisService.js";

export const createAnalysis = asyncHandler(async (request, response) => {
  const analysis = await saveAnalysis({
    file: request.file,
    jobDescription: request.body.jobDescription,
  });

  response.status(202).json({
    id: analysis.id,
    status: analysis.status,
    fileName: analysis.resumeFileName,
    createdAt: analysis.createdAt,
  });
});
