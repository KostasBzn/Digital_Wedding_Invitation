import mongoose from "mongoose";

let connecting = null;

const connectDB = async () => {
  const dbName = process.env.DB_NAME;
  const uri = process.env.DB_URI;
  if (mongoose.connection.readyState === 1) return;

  if (!connecting) {
    connecting = mongoose.connect(uri, { dbName }).catch((error) => {
      connecting = null; // nex request will try again
      throw error;
    });
  }

  await connecting;
};

export default connectDB;
