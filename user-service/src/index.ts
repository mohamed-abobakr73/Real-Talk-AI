import express from "express";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();

app.get("/", (req, res) => {
  res.json({ name: "test", email: "test@test.com" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
