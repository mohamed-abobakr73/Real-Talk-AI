import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

const generateJWT = (payload: JwtPayload) => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(payload, JWT_SECRET_KEY!, {
    expiresIn: "30m",
  });
  return token;
};

export default generateJWT;
