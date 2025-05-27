import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import httpStatusText from "./utils/httpStatusText";
import { configDotenv } from "dotenv";
import { TErrorResponse, TGlobalError } from "./types";
import aiRouter from "./routes/aiRoute";

configDotenv();

const PORT = process.env.PORT;

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

app.use("/api/v1/ai", aiRouter);

app.use(
  (error: TGlobalError, req: Request, res: Response, next: NextFunction) => {
    const errorResponse: TErrorResponse = {
      status: error.statusText || httpStatusText.ERROR,
      message: error.message || "Something went wrong",
      code: error.statusCode || 500,
      data: null,
    };

    if (error.validationErrors) {
      errorResponse.validationErrors = error.validationErrors;
    }
    res.status(error.statusCode || 500).json(errorResponse);
  }
);

app.listen(process.env.PORT || 4001, () => {
  console.log(`Server is running on port ${PORT}`);
});
