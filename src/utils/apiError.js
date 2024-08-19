/**
 * Custom error class for API related errors.
 * Extends the built-in Error class.
 *
 * @class ApiError
 * @extends {Error}
 */
class ApiError extends Error {
    /**
     * Creates an instance of ApiError.
     *
     * @param {number} statusCode - The HTTP status code associated with the error.
     * @param {string} [message="Something went wrong"] - A custom error message.
     * @param {Array} [error=[]] - An array of error details.
     * @param {string} [stack=""] - The stack trace of the error. If not provided, it will be automatically generated.
     *
     * @memberof ApiError
     */
    constructor(
        statusCode ,
        message="Something  went wrong",
        error = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.error = error;
        if(stack.length){
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }