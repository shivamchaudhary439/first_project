const connection = require('../config/db');
const bcrypt = require('bcrypt');
const constant = require('../../constant');
const { resolve } = require('node:dns');
const { rejects } = require('node:assert');
const jwt = require('jsonwebtoken');
const client = require('../../redis')

const createUser = (userData) => {
    return new Promise(async (resolve, rejects) => {
        try {
            const { name, email, password } = userData;
            const hashedPassword = await bcrypt.hash(password, 10);
            const emailExist = await checkEmailDuplicacy(email)

            if (emailExist.length > 0) {
                return resolve(constant.MESSAGES.EMAIL_EXITS);
            }
            const sql = `INSERT INTO users (name, email , password) VALUES (?, ?, ?)`;
            const [result] = await connection.query(sql, [name, email, hashedPassword]);
            resolve({
                id: result.insertId,
                name,
                email
            });
        } catch (err) {
            reject(err);
        }
    });
};

const userLogin = (userData) => {
    return new Promise(async (resolve, rejects) => {
        try {
            const { email, password } = userData;
            const hashedPassword = await bcrypt.hash(password, 10);
            const emailExist = await checkEmailDuplicacy(email);
            if (!emailExist.length) {
                return resolve(constant.MESSAGES.INVALID_DETAILS);
            }
            else {
                const isMatch = await bcrypt.compare(password, emailExist[0].password);
                if (!isMatch) {
                    return resolve(constant.STATUS_CODES.UNAUTHORIZED).json({ message: constant.MESSAGES.INVALID_DETAILS });
                }
                const token = await generatedJWTToken(emailExist[0].id, emailExist[0].name, email);
                const user = emailExist[0];
                delete emailExist[0].password
                resolve({ user, token });
            }
        } catch (err) {
            rejects(err);
        }
    });
};

const userProfile = (userData, headers) => {
    return new Promise(async (resolve, rejects) => {
        try {
            const cached = await client.get("users");
            if (cached) {
                resolve(JSON.parse((cached)))
            }
            const sql = `select * from users`;
            const [rows] = await connection.query(sql);
            const users = await client.set("users", JSON.stringify(rows));
            resolve(rows)
        } catch (err) {
            rejects(err);
        }
    });
};

const sentOtpService = (userData) => {
    return new Promise(async (resolve, rejects) => {
        try {
            const { email } = userData
            const otp = Math.floor(100000 + Math.random() * 900000);
            const setOtp = await client.set(`otp:${email}`, otp, { EX: 300, NX: true });
            if (otp) {
                resolve(otp)
            }
        } catch (err) {
            rejects(err);
        }
    });
};

const verifyOtpService = (userData) => {
    return new Promise(async (resolve, rejects) => {
        try {
            const { email, otp } = userData
            const key = `otp:${email}`;
            const storedOtp = await client.get(key);
            if (!storedOtp) {
                resolve("OTP expired");
            }
            const checkOtp = Number(storedOtp)
            if (checkOtp !== otp) {
                resolve("Invalid OTP");
            }
            // OTP correct → delete it
            await client.del(key);
            resolve("OTP verified")
        } catch (err) {
            rejects(err);
        }
    });
};

function checkEmailDuplicacy(email) {
    return new Promise(async (resolve, rejects) => {
        try {
            const sql = `select * from users where email = ?`;
            const [rows] = await connection.execute(
                sql,
                [email]
            );
            resolve(rows);
        } catch (err) {
            reject(err);
        }
    });
};

function generatedJWTToken(id, name, email) {
    return new Promise(async (resolve, rejects) => {
        try {
            const userPayload = { id, name, email }
            const token = await jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
            resolve("Bearer " + token);
        } catch (err) {
            rejects(err)
        }
    })
}
module.exports = { createUser, userLogin, userProfile, sentOtpService, verifyOtpService };