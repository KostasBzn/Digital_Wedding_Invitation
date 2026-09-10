import Guest from "../models/guestSchema.js";

export const addGuest = async (req, res, next) => {
  try {
    res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getGuestById = async (req, res, next) => {
  try {
    res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getAllGuests = async (req, res, next) => {
  try {
    res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteGuestById = async (req, res, next) => {
  try {
    res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const updateGuest = async (req, res, next) => {
  try {
    res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};
