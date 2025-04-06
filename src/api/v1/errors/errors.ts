import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Class representing a repository error.
 * Extends the built-in Error class to include an error code.
 */
export class RepositoryError extends Error {
    code: string;
    statusCode: number;

    /**
     * Creates a new RepositoryError instance.
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {number} code - The the http response code.
     */
    constructor(
        message: string,
        code: string,
        statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
    ) {
        super(message);
        this.name = "RepositoryError";
        this.code = code;
        this.statusCode = statusCode;
    }
}

/**
 * Class representing a service error.
 * Extends the built-in Error class to include an error code.
 */
export class ServiceError extends Error {
    code: string;
    statusCode: number;

    /**
     * Creates a new ServiceError instance.
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {number} code - The the http response code.
     */
    constructor(
        message: string,
        code: string,
        statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
    ) {
        super(message);
        this.name = "ServiceError";
        this.code = code;
        this.statusCode = statusCode;
    }
}

/**
 * Class representing a validation error.
 * Extends the built-in Error class to include an error code.
 */
export class ValidationError extends Error {
    code: string;
    statusCode: number;

    /**
     * Creates a new ValidationError instance.
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {number} code - The the http response code.
     */
    constructor(
        message: string,
        code: string,
        statusCode: number = HTTP_STATUS.BAD_REQUEST
    ) {
        super(message);
        this.name = "ValidationError";
        this.code = code;
        this.statusCode = statusCode;
    }
}

/**
 * Class representing an environment configuration error.
 * Extends the built-in Error class to include an error code.
 */
export class EnvironmentConfigurationError extends Error {
    code: string;
    statusCode: number;

    /**
     * Creates a new EnvironmentConfigurationError instance.
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {number} code - The the http response code.
     */
    constructor(
        message: string,
        code: string,
        statusCode: number = HTTP_STATUS.BAD_REQUEST
    ) {
        super(message);
        this.name = "EnvironmentConfigurationError";
        this.code = code;
        this.statusCode = statusCode;
    }
}

/**
 * Class representing an cors error.
 * Extends the built-in Error class to include an error code.
 */
export class CorsError extends Error {
    code: string;
    statusCode: number;

    /**
     * Creates a new CorsError instance.
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {number} code - The the http response code.
     */
    constructor(
        message: string,
        code: string,
        statusCode: number = HTTP_STATUS.FORBIDDEN
    ) {
        super(message);
        this.name = "CorsError";
        this.code = code;
        this.statusCode = statusCode;
    }
}

/**
 * Class representing an authentication error.
 * Extends the built-in Error class to include an error code and status code.
 */
export class AuthenticationError extends Error {
    code: string;
    statusCode: number;

    /**
     * Creates a new AuthenticationError instance.
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {number} statusCode - The HTTP response code.
     */
    constructor(
        message: string,
        code: string = "AUTHENTICATION_ERROR",
        statusCode: number = HTTP_STATUS.UNAUTHORIZED
    ) {
        super(message);
        this.name = "AuthenticationError";
        this.code = code;
        this.statusCode = statusCode;
    }
}

/**
 * Class representing an authorization error.
 * Extends the built-in Error class to include an error code and status code.
 */
export class AuthorizationError extends Error {
    code: string;
    statusCode: number;

    /**
     * Creates a new AuthorizationError instance.
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {number} statusCode - The HTTP response code.
     */
    constructor(
        message: string,
        code: string = "AUTHORIZATION_ERROR",
        statusCode: number = HTTP_STATUS.FORBIDDEN
    ) {
        super(message);
        this.name = "AuthorizationError";
        this.code = code;
        this.statusCode = statusCode;
    }
}
