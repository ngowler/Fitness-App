/**
 * @interface ApiResponse
 * @description Represents a standardized API response structure for consistent formatting across all API endpoints.
 * 
 * @openapi
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Indicates whether the operation was successful ('success' or 'error')
 *         data:
 *           type: object
 *           nullable: true
 *           description: Optional payload returned upon a successful operation
 *         message:
 *           type: string
 *           nullable: true
 *           description: Informational message about the operation result
 *         error:
 *           type: string
 *           nullable: true
 *           description: Error message, provided in case of a failure
 *         code:
 *           type: string
 *           nullable: true
 *           description: Optional error code for client-side error handling
 *
 * @template T - The type of data being returned in the response
 * @property status - Indicates whether the operation was successful ('success' or 'error')
 * @property data - Optional payload returned upon a successful operation
 * @property message - Informational message about the operation result
 * @property error - Error message, provided in case of a failure
 * @property code - Optional error code for client-side error handling
 */
interface ApiResponse<T> {
    status: string;
    data?: T;
    message?: string;
    error?: string;
    code?: string;
}

/**
 * @function successResponse
 * @description Creates a standardized success response object to ensure consistent success response formatting.
 * 
 * @openapi
 * components:
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Indicates if the operation was successful ('success')
 *         data:
 *           type: object
 *           nullable: true
 *           description: Optional payload returned on successful operations
 *         message:
 *           type: string
 *           nullable: true
 *           description: Optional success message
 * @template T - The type of data being returned
 * @param data - Optional payload to be returned to the client
 * @param message - Optional success message
 * @returns {ApiResponse<T>} A properly formatted success response object
 */
export const successResponse = <T>(
    data?: T,
    message?: string
): ApiResponse<T> => ({
    status: "success",
    data,
    message,
});

/**
 * @function errorResponse
 * @description Creates a standardized error response object to ensure consistent error response formatting.
 * 
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Indicates that the operation failed ('error')
 *         message:
 *           type: string
 *           description: Error message describing what went wrong
 *         code:
 *           type: string
 *           nullable: true
 *           description: Optional error code for client-side error handling
 * 
 * @param message - Error message describing what went wrong
 * @param code - Optional error code for client-side error handling
 * @returns {ApiResponse<null>} A properly formatted error response object
 */
export const errorResponse = (
    message: string,
    code?: string
): ApiResponse<null> => ({
    status: "error",
    message,
    code,
});
