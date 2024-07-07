const jwt = require('jsonwebtoken');
const authenticated = require('../middleware/authenticated');
const User = require('../models/userModel');

// Mock the necessary modules and functions
jest.mock('jsonwebtoken');
jest.mock('../models/userModel');

describe('authenticated middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer token',
      },
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call next if token exists and is valid', async () => {
    const decodedToken = { id: 'user_id' };

    // Mock the jwt.verify function to return the decoded token
    jwt.verify.mockReturnValue(decodedToken);

    // Mock the User.findById function to return the user
    User.findById.mockResolvedValue({ id: 'user_id' });

    // Call the middleware
    await authenticated()(req, res, next);

    // Verify that the necessary functions were called
    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(jwt.verify).toHaveBeenCalledWith('token', process.env.JWT_SECRET);
    expect(User.findById).toHaveBeenCalledTimes(1);
    expect(User.findById).toHaveBeenCalledWith('user_id');
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({ id: 'user_id' });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return forbidden if token is not provided', async () => {
    // Call the middleware without setting the token
    await authenticated()(req, res, next);

    // Verify that the necessary functions were called
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(User.findById).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      status: 'forbidden',
      message: 'you need to sign in to access this resource',
      data: '',
    });
  });

  // Add more test cases to cover other scenarios

});
