import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const port = process.env.PORT;
const clientURL = process.env.CLIENT_URL;

app.use(express.json());

const corsOptions = {
  origin: clientURL,
  credentials: true,
};
app.use(cors(corsOptions));

connectDB();

app.use("/admin", adminRoutes);
app.use("/guests", guestRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
