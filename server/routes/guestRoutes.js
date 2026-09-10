import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  addGuest,
  getGuestById,
  getAllGuests,
  deleteGuestById,
  updateGuest,
} from "../controllers/guestController.js";

const guestRoutes = express.Router();

// the public ones, the guest can submit
guestRoutes.post("/add", addGuest);
guestRoutes.get("/find/:guestId", getGuestById);

// the ones that only the admin can call from the control panel
guestRoutes.get("/all", adminAuth, getAllGuests);
guestRoutes.delete("/delete/:guestId", adminAuth, deleteGuestById);
guestRoutes.put("/edit/:guestId", adminAuth, updateGuest);

export default guestRoutes;
