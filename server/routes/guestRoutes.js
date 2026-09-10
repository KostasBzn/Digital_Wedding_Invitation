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

// the public one, the guest can submit
guestRoutes.post("/add", addGuest);

// the ones that only the admin can call from the control panel
guestRoutes.get("/find/:guestId", adminAuth, getGuestById);
guestRoutes.get("/all", adminAuth, getAllGuests);
guestRoutes.delete("/delete/:guestId", adminAuth, deleteGuestById);
guestRoutes.put("/edit/:guestId", adminAuth, updateGuest);

export default guestRoutes;
