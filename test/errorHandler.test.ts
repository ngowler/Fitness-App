import { Request, Response, NextFunction } from "express";
import { RepositoryError, ServiceError, ValidationError } from "../src/api/v1/errors/errors";
import errorHandler from "../src/api/v1/middleware/errorHandler";
import { errorResponse } from "../src/api/v1/models/responseModel";
import { HTTP_STATUS } from "../src/constants/httpConstants";

console.error = jest.fn();

describe("Error Handler Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it("should handle RepositoryError with custom status code and error code", () => {
        const testError: RepositoryError = new RepositoryError(
            "Document not found",
            "DOCUMENT_NOT_FOUND",
            404
        );

        errorHandler(
            testError,
            mockReq as Request,
            mockRes as Response,
            mockNext
        );

        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(
            errorResponse("Document not found", "DOCUMENT_NOT_FOUND")
        );
        expect(console.error).toHaveBeenCalledWith("Error: Document not found");
        expect(testError.name).toBe("RepositoryError");
        expect(testError).toBeInstanceOf(RepositoryError);
    });

    it("should handle ServiceError with custom status code and error code", () => {
        const testError: ServiceError = new ServiceError(
            "Invalid input",
            "INVALID_INPUT",
            400
        );

        errorHandler(
            testError,
            mockReq as Request,
            mockRes as Response,
            mockNext
        );

        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
            errorResponse("Invalid input", "INVALID_INPUT")
        );
        expect(console.error).toHaveBeenCalledWith("Error: Invalid input");
        expect(testError.name).toBe("ServiceError");
        expect(testError).toBeInstanceOf(ServiceError);
    });

    it("should handle ValidationError with custom status code and error code", () => {
        const testError: ValidationError = new ValidationError(
            "Invalid input",
            "INVALID_INPUT",
            400
        );

        errorHandler(
            testError,
            mockReq as Request,
            mockRes as Response,
            mockNext
        );

        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
            errorResponse("Invalid input", "INVALID_INPUT")
        );
        expect(console.error).toHaveBeenCalledWith("Error: Invalid input");
        expect(testError.name).toBe("ValidationError");
        expect(testError).toBeInstanceOf(ValidationError);
    });

    it("should handle basic Error object with default status and code", () => {
        const testError: Error = new Error("Basic error");

        errorHandler(
            testError,
            mockReq as Request,
            mockRes as Response,
            mockNext
        );

        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
        expect(console.error).toHaveBeenCalledWith("Error: Basic error");
    });

    it("should handle malformed Error objects", () => {
        const testError: Error = {} as Error;

        errorHandler(
            testError,
            mockReq as Request,
            mockRes as Response,
            mockNext
        );

        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
        expect(console.error).toHaveBeenCalledWith("Error: undefined");
    });

    it("should handle null errors", () => {
        const testError: Error | null = null;

        errorHandler(
            testError,
            mockReq as Request,
            mockRes as Response,
            mockNext
        );

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
        expect(console.error).toHaveBeenCalledWith(
            "Error: null or undefined error received"
        );
    });
});
