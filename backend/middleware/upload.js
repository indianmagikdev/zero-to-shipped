import multer from "multer";

import { AppError, MAX_RESUME_SIZE } from "../utils.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_RESUME_SIZE,
    files: 1,
    fields: 1,
    fieldSize: 10000,
    parts: 2,
  },
  fileFilter(_request, file, callback) {
    const isPdf =
      file.mimetype === "application/pdf" && file.originalname.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return callback(new AppError(400, "Resume must be a PDF file."));
    }
    callback(null, true);
  },
});

export default upload;
