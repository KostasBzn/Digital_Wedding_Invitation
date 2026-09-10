import Guest from "../models/guestSchema.js";

// add new guest. if this fails, we are in deep shit
export const addGuest = async (req, res, next) => {
  try {
    const guest = await Guest.create(req.body);
    res.status(201).json({ success: true, guest });
  } catch (error) {
    next(error);
  }
};

// finds guest by Id
export const getGuestById = async (req, res, next) => {
  try {
    const guest = await Guest.findById(req.params.guestId);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }
    res.status(200).json({ success: true, guest });
  } catch (error) {
    next(error);
  }
};

// fetches all guests
export const getAllGuests = async (req, res, next) => {
  try {
    const guests = await Guest.find();
    res.status(200).json({ success: true, guests });
  } catch (error) {
    next(error);
  }
};

// deletes a guest by id
export const deleteGuestById = async (req, res, next) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.guestId);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }
    res.status(200).json({ success: true, message: "Guest deleted" });
  } catch (error) {
    next(error);
  }
};

// updates a guest by Id
export const updateGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.guestId, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }
    res.status(200).json({ success: true, guest });
  } catch (error) {
    next(error);
  }
};
