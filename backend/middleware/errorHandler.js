import multer from "multer";

export function notFoundHandler(_request, response) {
  response.status(404).json({ error: "Endpoint not found." });
}

export function errorHandler(error, _request, response, _next) {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "File is over 5 MB. Try a smaller PDF."
        : "Upload one PDF resume at a time.";
    return response.status(400).json({ error: message });
  }

  if (error.statusCode) {
    return response.status(error.statusCode).json({ error: error.message });
  }

  console.error("Request failed:", error);
  response.status(500).json({ error: "The request could not be processed." });
}
