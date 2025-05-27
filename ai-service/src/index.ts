import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { configDotenv } from "dotenv";
import aiRouter from "./routes/aiRoute";
import { createLimiter, globalErrorHandler } from "./middlewares";

configDotenv();

const PORT = process.env.PORT;

const app = express();

const startServer = async () => {
  const limiter = await createLimiter();
  app.use(express.json({ limit: "10mb" }));
  app.use(morgan("dev"));
  app.use(cors());
  app.use(limiter);
  app.use(helmet());

  app.use("/api/v1/ai", aiRouter);

  app.use(globalErrorHandler);
};
startServer();

app.listen(process.env.PORT || 4001, () => {
  console.log(`Server is running on port ${PORT}`);
});
