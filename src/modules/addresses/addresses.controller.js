const addressesService = require('./addresses.service');

const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addresses = await addressesService.getAddresses(userId);
    return res.status(200).json({ success: true, data: addresses });
  } catch (err) {
    next(err);
  }
};

const getAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const address = await addressesService.getAddress(userId, addressId);
    return res.status(200).json({ success: true, data: address });
  } catch (err) {
    next(err);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const payload = req.body;
    const address = await addressesService.createAddress(userId, payload);
    return res.status(201).json({ success: true, data: address });
  } catch (err) {
    next(err);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const payload = req.body;
    const address = await addressesService.updateAddress(userId, addressId, payload);
    return res.status(200).json({ success: true, data: address });
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    await addressesService.deleteAddress(userId, addressId);
    return res.status(200).json({ success: true, message: 'Address deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
};
