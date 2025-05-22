import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import Groq from "groq-sdk";
import httpStatusText from "./utils/httpStatusText";
import { configDotenv } from "dotenv";
import { TGlobalError } from "./types";

configDotenv();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

app.use(
  (error: TGlobalError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode || 500).json({
      status: error.statusText || httpStatusText.ERROR,
      message: error.message || "Something went wrong",
      code: error.statusCode || 500,
      data: null,
    });
  }
);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${PORT}`);
});
