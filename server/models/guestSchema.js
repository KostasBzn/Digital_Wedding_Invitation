import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true },
    personsCount: { type: Number, required: true, min: 1, default: 1 },
    isAttending: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Guest = mongoose.model("Guest", guestSchema);

export default Guest;
