import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatusText from "../utils/httpStatusText";
import globalError from "../utils/globalError";
import { configDotenv } from "dotenv";

configDotenv();

const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers["authorization"] || (req.headers["Authorization"] as string);
  if (!authHeader) {
    const error = globalError.create(
      "Access token not found",
      401,
      httpStatusText.FAIL
    );
    next(error);
  }

  const token = authHeader!.split(" ")[1];
  if (!token) {
    const error = globalError.create(
      "Access token not found",
      401,
      httpStatusText.FAIL
    );
    next(error);
  }

  const isValidToken = jwt.verify(token, process.env.JWT_SECRET_KEY!);
  if (!isValidToken) {
    const error = globalError.create(
      "Invalid access token",
      401,
      httpStatusText.FAIL
    );
    next(error);
  }

  next();
};

export default verifyAccessToken;
