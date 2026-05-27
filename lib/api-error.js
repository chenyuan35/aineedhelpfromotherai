// lib/api-error.js — Standard API Error Response Format (v2 AI Interface)
// Unified error responses across all endpoints
// Human format: { error: code, message, hint?, status_code }
// AI format: { error, message, status_code, severity, suggested_action, recoverable, retry_after_seconds?, details? }

// Error severity levels for AI decision-making
const SEVERITY = Object.freeze({
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
});

// Suggested actions for AI agents on error
const SUGGESTED_ACTION = Object.freeze({
  RETRY: 'retry',
  RETRY_BACKOFF: 'retry_with_backoff',
  FALLBACK: 'use_fallback',
  ESCALATE: 'escalate_to_human',
  ABORT: 'abort',
  VERIFY_INPUT: 'verify_input',
});

// Error metadata: maps error codes to AI-readable metadata
const ERROR_METADATA = Object.freeze({
  bad_request: { severity: SEVERITY.WARNING, suggested_action: SUGGESTED_ACTION.VERIFY_INPUT, recoverable: true },
  unauthorized: { severity: SEVERITY.WARNING, suggested_action: SUGGESTED_ACTION.ESCALATE, recoverable: false },
  forbidden: { severity: SEVERITY.WARNING, suggested_action: SUGGESTED_ACTION.ABORT, recoverable: false },
  not_found: { severity: SEVERITY.WARNING, suggested_action: SUGGESTED_ACTION.VERIFY_INPUT, recoverable: true },
  conflict: { severity: SEVERITY.WARNING, suggested_action: SUGGESTED_ACTION.RETRY, recoverable: true },
  unprocessable_entity: { severity: SEVERITY.WARNING, suggested_action: SUGGESTED_ACTION.VERIFY_INPUT, recoverable: true },
  rate_limited: { severity: SEVERITY.WARNING, suggested_action: SUGGESTED_ACTION.RETRY_BACKOFF, recoverable: true },
  internal_error: { severity: SEVERITY.ERROR, suggested_action: SUGGESTED_ACTION.RETRY_BACKOFF, recoverable: true },
  service_unavailable: { severity: SEVERITY.CRITICAL, suggested_action: SUGGESTED_ACTION.RETRY_BACKOFF, recoverable: true },
  db_unavailable: { severity: SEVERITY.CRITICAL, suggested_action: SUGGESTED_ACTION.FALLBACK, recoverable: true },
  // MCP tool-specific errors (dynamically resolved)
  tool_failure: { severity: SEVERITY.ERROR, suggested_action: SUGGESTED_ACTION.RETRY, recoverable: true },
  timeout: { severity: SEVERITY.ERROR, suggested_action: SUGGESTED_ACTION.RETRY_BACKOFF, recoverable: true },
  invalid_schema: { severity: SEVERITY.WARNING, suggested_action: SUGGESTED_ACTION.VERIFY_INPUT, recoverable: false },
});

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
  
  // MCP Tool Errors
  TOOL_FAILURE: 'tool_failure',
  TIMEOUT: 'timeout',
  INVALID_SCHEMA: 'invalid_schema',
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

// Create error response (v2: includes AI-facing metadata)
function createErrorResponse(errorCode, message, hint = null) {
  const meta = ERROR_METADATA[errorCode] || { severity: SEVERITY.ERROR, suggested_action: SUGGESTED_ACTION.RETRY, recoverable: true };
  const response = {
    error: errorCode,
    message,
    status_code: getStatusCodeForError(errorCode),
    severity: meta.severity,
    suggested_action: meta.suggested_action,
    recoverable: meta.recoverable,
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
  SEVERITY,
  SUGGESTED_ACTION,
  ERROR_METADATA,
  createErrorResponse,
  getStatusCodeForError,
  sendError,
  sendRateLimitError,
  sendValidationError,
};
