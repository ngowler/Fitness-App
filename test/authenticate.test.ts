import { Request, Response } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { auth } from "../config/firebaseConfig";
import { AuthenticationError } from "../src/api/v1/errors/errors";

jest.mock("../config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));

describe("authenticate middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            locals: {},
        };
        nextFunction = jest.fn();
    });

    it("should call next passing authenticationError when malformed token is provided", async () => {
        mockRequest.headers = {
            authorization: "Bearer ",
        };

        const expectedError: AuthenticationError = new AuthenticationError(
            "Unauthorized: No token provided",
            "TOKEN_NOT_FOUND"
        );

        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(expectedError);
    });

    it("should call next passing authenticationError when no token is provided", async () => {
        const expectedError: AuthenticationError = new AuthenticationError(
            "Unauthorized: No token provided",
            "TOKEN_NOT_FOUND"
        );
    
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );
    
        expect(nextFunction).toHaveBeenCalledWith(expectedError);
    });

    it("should call next() when token is valid", async () => {
        mockRequest.headers = {
            authorization: "Bearer mock-token",
        };

        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
            uid: "mock-uid",
            role: "user",
        });

        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(auth.verifyIdToken).toHaveBeenCalledWith("mock-token");
        expect(mockResponse.locals).toEqual({
            uid: "mock-uid",
            role: "user",
        });
        expect(nextFunction).toHaveBeenCalled();
    });
    
    it("should call next passing authenticationError when token is invalid", async () => {
        mockRequest.headers = {
            authorization: "Bearer invalid-token",
        };
    
        (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce({
            message: "Invalid token",
        });
    
        const expectedError: AuthenticationError = new AuthenticationError(
            "Unauthorized: Invalid token",
            "TOKEN_INVALID"
        );
    
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );
    
        expect(nextFunction).toHaveBeenCalledWith(expectedError);
    });

    it("should call next passing authenticationError when Authorization header is missing", async () => {
        const expectedError: AuthenticationError = new AuthenticationError(
            "Unauthorized: No token provided",
            "TOKEN_NOT_FOUND"
        );
    
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );
    
        expect(nextFunction).toHaveBeenCalledWith(expectedError);
    });

    it("should call next passing authenticationError when Firebase service is unavailable", async () => {
        mockRequest.headers = {
            authorization: "Bearer mock-token",
        };
    
        (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(new Error("Firebase service unavailable"));
    
        const expectedError: AuthenticationError = new AuthenticationError(
            "Unauthorized: Firebase service unavailable",
            "FIREBASE_ERROR"
        );
    
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );
    
        expect(nextFunction).toHaveBeenCalledWith(expectedError);
    });

    it("should set res.locals and call next() for valid tokens", async () => {
        mockRequest.headers = {
            authorization: "Bearer valid-token",
        };
    
        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
            uid: "valid-uid",
            role: "user",
        });
    
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );
    
        expect(auth.verifyIdToken).toHaveBeenCalledWith("valid-token");
        expect(mockResponse.locals).toEqual({
            uid: "valid-uid",
            role: "user",
        });
        expect(nextFunction).toHaveBeenCalled();
    });
});
