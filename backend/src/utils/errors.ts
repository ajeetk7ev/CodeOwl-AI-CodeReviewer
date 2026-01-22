// Custom error classes for better error handling

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code: string = "VALIDATION_ERROR") {
    super(message, 400, code);
  }
}

export class AuthenticationError extends AppError {
  constructor(
    message: string = "Not authenticated",
    code: string = "AUTH_ERROR",
  ) {
    super(message, 401, code);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Not authorized", code: string = "FORBIDDEN") {
    super(message, 403, code);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, code: string = "NOT_FOUND") {
    super(`${resource} not found`, 404, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code: string = "CONFLICT") {
    super(message, 409, code);
  }
}

export class RateLimitError extends AppError {
  constructor(
    message: string = "Too many requests",
    code: string = "RATE_LIMIT",
  ) {
    super(message, 429, code);
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    service: string,
    message?: string,
    code: string = "EXTERNAL_SERVICE_ERROR",
  ) {
    super(message || `${service} service error`, 503, code);
  }
}
