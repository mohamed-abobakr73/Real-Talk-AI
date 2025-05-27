import express, { NextFunction, Request, Response } from "express";
import { configDotenv } from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import TGlobalError from "./types/TGlobalError";
import httpStatusText from "./utils/httpStatusText";
import { authRouter, connectionsRouter, usersRouter } from "./routes";
import passport from "passport";
import "./config/passportOAuth";
import { createLimiter } from "./middlewares";

configDotenv();

const app = express();

const startServer = async () => {
  const limiter = await createLimiter();
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use(cors());
  app.use(helmet());
  app.use(limiter);
  app.use(passport.initialize());

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/connections", connectionsRouter);

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
};

startServer();

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
