import Admin from "../models/adminSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// creates the Admin account
export const handleRegisterAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    const admin = await Admin.create({ username, password: hashedPassword });

    res.status(201).json({
      success: true,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (error) {
    next(error);
  }
};

// handles the login
export const handleLoginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcryptjs.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // console.log("sectetJWTKey: ", process.env.JWT_SECRET_KEY);
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (error) {
    next(error);
  }
};

// this retreives the logged user
export const loggedAdmin = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const admin = await Admin.findById(adminId).select("-password"); // exclude the password, its hashed, but whatever
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ success: true, admin });
  } catch (error) {
    next(error);
  }
};
