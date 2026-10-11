export const MAX_RESUME_SIZE = 5 * 1024 * 1024;
export const MAX_JOB_DESCRIPTION_LENGTH = 10000;

export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function isPdfBuffer(buffer) {
  return Buffer.isBuffer(buffer) && buffer.subarray(0, 5).equals(Buffer.from("%PDF-"));
}

export function asyncHandler(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}
