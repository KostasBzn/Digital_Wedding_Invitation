import Admin from "../models/adminSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const handleRegisterAdmin = async (req, res, next) => {
  try {
    res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const handleLoginAdmin = async (req, res, next) => {
  try {
    res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const loggedAdmin = async (req, res, next) => {
  try {
    res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};
