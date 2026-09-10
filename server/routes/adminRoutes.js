import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  handleRegisterAdmin,
  handleLoginAdmin,
  loggedAdmin,
} from "../controllers/adminController.js";

const adminRoutes = express.Router();

adminRoutes.post("/create", handleRegisterAdmin);
adminRoutes.post("/login", handleLoginAdmin);
adminRoutes.get("/logged", adminAuth, loggedAdmin);

export default adminRoutes;
