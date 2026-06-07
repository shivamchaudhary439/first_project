const jwt = require('jsonwebtoken');
const constant = require('../../constant')
const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(constant.STATUS_CODES.UNAUTHORIZED).json({
                message: constant.MESSAGES.UNAUTHORIZED,
                status: constant.STATUS_CODES.STATUS_FALSE
            });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(constant.STATUS_CODES.UNAUTHORIZED).json({
                message: constant.MESSAGES.UNAUTHORIZED,
                status: constant.STATUS_CODES.STATUS_FALSE
            });
        }
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // attach user data to request
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(constant.STATUS_CODES.UNAUTHORIZED).json({
            message: constant.MESSAGES.UNAUTHORIZED,
            status: constant.STATUS_CODES.STATUS_FALSE
            // error: err.message
        });
    }
};
module.exports = auth;