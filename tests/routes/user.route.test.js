const request = require('supertest');
const express = require('express');

const userController = require('../../src/controllers/user.controller');

jest.mock('../../src/controllers/user.controller');

jest.mock('../../src/middleware/auth.middleware', () =>
    (req, res, next) => next()
);

jest.mock('../../src/middleware/rateLimiter', () =>
    (req, res, next) => next()
);

const userRoutes = require('../../src/routes/user.routes');

const app = express();

app.use(express.json());
app.use('/', userRoutes);

describe('User Routes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET / should return server running', async () => {

        const response = await request(app)
            .get('/');

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Server Running');
    });

    test('POST /register', async () => {

        userController.register.mockImplementation(
            (req, res) => {
                res.status(201).json({
                    message: 'User Registered'
                });
            }
        );

        const response = await request(app)
            .post('/register')
            .send({
                name: 'Shivam',
                email: 'shivam@gmail.com',
                password: '123456'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message)
            .toBe('User Registered');
    });

    test('POST /login', async () => {

        userController.login.mockImplementation(
            (req, res) => {
                res.status(200).json({
                    token: 'jwt-token'
                });
            }
        );

        const response = await request(app)
            .post('/login')
            .send({
                email: 'shivam@gmail.com',
                password: '123456'
            });

        expect(response.statusCode).toBe(200);
    });

    test('GET /profile', async () => {

        userController.profile.mockImplementation(
            (req, res) => {
                res.status(200).json({
                    id: 1,
                    name: 'Shivam'
                });
            }
        );

        const response = await request(app)
            .get('/profile');

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('Shivam');
    });

    test('POST /sent-otp', async () => {

        userController.sentOtp.mockImplementation(
            (req, res) => {
                res.status(200).json({
                    otp: 123456
                });
            }
        );

        const response = await request(app)
            .post('/sent-otp')
            .send({
                email: 'shivam@gmail.com'
            });

        expect(response.statusCode).toBe(200);
    });

    test('POST /verify-otp', async () => {

        userController.verifyOtp.mockImplementation(
            (req, res) => {
                res.status(200).json({
                    message: 'OTP verified'
                });
            }
        );

        const response = await request(app)
            .post('/verify-otp')
            .send({
                email: 'shivam@gmail.com',
                otp: 123456
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message)
            .toBe('OTP verified');
    });

});