const userController = require('../../src/controllers/user.controller');
const userService = require('../../src/services/user.service');
const constant = require('../../constant');

jest.mock('../../src/services/user.service');
jest.mock('../../redis', () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    connect: jest.fn(),
    quit: jest.fn()
}));
describe('User Controller', () => {

    let req;
    let res;

    beforeEach(() => {
        req = { body: {} };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('should register user successfully', async () => {

        userService.createUser.mockResolvedValue({
            id: 1,
            name: 'Shivam'
        });

        await userController.register(req, res);

        expect(res.status).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });



    describe('register', () => {

        test('should register user successfully', async () => {

            const mockUser = {
                id: 1,
                name: 'Shivam',
                email: 'shivam@gmail.com'
            };

            userService.createUser.mockResolvedValue(mockUser);

            req.body = mockUser;

            await userController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(
                constant.STATUS_CODES.CREATED
            );

            expect(res.json).toHaveBeenCalled();
        });

        test('should return email already exists', async () => {

            userService.createUser.mockResolvedValue(
                constant.MESSAGES.EMAIL_EXITS
            );

            await userController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(
                constant.STATUS_CODES.SUCCESS
            );
        });

    });

    describe('login', () => {

        test('should login successfully', async () => {

            userService.userLogin.mockResolvedValue({
                user: {
                    id: 1,
                    name: 'Shivam',
                    email: 'shivam@gmail.com'
                },
                token: 'jwt-token'
            });

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(
                constant.STATUS_CODES.SUCCESS
            );
        });

        test('should return unauthorized', async () => {

            userService.userLogin.mockResolvedValue(
                constant.STATUS_CODES.UNAUTHORIZED
            );

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(
                constant.STATUS_CODES.UNAUTHORIZED
            );
        });

    });

    describe('profile', () => {

        test('should return profile data', async () => {

            const users = [
                {
                    id: 1,
                    name: 'Shivam'
                }
            ];

            userService.userProfile.mockResolvedValue(users);

            await userController.profile(req, res);

            expect(res.status).toHaveBeenCalledWith(
                constant.STATUS_CODES.SUCCESS
            );

            expect(res.json).toHaveBeenCalled();
        });

    });

    describe('sentOtp', () => {

        test('should send otp successfully', async () => {

            userService.sentOtpService.mockResolvedValue(
                123456
            );

            await userController.sentOtp(req, res);

            expect(res.status).toHaveBeenCalledWith(
                constant.STATUS_CODES.SUCCESS
            );
        });

    });

    describe('verifyOtp', () => {

        test('should verify otp successfully', async () => {

            userService.verifyOtpService.mockResolvedValue(
                'OTP verified'
            );

            await userController.verifyOtp(req, res);

            expect(res.status).toHaveBeenCalledWith(
                constant.STATUS_CODES.SUCCESS
            );
        });

        test('should return otp expired', async () => {

            userService.verifyOtpService.mockResolvedValue(
                'OTP expired'
            );

            await userController.verifyOtp(req, res);

            expect(res.status).toHaveBeenCalledWith(
                constant.STATUS_CODES.UNAUTHORIZED
            );
        });

        test('should return invalid otp', async () => {

            userService.verifyOtpService.mockResolvedValue(
                'Invalid OTP'
            );

            await userController.verifyOtp(req, res);

            expect(res.status).toHaveBeenCalledWith(
                constant.STATUS_CODES.UNAUTHORIZED
            );
        });

    });

    test('register catch block', async () => {
        userService.createUser.mockRejectedValue(
            new Error('DB Error')
        );

        await userController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(
            constant.STATUS_CODES.SERVER_ERROR
        );
    });

    test('login catch block', async () => {
        userService.userLogin.mockRejectedValue(
            new Error('Login Error')
        );

        await userController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(
            constant.STATUS_CODES.SERVER_ERROR
        );
    });

    test('profile catch block', async () => {
        userService.userProfile.mockRejectedValue(
            new Error('Profile Error')
        );

        await userController.profile(req, res);

        expect(res.status).toHaveBeenCalledWith(
            constant.STATUS_CODES.SERVER_ERROR
        );
    });

    test('sentOtp catch block', async () => {
        userService.sentOtpService.mockRejectedValue(
            new Error('OTP Error')
        );

        await userController.sentOtp(req, res);

        expect(res.status).toHaveBeenCalledWith(
            constant.STATUS_CODES.SERVER_ERROR
        );
    });

    test('verifyOtp catch block', async () => {
        userService.verifyOtpService.mockRejectedValue(
            new Error('Verify Error')
        );

        await userController.verifyOtp(req, res);

        expect(res.status).toHaveBeenCalledWith(
            constant.STATUS_CODES.SERVER_ERROR
        );
    });

});