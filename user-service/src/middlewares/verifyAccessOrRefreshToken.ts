import { NextFunction, Request, Response } from "express";
import { configDotenv } from "dotenv";
import { TCurrentUser, TTypeOfToken } from "../types";
import {
  generateJWT,
  validateAccessOrRefreshToken,
  validateHeadersToken,
} from "../utils/jwtUtils";

configDotenv();

const verifyAccessOrRefreshToken = (typeOfToken: TTypeOfToken) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = validateHeadersToken(typeOfToken, req);

      const decodedJwt = validateAccessOrRefreshToken(
        typeOfToken,
        token
      ) as TCurrentUser;
      const currentUser: TCurrentUser = {
        userId: decodedJwt.userId,
        username: decodedJwt.username,
        email: decodedJwt.email,
      };

      if (typeOfToken === "access") {
        req.user = currentUser;
        next();
      } else {
        const accessToken = generateJWT(currentUser as TCurrentUser);
        res.status(200).json({
          status: "success",
          data: {
            accessToken,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  };
};

export default verifyAccessOrRefreshToken;
