/**
 * Standardized API response utilities
 */

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: any;
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
}

/**
 * Success response helper
 */
export const successResponse = <T = any>(
  data: T,
  message?: string,
  meta?: any,
): SuccessResponse<T> => {
  return {
    success: true,
    data,
    ...(message && { message }),
    ...(meta && { meta }),
  };
};

/**
 * Error response helper
 */
export const errorResponse = (
  message: string,
  code: string = "ERROR",
  details?: any,
): ErrorResponse => {
  return {
    success: false,
    error: {
      message,
      code,
      ...(details && { details }),
    },
  };
};

/**
 * Pagination metadata helper
 */
export const paginationMeta = (page: number, limit: number, total: number) => {
  return {
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};
