// lib/api-error.js — Standard API Error Response Format
// Unified error responses across all endpoints
// Format: { error: code, message, hint?, status_code }

// Standard error codes
const ERROR_CODES = Object.freeze({
  // 4xx Client Errors
  BAD_REQUEST: 'bad_request',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  CONFLICT: 'conflict',
  UNPROCESSABLE_ENTITY: 'unprocessable_entity',
  RATE_LIMITED: 'rate_limited',
  
  // 5xx Server Errors
  INTERNAL_ERROR: 'internal_error',
  SERVICE_UNAVAILABLE: 'service_unavailable',
  DB_UNAVAILABLE: 'db_unavailable',
});

// Standard HTTP status codes
const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
});

// Create error response
function createErrorResponse(errorCode, message, hint = null) {
  const response = {
    error: errorCode,
    message,
    status_code: getStatusCodeForError(errorCode)
  };
  if (hint) response.hint = hint;
  return response;
}

// Get HTTP status code for error code
function getStatusCodeForError(errorCode) {
  const mapping = {
    [ERROR_CODES.BAD_REQUEST]: HTTP_STATUS.BAD_REQUEST,
    [ERROR_CODES.UNAUTHORIZED]: HTTP_STATUS.UNAUTHORIZED,
    [ERROR_CODES.FORBIDDEN]: HTTP_STATUS.FORBIDDEN,
    [ERROR_CODES.NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
    [ERROR_CODES.CONFLICT]: HTTP_STATUS.CONFLICT,
    [ERROR_CODES.UNPROCESSABLE_ENTITY]: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    [ERROR_CODES.RATE_LIMITED]: HTTP_STATUS.RATE_LIMITED,
    [ERROR_CODES.INTERNAL_ERROR]: HTTP_STATUS.INTERNAL_ERROR,
    [ERROR_CODES.SERVICE_UNAVAILABLE]: HTTP_STATUS.SERVICE_UNAVAILABLE,
    [ERROR_CODES.DB_UNAVAILABLE]: HTTP_STATUS.SERVICE_UNAVAILABLE,
  };
  return mapping[errorCode] || HTTP_STATUS.INTERNAL_ERROR;
}

// Send error response
function sendError(res, errorCode, message, hint = null) {
  const statusCode = getStatusCodeForError(errorCode);
  const body = createErrorResponse(errorCode, message, hint);
  return res.status(statusCode).json(body);
}

// For rate limiting with retry-after
function sendRateLimitError(res, message, resetAtMs) {
  const retryAfterSeconds = Math.ceil((resetAtMs - Date.now()) / 1000);
  const body = {
    error: ERROR_CODES.RATE_LIMITED,
    message,
    status_code: HTTP_STATUS.RATE_LIMITED,
    retry_after_seconds: retryAfterSeconds
  };
  return res.status(HTTP_STATUS.RATE_LIMITED).json(body);
}

// For validation errors with additional context
function sendValidationError(res, message, details = null, hint = null) {
  const body = {
    error: ERROR_CODES.UNPROCESSABLE_ENTITY,
    message,
    status_code: HTTP_STATUS.UNPROCESSABLE_ENTITY
  };
  if (details) body.details = details;
  if (hint) body.hint = hint;
  return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(body);
}

module.exports = {
  ERROR_CODES,
  HTTP_STATUS,
  createErrorResponse,
  getStatusCodeForError,
  sendError,
  sendRateLimitError,
  sendValidationError,
};
