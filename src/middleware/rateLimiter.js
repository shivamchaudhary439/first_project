const client = require("../../redis");
const constant = require("../../constant")
const rateLimiter = async (req, res, next) => {
    const key = `rate-limit:${req.ip}`;
    const count = await client.incr(key);
    if (count <= 10) {
        await client.expire(key, 6);
    } if (count > 10) {
        return res.status(constant.STATUS_CODES.TOO_MANY_REQUESTS).json({
            message: constant.MESSAGES.TOO_MANY_REQUESTS,
            status: constant.STATUS_CODES.STATUS_FALSE
        });
    }
    next();
};
module.exports = rateLimiter;
