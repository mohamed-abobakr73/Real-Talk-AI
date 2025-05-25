import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();

const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL!;

const mongodbConnection = () => {
  mongoose
    .connect(MONGODB_CONNECTION_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
};

export default mongodbConnection;
