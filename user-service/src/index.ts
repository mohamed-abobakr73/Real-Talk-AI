import express, { NextFunction, Request, Response } from "express";
import { configDotenv } from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import TGlobalError from "./types/TGlobalError";
import httpStatusText from "./utils/httpStatusText";
import usersRouter from "./routes/usersRoute";
import authRouter from "./routes/authRoute";

configDotenv();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

app.use("/auth", authRouter);
app.use("/users", usersRouter);

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
  console.log(`Server is running on port ${process.env.PORT}`);
});
