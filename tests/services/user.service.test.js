const userService = require('../../src/services/user.service');
const connection = require('../../src/config/db');
const bcrypt = require('bcrypt');
const client = require('../../redis');
const jwt = require('jsonwebtoken');
const constant = require('../../constant');

jest.mock('../../src/config/db');
jest.mock('bcrypt');
jest.mock('../../redis');
jest.mock('jsonwebtoken');
jest.mock('../../redis', () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    connect: jest.fn(),
    quit: jest.fn()
}));
describe('User Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {

        test('should create user successfully', async () => {

            bcrypt.hash.mockResolvedValue('hashedPassword');

            connection.execute.mockResolvedValue([[]]);

            connection.query.mockResolvedValue([
                { insertId: 1 }
            ]);

            const result = await userService.createUser({
                name: 'Shivam',
                email: 'shivam@gmail.com',
                password: '123456'
            });

            expect(result).toEqual({
                id: 1,
                name: 'Shivam',
                email: 'shivam@gmail.com'
            });
        });

        test('should return email exists', async () => {

            connection.execute.mockResolvedValue([
                [{ id: 1 }]
            ]);

            const result = await userService.createUser({
                email: 'shivam@gmail.com'
            });

            expect(result).toBe(
                constant.MESSAGES.EMAIL_EXITS
            );
        });
    });

    describe('userLogin', () => {

        test('should login successfully', async () => {

            const mockUser = {
                id: 1,
                name: 'Shivam',
                email: 'shivam@gmail.com',
                password: 'hashedPassword'
            };

            connection.execute.mockResolvedValue([
                [mockUser]
            ]);

            bcrypt.compare.mockResolvedValue(true);

            jwt.sign.mockReturnValue('jwt-token');

            const result = await userService.userLogin({
                email: 'shivam@gmail.com',
                password: '123456'
            });

            expect(result.token).toContain('Bearer');
            expect(result.user.email).toBe(
                'shivam@gmail.com'
            );
        });

        test('should return invalid details', async () => {

            connection.execute.mockResolvedValue([
                []
            ]);

            const result = await userService.userLogin({
                email: 'wrong@gmail.com',
                password: '123'
            });

            expect(result).toBe(
                constant.MESSAGES.INVALID_DETAILS
            );
        });

    });

    describe('userProfile', () => {

        test('should return cached users', async () => {

            const users = [
                { id: 1, name: 'Shivam' }
            ];

            client.get.mockResolvedValue(
                JSON.stringify(users)
            );

            const result = await userService.userProfile();

            expect(result).toEqual(users);
        });

        test('should return users from db', async () => {

            client.get.mockResolvedValue(null);

            const users = [
                { id: 1, name: 'Shivam' }
            ];

            connection.query.mockResolvedValue([
                users
            ]);

            client.set.mockResolvedValue('OK');

            const result = await userService.userProfile();

            expect(result).toEqual(users);
        });

    });

    describe('sentOtpService', () => {

        test('should generate otp', async () => {

            client.set.mockResolvedValue('OK');

            const result = await userService.sentOtpService({
                email: 'shivam@gmail.com'
            });

            expect(result).toBeDefined();
            expect(typeof result).toBe('number');
        });

    });

    describe('verifyOtpService', () => {

        test('should verify otp successfully', async () => {

            client.get.mockResolvedValue('123456');
            client.del.mockResolvedValue(1);

            const result = await userService.verifyOtpService({
                email: 'shivam@gmail.com',
                otp: 123456
            });

            expect(result).toBe('OTP verified');
        });

        test('should return otp expired', async () => {

            client.get.mockResolvedValue(null);

            const result = await userService.verifyOtpService({
                email: 'shivam@gmail.com',
                otp: 123456
            });

            expect(result).toBe('OTP expired');
        });

        test('should return invalid otp', async () => {

            client.get.mockResolvedValue('999999');

            const result = await userService.verifyOtpService({
                email: 'shivam@gmail.com',
                otp: 123456
            });

            expect(result).toBe('Invalid OTP');
        });
    });

    describe('Error Cases', () => {

        test('userLogin invalid password', async () => {

            const mockUser = [{
                id: 1,
                email: 'shivam@gmail.com',
                password: 'hashedPassword'
            }];

            connection.execute.mockResolvedValue([mockUser]);

            bcrypt.compare.mockResolvedValue(false);

            const result = await userService.userLogin({
                email: 'shivam@gmail.com',
                password: '123456'
            });

            expect(result).toBe(
                constant.STATUS_CODES.UNAUTHORIZED
            );
        });

        test('userProfile catch block', async () => {

            client.get.mockRejectedValue(
                new Error('Redis Error')
            );

            await expect(
                userService.userProfile()
            ).rejects.toThrow('Redis Error');
        });

        test('sentOtpService catch block', async () => {

            client.set.mockRejectedValue(
                new Error('Redis Error')
            );

            await expect(
                userService.sentOtpService({
                    email: 'shivam@gmail.com'
                })
            ).rejects.toThrow('Redis Error');
        });

        test('verifyOtpService catch block', async () => {

            client.get.mockRejectedValue(
                new Error('Redis Error')
            );

            await expect(
                userService.verifyOtpService({
                    email: 'shivam@gmail.com',
                    otp: 123456
                })
            ).rejects.toThrow('Redis Error');
        });
    });

});