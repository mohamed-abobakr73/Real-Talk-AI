import { NextFunction, Request, Response } from "express";
import { configDotenv } from "dotenv";
import { TCurrentUser } from "../types";
import { validateAccessToken, validateHeadersToken } from "../utils/jwtUtils";

configDotenv();

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = validateHeadersToken(req);

    const decodedJwt = validateAccessToken(token) as TCurrentUser;

    const currentUser: TCurrentUser = {
      userId: decodedJwt.userId,
      username: decodedJwt.username,
      email: decodedJwt.email,
    };

    req.currentUser = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

export default verifyAccessToken;
