import { extractText, getDocumentProxy } from "unpdf";

import { AppError, MAX_RESUME_TEXT_LENGTH } from "../utils.js";

export async function extractResumeText(pdfBuffer) {
  try {
    const pdf = await getDocumentProxy(new Uint8Array(pdfBuffer));
    const { text } = await extractText(pdf, { mergePages: true });
    const resumeText = typeof text === "string" ? text : "";

    if (!resumeText.trim()) {
      throw new AppError(
        422,
        "No readable text was found in the PDF. Scanned image resumes are not supported yet; try a text-based PDF."
      );
    }

    return resumeText.replace(/\s+/g, " ").trim().slice(0, MAX_RESUME_TEXT_LENGTH);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(422, "The PDF could not be parsed as text.");
  }
}
