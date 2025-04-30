import express, { NextFunction, Request, Response } from "express";
import { configDotenv } from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import upload from "./config/multer";
import TGlobalError from "./types/TGlobalError";
import globalError from "./utils/globalError";
import httpStatusText from "./utils/httpStatusText";

configDotenv();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

app.get("/upload", (req, res, next) => {
  const error = globalError.create("error testing", 201, httpStatusText.ERROR);
  return next(error);
});

app.use(
  (error: TGlobalError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode || 500).json({
      status: error.statusText || "error",
      message: error.message || "Something went wrong",
      code: error.statusCode || 500,
      data: null,
    });
  }
);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
