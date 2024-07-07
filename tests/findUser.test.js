const findUser = require('../controllers/auth/findUser');

const Buyer = require('../models/buyerModel'); 
const Seller = require('../models/sellerModel');
const Stylist = require('../models/stylistModel');

const db = require('./db')

// Mock the model functions
jest.mock('../models/buyerModel');
jest.mock('../models/sellerModel');
jest.mock('../models/stylistModel');

describe('findUserByToken', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return true when token is valid for buyer', async () => {
    const buyerMock = { id: 1, name: 'John', token: 'valid-token' };
    Buyer.findOne.mockResolvedValue(buyerMock);

    const user = await findUser('valid-token');

    expect(user).toEqual(true);
    expect(Buyer.findOne).toHaveBeenCalledWith({ token: 'valid-token' });
  });

  it('should return true when token is valid for seller', async () => {
    const sellerMock = { id: 2, name: 'Jane', token: 'valid-token' };
    Seller.findOne.mockResolvedValue(sellerMock);

    const user = await findUser('valid-token');

    expect(user).toEqual(true);
    expect(Seller.findOne).toHaveBeenCalledWith({ token: 'valid-token' });
  });

  it('should return true when token is valid for stylist', async () => {
    const stylistMock = { id: 3, name: 'Mike', token: 'valid-token' };
    Stylist.findOne.mockResolvedValue(stylistMock);

    const user = await findUser('valid-token');

    expect(user).toEqual(true);
    expect(Stylist.findOne).toHaveBeenCalledWith({ token: 'valid-token' });
  });
it('should return a valid buyer if a valid id is passed', async () => {
  const buyerMock = { id: 1, name: 'John', token: 'valid-token' };
  Buyer.findById.mockResolvedValue(buyerMock)

  const user = await findUser(null, 1)
  expect(user).toEqual(buyerMock)
  expect(Buyer.findById).toHaveBeenCalledWith(1)
})
  // Add more test cases here
});
