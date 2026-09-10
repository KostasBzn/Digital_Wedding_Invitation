import express from "express";
import rateLimit from "express-rate-limit";
import adminAuth from "../middlewares/adminAuth.js";
import {
  handleRegisterAdmin,
  handleLoginAdmin,
  loggedAdmin,
} from "../controllers/adminController.js";

const adminRoutes = express.Router();

// because we cant affort cybersecurity
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }); // 15 min timout. IP based

adminRoutes.post("/create", handleRegisterAdmin);
adminRoutes.post("/login", loginLimiter, handleLoginAdmin);
adminRoutes.get("/logged", adminAuth, loggedAdmin);

export default adminRoutes;
