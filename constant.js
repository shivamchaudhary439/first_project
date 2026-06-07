const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
};
const STATUS_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    TOO_MANY_REQUESTS: 429,
    STATUS_TRUE: true,
    STATUS_FALSE: false
};
const MESSAGES = {
    SUCCESS: "Success",
    CREATED: "Created successfully",
    BAD_REQUEST: "Bad request",
    UNAUTHORIZED: "Unauthorized access",
    SERVER_ERROR: "Internal server error",
    EMAIL_EXITS: "Email already exists",
    INVALID_DETAILS: "Invalid credentials",
    TOO_MANY_REQUESTS: "Too many requests"
};

module.exports = { USER_ROLES, STATUS_CODES, MESSAGES }