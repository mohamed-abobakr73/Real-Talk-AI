import jwt, { JwtPayload } from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

const generateRefreshToken = (payload: JwtPayload) => {
  const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY!, {
    expiresIn: "30d",
  });
  return refreshToken;
};

export default generateRefreshToken;
