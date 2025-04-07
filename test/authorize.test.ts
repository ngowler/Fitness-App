import { Request, Response } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/errors";
import { MiddlewareFunction } from "src/api/v1/types/expressTypes";


describe("isAuthorized middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            params: {},
        };
        mockResponse = {
            locals: {},
        };
        nextFunction = jest.fn();
    });

    it("should call next() when user has required role", () => {
        mockResponse.locals = {
            uid: "user123",
            role: "admin",
        };

        const middleware: MiddlewareFunction = isAuthorized({ hasRole: ["admin", "trainer"] });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalled();
    });

    it("should call next() when same user and allowSameUser is true", () => {
        mockRequest.params = { id: "user123" };
        mockResponse.locals = {
            uid: "user123",
            role: "lite",
        };

        const middleware: MiddlewareFunction = isAuthorized({
            hasRole: ["admin"],
            allowSameUser: true,
        });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalled();
    });

    it("should call next() with AuthorizationError when no role is found in locals", () => {
        mockResponse.locals = {
            uid: "user123",
        };

        const middleware: MiddlewareFunction = isAuthorized({ hasRole: ["premium"] });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            new AuthorizationError("Forbidden: No role found", "ROLE_NOT_FOUND")
        );
    });

    it("should call next() with AuthorizationError when user does not have a sufficient role", () => {
        mockResponse.locals = {
            uid: "user123",
            role: "lite",
        };

        const middleware: MiddlewareFunction = isAuthorized({ hasRole: ["admin", "trainer"] });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            new AuthorizationError("Forbidden: Insufficient role", "INSUFFICIENT_ROLE")
        );
    });

    it("should call next() when allowSameUser is true and user ID does not match", () => {
        mockRequest.params = { id: "user456" };
        mockResponse.locals = {
            uid: "user123",
            role: "lite",
        };

        const middleware: MiddlewareFunction = isAuthorized({
            hasRole: ["admin"],
            allowSameUser: true,
        });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            new AuthorizationError("Forbidden: Insufficient role", "INSUFFICIENT_ROLE")
        );
    });

    it("should handle missing uid in request params gracefully", () => {
        mockRequest.params = {};
        mockResponse.locals = {
            uid: "user123",
            role: "trainer",
        };

        const middleware: MiddlewareFunction = isAuthorized({ hasRole: ["premium"], allowSameUser: true });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            new AuthorizationError("Forbidden: Insufficient role", "INSUFFICIENT_ROLE")
        );
    });

    it("should call next() when no roles are specified and allowSameUser is true with matching uid", () => {
        mockRequest.params = { id: "user123" };
        mockResponse.locals = {
            uid: "user123",
        };

        const middleware: MiddlewareFunction = isAuthorized({ allowSameUser: true, hasRole: [] });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalled();
    });
});
