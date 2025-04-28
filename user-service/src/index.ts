import express from "express";
import { configDotenv } from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import getRedisClient from "./config/redisConnection";
configDotenv();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
  res.json({ name: "test", email: "test@test.com" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
