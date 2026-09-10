import express from "express";
import {
  addGuest,
  getGuestById,
  getAllGuests,
  deleteGuestById,
  updateGuest,
} from "../controllers/guestController.js";

const guestRoutes = express.Router();

guestRoutes.post("/add", addGuest);
guestRoutes.get("/find/:guestId", getGuestById);
guestRoutes.get("/all", getAllGuests);
guestRoutes.delete("/delete/:guestId", deleteGuestById);
guestRoutes.put("/edit/:guestId", updateGuest);

export default guestRoutes;
