import axios from "axios";
import { toast } from "sonner";

// Extend Axios config to support custom toast control
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    showSuccessToast?: boolean;
  }
}

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for global error handling and toast notifications
api.interceptors.response.use(
  (response) => {
    // Show success toast ONLY if explicitly requested via config
    // This prevents unwanted toasts during pagination, infinite scroll, etc.
    if (
      response.config?.showSuccessToast &&
      response.data?.success &&
      response.data?.message
    ) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    // Extract error details from response
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "Something went wrong";
    const errorCode = error.response?.data?.error?.code;
    const statusCode = error.response?.status;

    console.error("[API Error]", {
      message: errorMessage,
      code: errorCode,
      status: statusCode,
      url: error.config?.url,
    });

    // Handle specific error codes
    switch (errorCode) {
      case "AUTH_ERROR":
      case "TOKEN_EXPIRED":
        break;

      case "FREE_LIMIT_REACHED":
        toast.error(errorMessage, {
          duration: 6000,
          action: {
            label: "Upgrade",
            onClick: () => (window.location.href = "/subscription"),
          },
        });
        break;

      case "VALIDATION_ERROR":
        toast.error(errorMessage, {
          duration: 4000,
        });
        break;

      case "CONFLICT":
        toast.warning(errorMessage, {
          duration: 4000,
        });
        break;

      case "RATE_LIMIT":
        toast.error("Too many requests. Please try again later.", {
          duration: 5000,
        });
        break;

      case "EXTERNAL_SERVICE_ERROR":
        toast.error(`External service error: ${errorMessage}`, {
          duration: 5000,
        });
        break;

      case "NOT_FOUND":
      case "ROUTE_NOT_FOUND":
        toast.error(errorMessage || "Resource not found", {
          duration: 4000,
        });
        break;

      default:
        // Handle by status code if no error code
        if (statusCode === 401) {
          toast.error("Authentication required", {
            duration: 4000,
          });
        } else if (statusCode === 403) {
          toast.error("Access denied", {
            duration: 4000,
          });
        } else if (statusCode === 404) {
          toast.error("Resource not found", {
            duration: 4000,
          });
        } else if (statusCode === 500) {
          toast.error("Server error. Please try again later.", {
            duration: 4000,
          });
        } else if (statusCode >= 500) {
          toast.error("Server error. Please try again later.", {
            duration: 4000,
          });
        } else {
          // Generic error
          toast.error(errorMessage, {
            duration: 4000,
          });
        }
        break;
    }

    return Promise.reject(error);
  },
);

// Request interceptor (optional - for adding auth tokens, etc.)
api.interceptors.request.use(
  (config) => {
    // You can add custom headers here if needed
    // For example, adding a custom API key or version header
    return config;
  },
  (error) => {
    toast.error("Request failed to send");
    return Promise.reject(error);
  },
);

export default api;

// Helper function for showing loading toast during async operations
export const withLoadingToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success?: string;
    error?: string;
  },
): Promise<T> => {
  // Show toast for the promise (fire and forget)
  toast.promise(promise, {
    loading: messages.loading,
    success: messages.success || "Success!",
    error: messages.error || "Operation failed",
  });

  // Return the original promise
  return promise;
};

// Example usage of withLoadingToast:
// await withLoadingToast(
//   api.post('/repositories/connect', data),
//   {
//     loading: 'Connecting repository...',
//     success: 'Repository connected!',
//     error: 'Failed to connect repository'
//   }
// );
