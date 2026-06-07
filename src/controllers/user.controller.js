const console = require('node:console');
const connection = require('../config/db');
const bcrypt = require('bcrypt');
const constant = require('../../constant')
const userService = require('../services/user.service')

const register = async (req, res, next) => {
    try {
        const result = await userService.createUser(req.body);
        if (result === constant.MESSAGES.EMAIL_EXITS) {
            res.status(constant.STATUS_CODES.SUCCESS).json({
                status: constant.STATUS_CODES.STATUS_FALSE,
                message: constant.MESSAGES.EMAIL_EXITS
            });
        } else {
            res.status(constant.STATUS_CODES.CREATED).json({
                status: constant.STATUS_CODES.STATUS_TRUE,
                message: constant.MESSAGES.SUCCESS,
                data: result
            });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(constant.STATUS_CODES.SERVER_ERROR).json({
            message: constant.MESSAGES.SERVER_ERROR,
            error: err.message
        });
    }
};

const login = async (req, res) => {
    try {
        const result = await userService.userLogin(req.body);
        const { user, token } = result;
        if (result === constant.STATUS_CODES.UNAUTHORIZED) {
            res.status(result).json({
                status: constant.STATUS_CODES.STATUS_FALSE,
                message: constant.MESSAGES.INVALID_DETAILS,
            });
        }
        res.status(constant.STATUS_CODES.SUCCESS).json({
            status: constant.STATUS_CODES.STATUS_TRUE,
            message: constant.MESSAGES.SUCCESS,
            data: {
                ...user,
                token
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(constant.STATUS_CODES.SERVER_ERROR).json({
            message: constant.MESSAGES.SERVER_ERROR,
            error: err.message
        });
    }
};

const profile = async (req, res) => {
    try {
        const result = await userService.userProfile(req.body);
        if (result) {
            return res.status(constant.STATUS_CODES.SUCCESS).json({
                message: constant.MESSAGES.SUCCESS,
                status: constant.STATUS_CODES.STATUS_TRUE,
                data: result
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(constant.STATUS_CODES.SERVER_ERROR).json({
            message: constant.MESSAGES.SERVER_ERROR,
            error: err.message
        });
    }
};

const sentOtp = async (req, res) => {
    try {
        const result = await userService.sentOtpService(req.body);
        if (result) {
            return res.status(constant.STATUS_CODES.SUCCESS).json({
                message: constant.MESSAGES.SUCCESS,
                status: constant.STATUS_CODES.STATUS_TRUE,
                data: result
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(constant.STATUS_CODES.SERVER_ERROR).json({
            message: constant.MESSAGES.SERVER_ERROR,
            error: err.message
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const result = await userService.verifyOtpService(req.body);
        if (result === "OTP expired" || result === "Invalid OTP") {
            return res.status(constant.STATUS_CODES.UNAUTHORIZED).json({
                message: constant.MESSAGES.UNAUTHORIZED,
                status: constant.STATUS_CODES.STATUS_FALSE,
                data: result
            });
        } else {
            return res.status(constant.STATUS_CODES.SUCCESS).json({
                message: constant.MESSAGES.SUCCESS,
                status: constant.STATUS_CODES.STATUS_TRUE,
                data: result
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(constant.STATUS_CODES.SERVER_ERROR).json({
            message: constant.MESSAGES.SERVER_ERROR,
            error: err.message
        });
    }
};

module.exports = { register, login, profile, sentOtp, verifyOtp };